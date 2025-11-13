import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Users, TrendingUp } from "lucide-react";
import warehouseImage from "@/assets/warehouse.jpg";

const About = () => {
  const milestones = [
    { year: "1970s", event: "Founded under Sanghi Brothers by Late Shri Brij Mohan Sanghi" },
    { year: "1980s", event: "Became authorized distributors of Kesoram Spun Pipes" },
    { year: "1990s", event: "Expanded partnership with Electrosteel Castings Ltd." },
    { year: "2000s", event: "Incorporated as B.M. Sanghi Traders Pvt. Ltd., obtained ISO 9001:2015 certification" },
    { year: "2010s", event: "Added PRINCE PIPES & FITTINGS LTD and other major brands to portfolio" },
    { year: "Present", event: "Renamed to DE PIPES PRIVATE LIMITED, serving pan-India with complete piping solutions" },
  ];

  const partners = [
    "Electrosteel Castings Ltd.",
    "Jindal Hisar",
    "PRINCE PIPES & FITTINGS LTD",
    "Surya Prakash",
    "Kirloskar",
    "Kartar Valves",
    "AVK Valves",
    "TATA Pipes",
  ];

  const values = [
    { 
      icon: Award, 
      title: "Quality First", 
      description: "ISO 9001:2015 certified operations ensuring international quality standards in every product we supply." 
    },
    { 
      icon: Target, 
      title: "Transparency", 
      description: "Honest and transparent dealings with all stakeholders, building trust through clear communication." 
    },
    { 
      icon: Users, 
      title: "Technical Competence", 
      description: "Expert team providing comprehensive technical support and consultation for all your piping needs." 
    },
    { 
      icon: TrendingUp, 
      title: "Customer Focus", 
      description: "Swift deliveries and competitive pricing backed by 50+ years of industry experience." 
    },
  ];

  return (
    <main className="py-12">
      {/* Hero Section */}
      <section className="section-container mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About DE PIPES PRIVATE LIMITED</h1>
          <p className="text-xl text-muted-foreground">
            Formerly known as B.M. Sanghi Traders Pvt. Ltd.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={warehouseImage}
              alt="DE PIPES facility"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              Founded by <strong>Late Shri Brij Mohan Sanghi</strong> under the name <strong>Sanghi Brothers</strong>, our company has been a cornerstone in the industrial piping sector since the 1970s.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Over five decades, we've built an enviable reputation as authorized distributors for India's most trusted brands. From our early days distributing Kesoram Spun Pipes to our current partnerships with industry giants like Electrosteel, Jindal Hisar, PRINCE PIPES & FITTINGS LTD, and more, we've consistently delivered quality and reliability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, as <strong>DE PIPES PRIVATE LIMITED</strong>, we are an <strong>ISO 9001:2015 certified</strong> company serving clients across India with a complete range of piping solutions for water infrastructure and industrial applications.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-section-pattern py-16 mb-20">
        <div className="section-container">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="py-8">
              <blockquote className="text-2xl md:text-3xl font-semibold text-center italic">
                "A Brand is no longer what we tell the customer it is – it is what customers tell each other it is."
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-container mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Journey</h2>
        <div className="max-w-4xl mx-auto">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-6 mb-8 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                {index !== milestones.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <Card className="flex-1 hover-lift">
                <CardContent className="pt-6">
                  <div className="text-sm text-primary font-semibold mb-2">{milestone.year}</div>
                  <p className="text-foreground">{milestone.event}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="section-container mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-section-pattern py-20">
        <div className="section-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Brand Partners</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Authorized distributors of India's most trusted piping brands
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {partners.map((partner, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="py-6 text-center">
                  <p className="font-semibold">{partner}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
