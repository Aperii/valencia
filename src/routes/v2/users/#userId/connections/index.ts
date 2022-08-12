import axios from "axios";
import { Request, response, Response, Router } from "express";
import { collections } from "../../../../../services/database.service";
import { Snowflake } from "../../../../../utils/Snowflake";
import { sendError } from "../../../../../utils/Utils";

const router = Router();

type AddConnectionBody = {
    discordToken?: string
}

type DiscordUser = {
    id: string,
    username: string,
    avatar?: string,
    avatar_decoration?: string,
    discriminator: string,
    public_flags: number,
    flags: number,
    banner?: string,
    banner_color?: string,
    accent_color?: number,
    locale: string,
    mfa_enabled: boolean,
    premium_type: number
}

router.put("/", (req, res) => {
    if(!req.user || req.user.id !== req.me.id) {
        sendError(res, 403, "You are not allowed to edit this user");
        return;
    }

    let body = req.body as AddConnectionBody
    
    if(body.discordToken) {
        axios.get("https://discord.com/api/v10/users/@me", {
            headers: {
                authorization: `Bearer ${body.discordToken}`
            }
        }).then(async response => {
            let dUser = response.data as DiscordUser
            let conn = await collections.connections.findOne({user: req.me.id, serviceId: dUser.id, type: "discord"})
            if(!conn) {
                collections.connections.insertOne({id: Snowflake.generate(), user: req.me.id, serviceId: dUser.id, type: "discord", visible: true, meta: dUser})
                res.send({successful: true})
            } else {
                collections.connections.updateOne({user: req.me.id, serviceId: dUser.id, type: "discord"}, {$set: {meta: dUser}})
                res.send({successful: true})
            }
            
        }).catch(e => {
            sendError(res, 500, "Failed to retrive Discord account information.")
        })
    }

    if(!body.discordToken) sendError(res, 400, "No usable account information given.")

})

router.get("/", async (req, res) => {
    if(!req.user) return sendError(res, 404, "No user found with the specified id or username.")
    let connections = await collections.connections.find({user: req.user.id, visible: true}, {projection: {
        _id: 0,
        meta: 0,
        visible: 0,
    }}).toArray()
    res.send(connections)
})

export default router;