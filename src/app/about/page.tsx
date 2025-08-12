import { ShieldCheck, Target, Eye } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
              About HSRP Saarthi
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              HSRP Saarthi is a government-authorized initiative dedicated to
              streamlining the process of obtaining High Security Registration
              Plates (HSRP) for all vehicle owners across the nation. We are
              committed to enhancing vehicle security and ensuring compliance
              with the regulations set by the Ministry of Road Transport and
              Highways.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our platform is built on the principles of transparency,
              efficiency, and security. We leverage technology to provide a
              hassle-free experience, from online booking and secure payment to
              real-time order tracking and doorstep delivery.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/500x500.png"
              alt="HSRP Saarthi Team"
              width={500}
              height={500}
              className="rounded-xl shadow-lg"
              data-ai-hint="government building"
            />
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-headline">Our Mission</h3>
            <p className="mt-2 text-muted-foreground">
              To provide a secure, user-friendly, and efficient platform for
              vehicle owners to obtain mandatory HSRPs, contributing to a
              safer and more organized national transport system.
            </p>
          </div>
          <div className="p-6 rounded-lg">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <Eye className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-headline">Our Vision</h3>
            <p className="mt-2 text-muted-foreground">
              To be the most trusted and accessible service provider for HSRP
              in the country, leveraging innovation to ensure compliance and
              customer satisfaction.
            </p>
          </div>
          <div className="p-6 rounded-lg">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-headline">Our Commitment</h3>
            <p className="mt-2 text-muted-foreground">
              We are committed to upholding the highest standards of security
              and service quality, ensuring that every HSRP issued meets all
              government regulations and security features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
