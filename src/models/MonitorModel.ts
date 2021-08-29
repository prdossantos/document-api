import { Schema, model } from "mongoose";

export interface Monitor {
    _id?: string,
    request: string
}

const MonitorSchema = new Schema<Document>({
    __v: { type: Number, select: false},
    request: {
        type: Object
    }
}, {
    collection: "monitor",
    timestamps: true
});


const MonitorModel = model<Document>("monitor", MonitorSchema);


export default MonitorModel;