"use server";

const { connectToDB } = require("../mongoose");
import { revalidatePath } from "next/cache";
import User from "../models/user.model";

export const updateUser = async ({
  userId,
  name,
  username,
  bio,
  path,
  image,
}) => {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(`Failed to create/update user ${error.message}`);
  }
};
