import { Schema, model } from "mongoose";

const releaseListSchema = new Schema({
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    versions: [{
        name: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        }
    }]
})

export const ReleaseList = model("ReleaseList", releaseListSchema);