import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Award, Truck, Users, Shield } from "lucide-react";
import heroImage from "@/assets/hero-pipes.jpg";
import warehouseImage from "@/assets/warehouse.jpg";

const Home = () => {
  const values = [
    { icon: Shield, title: "Quality Assurance", description: "ISO 9001:2015 certified products meeting international standards" },
    { icon: Truck, title: "Swift Deliveries", description: "Pan-India presence ensuring timely delivery to your doorstep" },
    { icon: Award, title: "50+ Years Legacy", description: "Half a century of excellence in piping solutions" },
    { icon: Users, title: "Technical Competence", description: "Expert team providing comprehensive technical support" },
  ];

  const highlights = [
    "Authorized distributors of leading brands",
    "Complete solution for water infrastructure",
    "Government-approved supplier",
    "Competitive pricing & transparent dealings",
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        <div className="relative section-container h-full flex items-center">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-primary font-semibold">ISO 9001:2015 Certified</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              A Complete Solution for <span className="text-primary">Water Infrastructure</span> and Piping Systems
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Trusted supplier of industrial piping solutions with over 50 years of excellence. From DI pipes to valves and fittings - we've got you covered.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="group">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Get in Touch</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DE PIPES?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built on a foundation of quality, transparency, and technical excellence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover-lift border-2">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Preview Section */}
      <section className="bg-section-pattern py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Five Decades of <span className="text-primary">Excellence</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Founded by Late Shri Brij Mohan Sanghi under Sanghi Brothers, DE PIPES PRIVATE LIMITED (formerly B.M. Sanghi Traders Pvt. Ltd.) has been a trusted name in industrial piping solutions since the 1970s.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We are authorized distributors of industry-leading brands including Electrosteel, Jindal Hisar, PRINCE PIPES & FITTINGS LTD, Surya Prakash, Kirloskar, Kartar Valves, and AVK.
              </p>
              <div className="space-y-3 mb-8">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={warehouseImage}
                alt="DE PIPES warehouse facility"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-xl">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-sm">Years of Trust</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container py-20">
        <Card className="bg-hero-gradient text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' 
            }} />
          </div>
          <CardContent className="relative py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Contact us today for all your piping solution needs. Our expert team is here to help you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" variant="secondary">View Products</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Home;
