import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterPopup } from "@/components/shared/NewsletterPopup";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/donate", label: "Donate" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container-wide">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={logo} 
                alt="The Rith Initiative Logo" 
                className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                    location.pathname === link.href
                      ? "text-primary after:w-full"
                      : "text-foreground/80 after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => setShowNewsletter(true)}
              >
                <Mail size={16} />
                Newsletter
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-medium py-2 transition-colors ${
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button 
                  variant="hero" 
                  className="mt-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowNewsletter(true);
                  }}
                >
                  <Mail size={16} />
                  Join Newsletter
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Newsletter Modal */}
      {showNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-elevated p-8 animate-scale-in">
            <button
              onClick={() => setShowNewsletter(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                Join Our Newsletter
              </h3>
              <p className="text-muted-foreground">
                Stay updated on upcoming events, cultural programs, and community news.
              </p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowNewsletter(false);
              }} 
              className="space-y-4"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Subscribe
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      )}

      <NewsletterPopup />
    </>
  );
}
