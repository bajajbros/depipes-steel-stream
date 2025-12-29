import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Landmark, HardHat, Factory } from "lucide-react";

const Clients = () => {
  const governmentBodies = [
    "Haryana State Infrastructure & Industrial Development Corporation",
    "Delhi Jal Board",
    "Central Public Works Department (CPWD)",
    "Military Engineer Services (MES)",
    "Urban Development Authority",
    "Housing Board",
    "Municipal Corporations",
    "State Water Supply Boards",
  ];

  const contractors = [
    "Suez India Private Limited",
    "Veolia India Private Limited",
    "GMR Infrastructure",
    "Larsen & Toubro (L&T)",
    "Shapoorji Pallonji",
    "NCC Limited",
    "HCC Limited",
  ];

  const developers = [
    "Omaxe Limited",
    "BPTP Limited",
    "Eldeco Group",
    "Ansal Properties",
    "Unitech Limited",
    "Supertech Limited",
    "Paramount Group",
    "ATS Infrastructure",
  ];

  const industries = [
    "Power Generation Plants",
    "Chemical & Pharmaceutical Units",
    "Food Processing Industries",
    "Textile Mills",
    "Steel Plants",
    "Cement Factories",
    "Paper Mills",
    "Oil & Gas Sector",
  ];

  return (
    <main className="py-12">
      {/* Hero Section */}
      <section className="section-container mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Esteemed Clients</h1>
          <p className="text-xl text-muted-foreground">
            Trusted by government bodies, leading contractors, real estate developers, and major industries across India
          </p>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="section-container mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-sm text-muted-foreground">Projects Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Government Bodies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <p className="text-sm text-muted-foreground">Contractors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">Pan-India</div>
              <p className="text-sm text-muted-foreground">Presence</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Government Bodies */}
      <section className="section-container mb-16">
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Landmark className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Government Bodies & Associations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {governmentBodies.map((body, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{body}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contractors */}
      <section className="section-container mb-16">
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <HardHat className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Leading Contractors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contractors.map((contractor, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="py-4 text-center">
                    <p className="font-semibold">{contractor}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Real Estate Developers */}
      <section className="section-container mb-16">
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Real Estate Developers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {developers.map((developer, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="py-4 text-center">
                    <p className="font-semibold">{developer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Industries */}
      <section className="section-container mb-16">
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Factory className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Industrial Clients</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {industries.map((industry, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{industry}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="section-container">
        <Card className="bg-hero-gradient text-primary-foreground">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Client Family</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Whether you're a government body, contractor, developer, or industry, we're ready to serve your piping solution needs with the same commitment and quality.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:01204371172">
                <button className="px-6 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
                  Call Now
                </button>
              </a>
              <a href="mailto:info@sanghibrothers.com">
                <button className="px-6 py-3 border-2 border-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
                  Email Us
                </button>
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Clients;
