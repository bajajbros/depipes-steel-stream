import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import productsImage from "@/assets/products-main.jpg";
import plasticPipesImage from "@/assets/plastic-pipes.jpg";
import valvesImage from "@/assets/valves.jpg";

const Products = () => {
  const productCategories = [
    {
      title: "DI Spun Pipes",
      description: "Ductile Iron Spun Pipes conforming to IS 8329",
      image: productsImage,
      specs: ["K-7, K-9 Class", "80mm to 1200mm diameter", "Push-on joints & flanged", "Socket & Spigot type"],
    },
    {
      title: "CI Spun Pipes",
      description: "Cast Iron Spun Pipes as per IS 1536",
      image: productsImage,
      specs: ["LA, A, B Class", "80mm to 300mm", "Socket & spigot joints", "Rubber ring joints"],
    },
    {
      title: "Double Flanged Pipes",
      description: "High-quality double flanged pipes for water supply",
      image: productsImage,
      specs: ["DI & MS options", "PN 10, PN 16 ratings", "Various diameters", "Epoxy coated"],
    },
    {
      title: "MS & GI Pipes",
      description: "Mild Steel and Galvanized Iron Pipes",
      image: productsImage,
      specs: ["Medium & heavy duty", "15mm to 300mm", "Threaded & plain ends", "ISI marked"],
    },
    {
      title: "HDPE Pipes",
      description: "High-Density Polyethylene Pipes conforming to IS 4984",
      image: plasticPipesImage,
      specs: ["PE 80, PE 100", "20mm to 630mm", "SDR 11, SDR 17", "UV resistant"],
    },
    {
      title: "DWC Pipes",
      description: "Double Wall Corrugated Pipes",
      image: plasticPipesImage,
      specs: ["SN4, SN8 stiffness", "110mm to 800mm", "Sewage & drainage", "High ring stiffness"],
    },
    {
      title: "uPVC & cPVC Pipes",
      description: "Unplasticized and Chlorinated PVC Pipes",
      image: plasticPipesImage,
      specs: ["Pressure & non-pressure", "20mm to 315mm", "Hot & cold water", "Solvent weld joints"],
    },
    {
      title: "Fittings",
      description: "Complete range of pipe fittings",
      image: productsImage,
      specs: ["Bends, Tees, Reducers", "Flanged fittings", "All material types", "Custom sizes available"],
    },
    {
      title: "Valves",
      description: "Industrial valves for all applications",
      image: valvesImage,
      specs: ["Butterfly valves", "Gate valves", "Non-return valves", "Pressure reducing valves"],
    },
    {
      title: "Accessories",
      description: "Pipe accessories and components",
      image: productsImage,
      specs: ["Joints & Collars", "Rubber rings", "Bolts & nuts", "Manhole covers"],
    },
    {
      title: "Manhole Covers & Gratings",
      description: "Heavy-duty covers and gratings",
      image: productsImage,
      specs: ["CI & DI material", "Class A to D", "Locking type", "Anti-theft design"],
    },
    {
      title: "Water Meters",
      description: "Accurate water measurement devices",
      image: productsImage,
      specs: ["15mm to 300mm", "Multi-jet & woltman", "Domestic & bulk", "Remote reading option"],
    },
  ];

  return (
    <main className="py-12">
      {/* Hero Section */}
      <section className="section-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Product Range</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive piping solutions for water infrastructure and industrial applications
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((product, index) => (
            <Card key={index} className="hover-lift overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2">
                  <span>{product.title}</span>
                  <Badge variant="secondary">Available</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary">Key Specifications:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {product.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="section-container mt-20">
        <Card className="bg-section-pattern">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Custom Solutions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer custom sizing, specifications, and bulk supply arrangements. Our technical team is ready to assist with your specific requirements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:01204371172" className="inline-flex">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Call: 0120-4371172
                </button>
              </a>
              <a href="mailto:info@sanghibrothers.com" className="inline-flex">
                <button className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
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

export default Products;
