
"use server";

import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export async function getBookings() {
  try {
    const result = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching bookings from DB:", error);
    return { success: false, error: "Failed to fetch bookings." };
  }
}

const updateBookingStatusSchema = z.object({
  bookingId: z.number(),
  newStatus: z.string(),
});

export async function updateBookingStatus(input: z.infer<typeof updateBookingStatusSchema>) {
  const { bookingId, newStatus } = updateBookingStatusSchema.parse(input);
  try {
    await db.update(bookings).set({
      status: newStatus,
      updatedAt: new Date()
    }).where(eq(bookings.id, bookingId));
    return { success: true };
  } catch (error) {
    console.error("Error updating status in DB:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to update status. ${errorMessage}` };
  }
}
