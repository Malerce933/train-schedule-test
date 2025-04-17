"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { generateToken } from "@/lib/jwt";
import { comparePasswords, hashPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";

type FormState = {
    errors?: {
        [key: string]: string;
    };
};

// Функція для налаштування куків
async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, 
    });
}

// Основна функція для аутентифікації
export async function auth(mode: "login" | "signup", prevState: FormState, formData: FormData): Promise<FormState> {
    if (mode === "login") {
        return login(prevState, formData);
    } else {
        return signup(prevState, formData);
    }
}

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: Record<string, string> = {};

    if (!email.includes("@")) {
        errors.email = "Please enter a valid email address.";
    }

    if (password.trim().length < 8) {
        errors.password = "Password must be at least 8 characters long.";
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    const hashedPassword = await hashPassword(password);

    try {
        const user = await createUser(email, hashedPassword);

        const token = generateToken(user.id, user.email);

        await setAuthCookie(token);
        
    } catch (error: any) {
        console.error("Error during signup:", error);
        return {
            errors: {
                general: "An unexpected error occurred. Please try again later.",
            },
        };
    }
    redirect("/schedule");
}

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: Record<string, string> = {};

    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            errors.email = "Could not authenticate user, please check your credentials.";
            return { errors };
        }

        const isValidPassword = await comparePasswords(existingUser.password, password);

        if (!isValidPassword) {
            errors.password = "Could not authenticate user, please check your credentials.";
            return { errors };
        }

        const token = generateToken(existingUser.id, existingUser.email);


        await setAuthCookie(token);
    } catch (err) {
        console.error("Login failed:", err);
        errors.general = "An error occurred while logging in. Please try again later.";
        return { errors };
    }
    redirect("/schedule");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: new Date(0),
    });
  }