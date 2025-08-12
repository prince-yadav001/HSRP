import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRICING_DATA } from "@/lib/constants";
import PricingCard from "@/components/hsrp/PricingCard";
import Link from "next/link";
import { ArrowRight, Car, Package, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full bg-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                Get Your HSRP with Ease and Trust
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                HSRP Saarthi provides a seamless and secure way to book and
                track your High Security Registration Plate, authorized and
                compliant with government regulations.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/booking">
                    Book Your HSRP Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/tracking">Track Your Order</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
               <div className="bg-white/50 p-8 rounded-full shadow-2xl">
                <Car
                  className="h-32 w-32 text-primary"
                  strokeWidth={1.5}
                  data-ai-hint="car illustration"
                />
               </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                A Simple 3-Step Process
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We've streamlined the entire process to be as simple and
                transparent as possible.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Car className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline">1. Book Online</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  Fill out our simple online form with your vehicle and owner
                  details. It only takes a few minutes.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <CreditCard className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline">2. Secure Payment</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  Complete the payment using our secure QR code and upload the
                  proof. Your transaction is safe with us.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Package className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline">3. Track & Receive</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  Track your order status in real-time and get your HSRP
                  delivered to your doorstep.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the right HSRP for your vehicle. No hidden fees, just
                straightforward pricing.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PRICING_DATA.map((item) => (
              <PricingCard key={item.category} {...item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
