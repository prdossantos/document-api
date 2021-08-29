import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./src/routes";
import mdbConnection from "./src/mongo.connection";
import { logger, responseError } from "./src/helper";
import MonitorModel from "./src/models/MonitorModel";
const pino = require("pino-http")();

const app = express();

require("dotenv").config({
    path: ".env",
});

const port = process.env.NODE_PORT || "8080";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

app.use(cors());

app.listen(port, () => {
    logger.info(`app listening on port ${port}`);

    mdbConnection().then( (connection) => {
        logger.info("MongoDB connected");
    }).catch( ( e ) => {
        logger.error(`Mongodb connection error: ${e.message}`);
    });
})
app.use((req, res, next) => {

    MonitorModel.create({
        request: {
            "method": req.method,
            "route": req.route,
            "query": req.query,
            "params": req.params,
            "headers": req.headers,
            "remoteAddress": req.ips,
            "path": req.path
        }
    });

    next();
});

//Routes
app.use("/", routes);

//Response Middleware
app.use((req, res, next) => {
    if( res.statusCode >= 400 ) {
        res.status(res.statusCode).send(responseError(res.statusMessage || "Method not found"));
    } else {
        res.status(404).send(responseError(res.statusMessage || "Method not found"));
    }
});