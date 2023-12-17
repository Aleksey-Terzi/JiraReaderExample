import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    passwordHash: {
        type: String,
        required: true
    }
});

export const User = model("User", userSchema);