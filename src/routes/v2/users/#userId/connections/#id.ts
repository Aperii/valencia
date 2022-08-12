import { Router } from "express";
import { collections } from "../../../../../services/database.service";
import { sendError } from "../../../../../utils/Utils";

const router = Router()

router.get("/", async (req, res) => {
    let { id } = req.parameters

    if(!id) return sendError(res, 400, "No id provided.")

    const connection = await collections.connections.findOne({id, visible: true}, {projection: {
        _id: 0,
        meta: 0,
        visible: 0,
    }})

    if(!connection) return sendError(res, 404, "Connection not found.")

    res.send(connection)
})

router.delete("/", async (req, res) => {
    let { id } = req.parameters

    if(!id) return sendError(res, 400, "No id provided.")

    let deleted = await collections.connections.deleteOne({id, user: req.me.id})

    if(deleted.deletedCount === 0) return sendError(res, 404, "Connection not found.")

    let connections = await collections.connections.find({id, visible: true}, {projection: {
        _id: 0,
        meta: 0,
        visible: 0,
    }}).toArray()

    res.send(connections)
})

export default router