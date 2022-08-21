import { UUID } from "bson";
import { sign } from "jsonwebtoken";
import Config from "../Config";
import * as nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer";

//You will need to change this if you don't use GMail.
let transporter = nodemailer.createTransport({
    host: "imap.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: Config.EMAIL,
        pass: Config.EMAIL_PASS
    }
})

export function generateEmailVerificationToken(userId: string, email: string) {
    return sign({
        user: userId,
        email,
        r: UUID.generate().toString()
    }, Config.EMAIL_VERIFICATION_SECRET, {expiresIn: "15m"})
}

export async function sendMail(recipient: string, subject: string, text: string, html?: boolean) {
    let opts: Mail.Options = {
        from: `"Aperii" <${Config.EMAIL}>`,
        to: recipient,
        subject: subject
    }
    if(html) opts.html = text; else opts.text = text
    await transporter.sendMail(opts)
}

export async function sendVerificationEmail(recipient, token) {
    await sendMail(recipient, "Verify your email.", `<a href="https://aperii.com/settings/account/verify-email?token=${token}">Click here to verify your email</a>`, true)
}