import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { userAddress } from "../db/schema";

export const getUserAddress = async () => {
  try {
    const session = await auth();
    if (session?.user) {
      const userAddressData = await db.query.userAddress.findFirst({
        where: eq(userAddress?.userId, session?.user.id as string),
      });

      return {
        data: userAddressData,
        userId: session.user.id,
        userName: session.user.name,
      };
    }
  } catch (error) {
    return null;
  }
};
