import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/donate", label: "Donate" },
    { href: "/contact", label: "Contact" },
  ],
  social: [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={logo} 
                alt="The Rith Initiative Logo" 
                className="h-20 w-auto bg-background/95 rounded-lg p-2"
              />
            </Link>
            <p className="text-primary-foreground/80 max-w-md mb-6 leading-relaxed">
              A 501(c)(3) nonprofit organization dedicated to sharing and preserving Indian culture 
              through community events, arts, and cultural programming in Central Virginia.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center transition-all hover:bg-accent hover:text-accent-foreground hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4 text-primary-foreground/70">
              <p>Central Virginia, USA</p>
              <a
                href="mailto:info@therithinitiative.org"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail size={16} />
                info@therithinitiative.org
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} The Rith Initiative. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-sm">
            501(c)(3) Nonprofit Organization
          </p>
        </div>
      </div>
    </footer>
  );
}
