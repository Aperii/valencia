import { Router } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import Config from "../../../../Config";
import { collections } from "../../../../services/database.service";
import { generateEmailVerificationToken, sendVerificationEmail } from "../../../../utils/Email";
import RateLimiters from "../../../../utils/RateLimiters";
import { sendError } from "../../../../utils/Utils";

const router = Router();

router.post("/", RateLimiters.Auth, async (req, res) => {
    if(req.me !== req.user) return sendError(res, 403, "You can only verify yourself.")
    if(req.me.verifiedEmail) return sendError(res, 400, "Email already verified.")

    if(req.body.verifyToken) {
        verify(req.body.verifyToken, Config.EMAIL_VERIFICATION_SECRET, (err: JsonWebTokenError, decoded: any) => {
            if(err) return sendError(res, 400, "Invalid verification token.")
            if(decoded.user != req.me.id) return sendError(res, 400, "Invalid verification token.")
            collections.users.updateOne({id: req.me.id}, {$set: {verifiedEmail: true}})
            return res.send({message: "Email successfully verified."})
        })
    } else {
        sendVerificationEmail(req.me.email, generateEmailVerificationToken(req.me.id, req.me.email)).then(() => {
            res.send({message: "Verification email sent successfully."})
        }).catch(() => {
            sendError(res, 500, "Failed to send email.")
        })
    }
})

export default router