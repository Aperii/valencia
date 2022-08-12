import { Router } from "express";
import { getUser } from "../../../handlers/Users";
import { collections } from "../../../services/database.service";
import { sendError } from "../../../utils/Utils";

const router = Router()

router.get("/", async (req, res) => {
    const {type, id} = req.query

    if(!type || !id) return sendError(res, 400, "Missing type or id query parameter.")

    let connection = await collections.connections.findOne({serviceId: id, type: type.toString().toLowerCase()})

    if(!connection) return sendError(res, 404, "No user found with that connection.")

    res.send(await getUser(connection.user, req.me.id === connection.user))
})

export default router