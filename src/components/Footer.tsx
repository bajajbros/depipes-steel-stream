import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Footer = () => {
  const { data: settings } = useSiteSettings();

  const companyName = settings?.company_name || "DE PIPES PVT. LTD.";
  const phone = settings?.phone || "0120-4371172";
  const email = settings?.email || "info@sanghibrothers.com";
  const address = settings?.address || "Unit 406A, 4th Floor, Tower-A, Sector-62, Noida - 201309";
  const logoUrl = settings?.logo_url;

  return (
    <footer className="bg-card border-t mt-20">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">DP</span>
                </div>
              )}
              <h3 className="font-bold text-lg">{companyName}</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Formerly B.M. Sanghi Traders Pvt. Ltd. - Your trusted partner in industrial piping solutions since 1970.
            </p>
            <p className="text-xs text-muted-foreground">ISO 9001:2015 Certified</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/certifications" className="text-muted-foreground hover:text-primary transition-colors">Certifications</Link></li>
              <li><Link to="/clients" className="text-muted-foreground hover:text-primary transition-colors">Our Clients</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>DI Spun Pipes</li>
              <li>CI Spun Pipes</li>
              <li>HDPE Pipes</li>
              <li>Valves & Fittings</li>
              <li>Water Meters</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{address}</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-muted-foreground hover:text-primary">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
