"use server";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

export const createThread = async ({ text, author, path, communityId }) => {
  connectToDB();

  try {
    const createThread = await Thread.create({
      text,
      author,
      communityId: null,
    });

    // Update user model

    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Failed to create thread ${error.message}`);
  }
};
