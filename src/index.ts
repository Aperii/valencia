import express, { response, Response } from 'express';
import { connectToDatabase } from "./services/database.service";
import cors from 'cors';
import Log from './middleware/Log';
import Authentication from './middleware/Authentication';
import Errors from './middleware/Errors';
import { v2Router } from './routes/v2';
import { cdnRouter } from './routes/cdn';
import multer from 'multer';

connectToDatabase().then(() => {
    console.log("Connected to database");

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(multer().array("avatar", 1));

    app.use(Log());
    app.use(Errors());

    app.use('/v2', Authentication() ,v2Router);
    app.use('/cdn', cdnRouter)

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

}).catch((err) => {
    console.log("Error connecting to database: ", err);
});