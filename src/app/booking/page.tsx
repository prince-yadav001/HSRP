import BookingForm from "@/components/hsrp/BookingForm";

export default function BookingPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Book Your High Security Registration Plate
        </h1>
        <p className="text-lg text-muted-foreground">
          Follow the simple steps below to order your HSRP. The process is
          fast, secure, and fully compliant with government standards.
        </p>
      </div>

      <div className="mt-12">
        <BookingForm />
      </div>
    </div>
  );
}
