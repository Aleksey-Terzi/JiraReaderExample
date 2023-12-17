import { Schema, model } from "mongoose";

const reportSchema = new Schema({
    releaseVersion: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    issues: [{
        issueId: {
            type: String,
            required: true
        },
        issueKey: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        status: String,
        participants: {
            type: [{
                name: {
                    type: String,
                    required: true
                },
                workTimeSeconds: {
                    type: Number,
                    required: true
                },
                percent: {
                    type: Number,
                    required: true
                }
            }],
            required: true
        },
        childKeys: [String],
        estimateSeconds: {
            type: Number,
            required: true
        },
        workTimeSeconds: {
            type: Number,
            required: true
        }
    }]
});

export const Report = model("Report", reportSchema);