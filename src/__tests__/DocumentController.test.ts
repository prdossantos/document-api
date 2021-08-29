import { Request, Response } from "express";
import { expects, mockRequest, mockResponse } from "../../jest.utils";
import DocumentController from "../controllers/DocumentController";
import { unmaskDocument } from "../helper";
import DocumentModel from "../models/DocumentModel";
const mockingoose = require("mockingoose");

jest.mock("../mongo.connection", () =>( { isDBConnected: jest.fn(() => () => true) } ));

expect.extend(expects);

describe("test DocumentController::create", () => {

    it("case 1. validation error when creating a new doument", async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {};

        mockingoose(DocumentModel).toReturn({}, "find");

        await DocumentController.create(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson("error", "document validation failed")
        );
    });

    it("case 2. when a document is invalid", async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            document: "12345678901"
        }

        mockingoose(DocumentModel).toReturn({}, "find");

        await DocumentController.create(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson("error", "is not a valid document")
        );
    });

    it("case 3. when a new document is created", async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            document: "795.687.370-30"
        }

        mockingoose(DocumentModel).toReturn({}, "find");

        await DocumentController.create(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson("document", unmaskDocument(req.body.document))
        );
    });
});


describe("test DocumentController::getDocuments", () => {

    it("case 1. doesn't have documents", async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.body = {}

        mockingoose(DocumentModel).toReturn([], "find");

        await DocumentController.getDocuments(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson("success", true)
        );
    });

    it("case 2. use filters ", async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.query = {
            document: "795.687.370-30",
            isBlacklist: false
        }

        mockingoose(DocumentModel).toReturn([], "find");

        await DocumentController.getDocuments(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson("success", true)
        );
    });
});


describe("test DocumentController::update", () => {

    it("case 2. send a document to blacklist", async () => {

        const req = mockRequest();
        const res = mockResponse();
        req.params = {document: "795.687.370-30"}


        mockingoose(DocumentModel).toReturn({}, "findOne");
        mockingoose(DocumentModel).toReturn({}, "updateOne");

        await DocumentController.update(req as Request, res as Response);

        expect(res.json).toHaveBeenCalledWith(
            //@ts-ignore
            expect.toBeInJson("success", true)
        );
    });

});