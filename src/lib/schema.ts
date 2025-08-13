
import { pgTable, serial, text, varchar, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 255 }).unique().notNull(),
  ownerFullName: varchar('owner_full_name', { length: 255 }),
  ownerMobile: varchar('owner_mobile', { length: 20 }),
  ownerEmail: varchar('owner_email', { length: 255 }),
  ownerAadhaar: varchar('owner_aadhaar', { length: 20 }),
  ownerAddress: text('owner_address'),
  ownerState: varchar('owner_state', { length: 100 }),
  ownerPincode: varchar('owner_pincode', { length: 10 }),
  vehicleRegistrationNumber: varchar('vehicle_registration_number', { length: 50 }),
  engineNumber: varchar('engine_number', { length: 100 }),
  chassisNumber: varchar('chassis_number', { length: 100 }),
  vehicleMake: varchar('vehicle_make', { length: 100 }),
  vehicleModel: varchar('vehicle_model', { length: 100 }),
  manufacturingYear: varchar('manufacturing_year', { length: 4 }),
  vehicleCategory: varchar('vehicle_category', { length: 100 }),
  amount: integer('amount'),
  status: varchar('status', { length: 50 }).default('pending'),
  paymentProof: text('payment_proof'),
  verificationReason: text('verification_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
    
export const contacts = pgTable('contacts', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    message: text('message'),
    createdAt: timestamp('created_at').defaultNow(),
});
