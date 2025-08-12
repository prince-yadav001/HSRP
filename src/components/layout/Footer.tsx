import Link from "next/link";
import { ShieldCheck, Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
  ];
  
  const footerLinks = [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start space-y-2">
            <Link href="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold font-headline">HSRP Saarthi</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for High Security Registration Plates.
            </p>
          </div>
          <div className="md:justify-self-center">
            <h4 className="mb-2 font-semibold font-headline">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:justify-self-end">
            <h4 className="mb-2 font-semibold font-headline">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.icon.displayName}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} HSRP Saarthi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
