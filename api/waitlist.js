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
            subject: "You're on the Zenora Waitlist 🚀",
            html: `
            <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:20px;">
                
                <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:12px;">
                    
                    <h2 style="color:#1e3a8a;">Welcome to Zenora 🚀</h2>

                    <p>Hi ${name},</p>

                    <p>Thank you for joining the Zenora waitlist.</p>

                    <p>
                        We're building a smarter way to manage your finances —
                        with real-time insights and intelligent alerts.
                    </p>

                    <p>
                        Our product is launching soon, and you'll be among the first to get access.
                    </p>

                    <p style="margin-top:20px;">
                        Thank you for your patience ❤️
                    </p>

                    <p style="margin-top:25px; font-weight:600;">
                        — Team Zenora
                    </p>

                    <div style="margin-top:20px; text-align:center;">
                        <img src="https://zenoraapp.in/assets/logo.png" 
                             style="width:120px;">
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