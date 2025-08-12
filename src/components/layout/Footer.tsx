import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-bold mb-4 font-headline">HSRP Portal</h3>
            <p className="text-sm text-gray-300">
              Official High Security Registration Plate booking platform by Government of India.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/booking" className="hover:text-white transition-colors">
                  New Booking
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white transition-colors">
                  Order Track
                </Link>
              </li>
              <li>
                <Link href="/#process" onClick={(e) => handleClick(e, '/#process')} className="hover:text-white transition-colors">
                  How to Book
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-headline">Vehicle Types</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/booking?vehicle=Bike/Scooter" className="hover:text-white transition-colors">
                  For Bike & Scooter
                </Link>
              </li>
              <li>
                <Link href="/booking?vehicle=Car/SUV" className="hover:text-white transition-colors">
                  For 4 Wheeler
                </Link>
              </li>
              <li>
                <Link href="/booking?vehicle=Electric Vehicle" className="hover:text-white transition-colors">
                  For Electric
                </Link>
              </li>
              <li>
                <Link href="/booking?vehicle=Only Colour Sticker" className="hover:text-white transition-colors">
                  Only Sticker
                </Link>
              </li>
              <li>
                <Link href="/booking?vehicle=Tractor & Trailer" className="hover:text-white transition-colors">
                  Heavy Vehicle
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-headline">Important Pages</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-headline">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center">
                <Phone className="mr-2" size={16} />
                1800-123-4567
              </li>
              <li className="flex items-center">
                <Mail className="mr-2" size={16} />
                support@hsrpsaarthi.gov.in
              </li>
              <li className="flex items-center">
                <Clock className="mr-2" size={16} />
                Mon-Fri: 9 AM - 6 PM
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Government of India. All rights reserved. | Ministry of Road Transport & Highways</p>
        </div>
      </div>
    </footer>
  );
}
