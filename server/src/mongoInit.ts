import { connect, connection } from "mongoose";
import { MONGO_URL } from "./settings";

connection.once("open", () => {
    console.log("MongoDB connection is open.");
});

connection.on("error", e => {
    console.error(e);
});

export async function mongoConnect() {
    await connect(MONGO_URL);
}