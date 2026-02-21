"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@/lib/types/enums";

export async function signUp(data: any) {
  const { name, email, password, role } = data;

  if (!email || !password || !name) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Internal server error" };
  }
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    return { success: true };
  } catch (error) {
    console.error("Update role error:", error);
    return { error: "Failed to update role" };
  }
}
