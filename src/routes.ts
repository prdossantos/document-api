import express from "express";
import DocumentController from "./controllers/DocumentController";
import process from "process";
import MonitorModel from "./models/MonitorModel";

const routes = express.Router();

// Routes
routes.get("/", async (req, res, next) => {

    const uptime = `${Math.floor(process.uptime())} seconds`;
    const countReqs = await MonitorModel.count();

    res.status(200).send({
        title: "Document API",
        version: "1.0.0",
        uptime,
        countReqs
    });
});

routes.post( "/document",           DocumentController.create);
routes.put(  "/document/:document",  DocumentController.update);
routes.get(  "/documents",          DocumentController.getDocuments);

export default routes;