import { connectDB } from "@/db";
import { UserModel } from "@/models/User";
import type { User } from "@/models/User";
import bcrypt from "bcrypt";

type CreateUserInput = Pick<User, "name" | "email" | "password" >

export async function createUser (data: CreateUserInput) {
    await connectDB()

    const {name, email, password} = data;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    const lowerCasedEmail = email.toLowerCase();


    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return UserModel.create({
        name,
        lowerCasedEmail,
        password: hashedPassword,
    });
}