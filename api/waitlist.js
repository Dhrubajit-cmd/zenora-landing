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
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
        
        <div style="max-width:600px; margin:auto; background:white; padding:35px; border-radius:16px;">
            
            <!-- HEADER (FIXED ALIGNMENT) -->
            <table style="margin-bottom:20px;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="vertical-align:middle; padding-right:10px;">
                        <img src="https://zenoraapp.in/assets/logo.png" 
                             style="width:26px; height:26px; display:block;">
                    </td>
                    <td style="vertical-align:middle;">
                        <h2 style="color:#1e3a8a; margin:0; font-size:22px;">
                            Welcome to Zenora
                        </h2>
                    </td>
                </tr>
            </table>

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

            <!-- SIGNATURE (FIXED SPACING) -->
            <table style="margin-top:30px;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="vertical-align:middle;">
                        <span style="font-weight:600;">— Team Zenora</span>
                    </td>
                    <td style="vertical-align:middle; padding-left:8px;">
                        <img src="https://zenoraapp.in/assets/logo.png" 
                             style="width:18px; height:18px; display:block;">
                    </td>
                </tr>
            </table>

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