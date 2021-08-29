import express from "express";
import { logger, responseError, responseSuccess, unmaskDocument } from "../helper";
import { isDBConnected } from "../mongo.connection";
import DocumentModel, { Document } from "../models/DocumentModel";


class DocumentController {
    
    /**
     * Creates a new document
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    async create( req: express.Request, res: express.Response ) {
        
        let {document} = req.body
        document = unmaskDocument(document)

        const doc = new DocumentModel({document});
        const hasErrors = doc.validateSync();

        if( hasErrors )        
            return res.status(400).json(responseError(hasErrors.message));

        if( !isDBConnected() )
            return res.status(400).json(responseError("Your DB isn\"t started, but your request is ok!"));

        try {
            const saved = await doc.save();
            doc._id = saved._id;
        } catch( e ) {
            logger.error(e.message);
            return res.status(400).json(responseError(e.message));
        }

        return res.json(responseSuccess<Document>(doc));
    }
    
    /**
     * Updates a document
     * 
     * @param req 
     * @param res 
     * @returns 
     */
    async update( req: express.Request, res: express.Response ) {
        
        let {document} = req.params;
        document = unmaskDocument(document)

        let doc: any = new DocumentModel({document});
        const hasErrors = doc.validateSync();

        if( hasErrors )        
            return res.status(400).json(responseError(hasErrors.message));

        if( !isDBConnected() )
            return res.status(400).json(responseError("Your DB isn\"t started, but your request is ok!"));

        try {
            doc = await DocumentModel.findOne({document})
            await DocumentModel.updateOne({_id: doc._id}, {isBlacklist: !doc.isBlacklist});
            doc.isBlacklist = !doc.isBlacklist
        } catch( e ) {
            logger.error(e.message);
            return res.status(400).json(responseError(e.message));
        }

        return res.json(responseSuccess<Document>(doc));
    }

    async getDocuments(req: express.Request, res: express.Response ) {
        
        const { document, sort, isBlacklist }: any = req.query
        const aggregate: any = [];
        let query: any = { $and: [{createdAt: {$type: "date"} }] };

        if( document ) {
            query["$and"].push({"documents.document": {$eq: unmaskDocument(document)}});
        }
        if( typeof isBlacklist === "boolean" ) {
			query["$and"].push({"isBlacklist": {$eq: isBlacklist}});
        }
        aggregate.push({ $match: query});

        const docs: any = await DocumentModel.aggregate(aggregate).sort({"document": sort === "asc" ? 1 : -1});

        return res.json(responseSuccess<Document>(docs || []));
    }

}


export default new DocumentController();