import nodemailer from "nodemailer";
import pool from "../lib/db.js";
import { google } from "googleapis";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { name, email } = req.body;

    try {
        // =====================
        // SAVE TO GOOGLE SHEETS
        // =====================
        try {
            const auth = new google.auth.GoogleAuth({
                credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });

            const sheets = google.sheets({ version: "v4", auth });

            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.SHEET_ID,
                range: "Sheet1!A:C",
                valueInputOption: "RAW",
                requestBody: {
                    values: [[name, email, new Date().toLocaleString()]],
                },
            });

        } catch (sheetErr) {
            console.error("Sheets Error:", sheetErr);
        }

        // =====================
        // SETUP EMAIL
        // =====================
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // =====================
        // EMAIL TO YOU
        // =====================
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Waitlist Signup 🚀",
            text: `New user joined Zenora 🚀

Name: ${name}
Email: ${email}
Time: ${new Date().toLocaleString()}`
        });

        // =====================
        // EMAIL TO USER ✅ (FIXED)
        // =====================
        await transporter.sendMail({
            from: `"Zenora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "You're on the Zenora Waitlist",
            html: `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:20px;">
        
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:12px;">
            
            <!-- HEADER WITH LOGO -->
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                <img src="https://zenoraapp.in/assets/logo.png" 
                     style="width:28px; height:28px;">
                <h2 style="color:#1e3a8a; margin:0;">
                    Welcome to Zenora
                </h2>
            </div>

            <p style="color:#334155;">Hi ${name},</p>

            <p style="color:#475569;">
                Thank you for joining the Zenora waitlist.
            </p>

            <p style="color:#475569;">
                We're building a smarter way to manage your finances —
                with real-time insights, intelligent alerts, and seamless tracking.
            </p>

            <p style="color:#475569;">
                Our product is launching soon, and you'll be among the first to get access.
            </p>

            <p style="margin-top:20px; color:#475569;">
                Thank you for your patience and support.
            </p>

            <!-- SIGNATURE WITH LOGO -->
            <div style="margin-top:30px; display:flex; align-items:center; gap:8px;">
                <span style="font-weight:600;">— Team Zenora</span>
                <img src="https://zenoraapp.in/assets/logo.png" 
                     style="width:20px; height:20px;">
            </div>

        </div>
    </div>
    `
        });

        res.status(200).json({ success: true });

    } catch (err) {
        console.error("FINAL ERROR:", err);
        res.status(500).json({ error: "Something failed" });
    }
}