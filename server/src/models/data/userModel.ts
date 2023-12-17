import { User } from "../../mongo/user";

export interface UserModel {
    name: string;
    passwordHash: string;
}

export async function hasUsers() {
    const anyUser = await User.findOne();
    return !!anyUser;
}

export async function getUser(name: string) {
    const entity = await User.findOne({ name });
    return entity as UserModel;
}

export async function saveUser(model: UserModel) {
    await User.create(model);
}