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
        // SAVE TO GOOGLE SHEETS (PRIMARY STORAGE)
        // =====================
        try {
            const auth = new google.auth.GoogleAuth({
                credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });

            const sheets = google.sheets({ version: "v4", auth });

            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.SHEET_ID,
                range: "Zenora Waitlist!A:C",
                valueInputOption: "RAW",
                requestBody: {
                    values: [[name, email, new Date().toLocaleString()]],
                },
            });

        } catch (sheetErr) {
            console.error("Sheets Error:", sheetErr);
        }

        // =====================
        // SEND EMAIL
        // =====================
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "New Waitlist Signup 🚀",
            text: `New user joined Zenora 🚀

Name: ${name}
Email: ${email}
Time: ${new Date().toLocaleString()}`
        });

        res.status(200).json({ success: true });

    } catch (err) {
        console.error("FINAL ERROR:", err);
        res.status(500).json({ error: "Something failed" });
    }
}