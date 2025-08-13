
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { getBookings } from "./actions";

// Always make sure that the page is dynamic and not static
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // This is a server component, so we can fetch data directly
  // We're wrapping this in a try/catch in case the DB connection fails
  let initialBookings = [];
  try {
    const bookingsResult = await getBookings();
    if (bookingsResult.success) {
      initialBookings = bookingsResult.data;
    } else {
      console.error("Failed to fetch initial bookings:", bookingsResult.error);
    }
  } catch (error) {
    console.error("Error fetching bookings on server:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      {/* 
        The login state will be managed on the client side, 
        but we pass the initial data from the server.
        This gives us the best of both worlds: server-side rendering for the initial data
        and client-side interactivity.
      */}
      <AdminDashboard initialBookings={initialBookings} />
    </div>
  );
}
