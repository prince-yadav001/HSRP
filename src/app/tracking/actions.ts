
"use server";

import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function getBookingsByMobile(mobileNumber: string) {
  try {
    const results = await db.select()
      .from(bookings)
      .where(eq(bookings.ownerMobile, mobileNumber))
      .orderBy(desc(bookings.createdAt));
    return results;
  } catch (error) {
    console.error("Error fetching orders by mobile:", error);
    throw new Error("An error occurred while fetching your orders.");
  }
}

    