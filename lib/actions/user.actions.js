"use server";

const { connectToDB } = require("../mongoose");
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connect } from "mongoose";

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

export const fetchUser = async (userId) => {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path: "community",
    //   model: Community
    // })
  } catch (error) {
    throw new Error(`Failed to fetch user ${error.message}`);
  }
};
