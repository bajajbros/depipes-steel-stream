import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Moon, Sun, Menu, Phone, Mail, ChevronDown } from "lucide-react";
import { ProductsMegaMenu } from "./ProductsMegaMenu";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [showMobileProducts, setShowMobileProducts] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setIsDark(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products", hasMenu: true },
    { name: "Certifications", path: "/certifications" },
    { name: "Clients", path: "/clients" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  const companyName = settings?.company_name || "DE PIPES PVT. LTD.";
  const phone = settings?.phone || "0120-4371172";
  const email = settings?.email || "info@sanghibrothers.com";
  const logoUrl = settings?.logo_url;

  return (
    <>
      <div className="bg-primary text-primary-foreground py-2 text-sm">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 hover:underline">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:underline">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">{email}</span>
            </a>
          </div>
          <div className="text-xs hidden md:block">ISO 9001:2015 Certified | 50+ Years of Excellence</div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background"}`}>
        <nav className="section-container py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="h-12 w-auto object-contain" />
              ) : (
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">DP</span>
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">{companyName}</h1>
                <p className="text-xs text-muted-foreground">Piping Solutions Since 1970</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => link.hasMenu && setShowProductsMenu(true)}
                  onMouseLeave={() => link.hasMenu && setShowProductsMenu(false)}
                >
                  <Link
                    to={link.path}
                    className={`font-medium transition-colors hover:text-primary flex items-center gap-1 ${isActive(link.path) ? "text-primary" : "text-foreground"}`}
                  >
                    {link.name}
                    {link.hasMenu && <ChevronDown className="h-4 w-4" />}
                  </Link>
                  {link.hasMenu && showProductsMenu && (
                    <ProductsMegaMenu onClose={() => setShowProductsMenu(false)} />
                  )}
                </div>
              ))}
              <Button onClick={toggleTheme} variant="ghost" size="icon">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <Button onClick={toggleTheme} variant="ghost" size="icon">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <div key={link.path}>
                        <div className="flex items-center justify-between">
                          <Link
                            to={link.path}
                            onClick={() => !link.hasMenu && setIsOpen(false)}
                            className={`text-lg font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-foreground"}`}
                          >
                            {link.name}
                          </Link>
                          {link.hasMenu && (
                            <button onClick={() => setShowMobileProducts(!showMobileProducts)}>
                              <ChevronDown className={`h-5 w-5 transition-transform ${showMobileProducts ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>
                        {link.hasMenu && showMobileProducts && (
                          <ProductsMegaMenu onClose={() => setIsOpen(false)} isMobile />
                        )}
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
