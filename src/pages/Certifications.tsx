import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Shield, FileCheck } from "lucide-react";

const Certifications = () => {
  const certifications = [
    {
      title: "ISO 9001:2015",
      issuer: "Quality Management System",
      description: "Certified for quality management systems ensuring consistent product quality and customer satisfaction.",
      icon: Award,
    },
    {
      title: "Product Quality Certifications",
      issuer: "BIS & ISI Standards",
      description: "All products conform to Indian Standards (IS) and Bureau of Indian Standards (BIS) specifications.",
      icon: CheckCircle,
    },
    {
      title: "Authorized Distributor",
      issuer: "Multiple Leading Brands",
      description: "Official authorized distributor certificates from Electrosteel, Jindal, PRINCE PIPES, and other leading manufacturers.",
      icon: Shield,
    },
    {
      title: "Government Approved",
      issuer: "Various Government Bodies",
      description: "Approved supplier for Delhi Jal Board, CPWD, MES, and other government organizations.",
      icon: FileCheck,
    },
  ];

  const standards = [
    { code: "IS 8329", description: "DI Spun Pipes" },
    { code: "IS 1536", description: "CI Spun Pipes" },
    { code: "IS 4984", description: "HDPE Pipes" },
    { code: "IS 778", description: "uPVC Pipes" },
    { code: "IS 14896", description: "DWC Pipes" },
    { code: "IS 2062", description: "MS Pipes" },
    { code: "IS 1239", description: "GI Pipes" },
    { code: "IS 14846", description: "Butterfly Valves" },
  ];

  return (
    <main className="py-12">
      {/* Hero Section */}
      <section className="section-container mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Certifications & Standards</h1>
          <p className="text-xl text-muted-foreground">
            Committed to quality, safety, and compliance with international standards
          </p>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="section-container mb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <cert.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                    <p className="text-sm text-primary font-semibold mb-2">{cert.issuer}</p>
                    <p className="text-muted-foreground">{cert.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ISO Highlight */}
      <section className="bg-hero-gradient text-primary-foreground py-16 mb-20">
        <div className="section-container text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-foreground/20 rounded-full mb-6">
              <Award className="w-12 h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">ISO 9001:2015 Certified</h2>
            <p className="text-lg opacity-90 mb-8">
              Our commitment to quality is demonstrated through our ISO 9001:2015 certification. This ensures that every product and service we provide meets the highest international quality standards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-foreground/10 rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-90">Quality Assured</div>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-90">Years of Trust</div>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">1000+</div>
                <div className="text-sm opacity-90">Projects Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Standards */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Product Compliance Standards</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All our products are manufactured and supplied in accordance with Indian Standards (IS) and international specifications
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {standards.map((standard, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{standard.code}</div>
                <p className="text-sm text-muted-foreground">{standard.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="section-container mt-20">
        <Card className="border-2 border-primary">
          <CardContent className="py-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Quality Commitment</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Quality is not just a certification for us—it's a way of doing business. Every product we supply undergoes rigorous quality checks, and we maintain transparent documentation for complete traceability. Our ISO certification reflects our systematic approach to maintaining consistent quality across all operations.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Regular Audits</h4>
                    <p className="text-sm text-muted-foreground">Periodic internal and external quality audits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Supplier Verification</h4>
                    <p className="text-sm text-muted-foreground">Only authorized and certified suppliers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Product Testing</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive testing before dispatch</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Documentation</h4>
                    <p className="text-sm text-muted-foreground">Complete certificates and test reports</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Certifications;
