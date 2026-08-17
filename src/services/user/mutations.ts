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
        email: lowerCasedEmail,
        password: hashedPassword,
    });
}

export async function updateUserPassword(
    userId: string,
    currentPassword: string,
    newPassword: string
) {
    await connectDB();

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
        throw new Error("Current password is incorrect");
    }

    if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    await user.save();

    return { success: true };
}