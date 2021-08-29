import { Schema, model, ValidatorProps } from "mongoose";
import { unmaskDocument, validDocument } from "../helper";

export interface Document {
    _id?: string,
    document: string
}

const DocumentSchema = new Schema<Document>({
    __v: { type: Number, select: false},
    document: {
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: ( value: string ) => validDocument(value),
            message: ( props: ValidatorProps ) => `${props.value} is not a valid document!`
        }
    },
    isBlacklist: {
        type: Boolean, 
        required: false, 
        default: false
    }
}, {
    collection: "documents",
    timestamps: true
});


const DocumentModel = model<Document>("document", DocumentSchema);


export default DocumentModel;