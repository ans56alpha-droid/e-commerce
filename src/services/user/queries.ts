import { UserModel } from "@/models/User";

export async function findUserByEmail(email: string) {
    return UserModel.findOne({ email });
}

export async function findUserById(id: string) {
    return UserModel.findById(id);
}