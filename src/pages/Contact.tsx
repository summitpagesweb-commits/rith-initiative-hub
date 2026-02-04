import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionDivider } from "@/components/shared/SectionDivider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Mail, Send, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/rithinitiative/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/p/The-Rith-Initiative-61580213405598/", label: "Facebook" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
        return;
      }

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-secondary/30 to-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal variant="fade-up">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                Get in Touch
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={100}>
              <p className="text-base text-muted-foreground leading-relaxed italic">
                Have questions about our programs? Want to get involved? We'd love to hear from you.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <ScrollReveal variant="slide-left">
              <div>
                <SectionHeading 
                  title="Send Us a Message"
                  subtitle="Fill out the form below and we'll respond as soon as possible"
                />
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Events & Programs">Events & Programs</option>
                      <option value="Volunteering">Volunteering</option>
                      <option value="Donations & Sponsorship">Donations & Sponsorship</option>
                      <option value="Partnership Opportunities">Partnership Opportunities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Information */}
            <ScrollReveal variant="slide-right" delay={100}>
              <div>
                <SectionHeading 
                  title="Contact Information"
                  subtitle="Reach out through any of these channels"
                />
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-semibold text-foreground mb-1">Email</h4>
                      <a 
                        href="mailto:rithinitiative@gmail.com" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        rithinitiative@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-6 border-t border-border">
                    <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
                      Follow Us
                    </h4>
                    <div className="flex gap-4">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          aria-label={social.label}
                        >
                          <social.icon size={20} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow">
          <ScrollReveal variant="fade-up">
            <SectionHeading 
              title="Frequently Asked Questions"
              subtitle="Quick answers to common questions"
              centered
            />
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={100}>
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "How can I volunteer with The Rith Initiative?",
                  a: "We welcome volunteers for our events and programs! The best way to get involved is to reach out through our contact form above or send us an email at rithinitiative@gmail.com. Let us know your interests and availability, and we'll connect you with upcoming opportunities."
                },
                {
                  q: "Are donations tax-deductible?",
                  a: "Yes! The Rith Initiative is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the fullest extent allowed by law. You will receive a receipt for your records."
                },
                {
                  q: "How can I stay updated on upcoming events?",
                  a: "Follow us on Instagram and Facebook to stay in the loop! You can also sign up for our newsletter to receive updates directly in your inbox about upcoming events, programs, and community gatherings."
                },
                {
                  q: "Do you offer programs for children?",
                  a: "Yes, we offer family-friendly events and programs that welcome participants of all ages. Our festivals and cultural celebrations are designed to be engaging and educational for children while celebrating Indian heritage and traditions."
                }
              ].map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`}
                  className="bg-card rounded-xl px-6 border border-border/50"
                >
                  <AccordionTrigger className="font-heading text-lg font-semibold text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
