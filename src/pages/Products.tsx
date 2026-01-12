import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllCategories } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";
import productsImage from "@/assets/products-main.jpg";

const Products = () => {
  const { categorySlug } = useParams();
  const { data: categories, isLoading } = useAllCategories();

  // Get current category if we have a slug
  const currentCategory = categorySlug
    ? categories?.find((c) => c.slug === categorySlug)
    : null;

  // Parent categories (main sections)
  const parentCategories = categories?.filter((c) => !c.parent_id) || [];

  // If viewing a parent category, get its subcategories (products)
  // If viewing a subcategory, redirect to parent with this as highlight
  const isParentCategory = currentCategory && !currentCategory.parent_id;
  const isSubcategory = currentCategory && currentCategory.parent_id;

  // Get products (subcategories) to display
  let productsToShow = isParentCategory
    ? categories?.filter((c) => c.parent_id === currentCategory.id) || []
    : isSubcategory
    ? categories?.filter((c) => c.parent_id === currentCategory.parent_id) || []
    : categories?.filter((c) => c.parent_id) || []; // All products

  // Get the parent category name for subcategory display
  const getParentName = (parentId: string | null) => {
    if (!parentId) return "";
    const parent = categories?.find((c) => c.id === parentId);
    return parent?.name || "";
  };

  if (isLoading) {
    return (
      <main className="py-12">
        <div className="section-container flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      {/* Hero Section */}
      <section className="section-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {currentCategory ? currentCategory.name : "Our Product Range"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {currentCategory?.description ||
              "Comprehensive piping solutions for water infrastructure and industrial applications"}
          </p>
        </div>
      </section>

      {/* Category Navigation - only show if not viewing a specific category */}
      {!currentCategory && parentCategories.length > 0 && (
        <section className="section-container mb-12">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {parentCategories.map((category) => {
              const categoryProducts = categories?.filter(
                (c) => c.parent_id === category.id
              );
              return (
                <Link key={category.id} to={`/products/${category.slug}`} className="block">
                  <Card className="hover-lift h-full transition-all hover:border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {categoryProducts?.length || 0} products
                      </p>
                    </CardHeader>
                    {category.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Products Grid (Subcategories displayed as product cards) */}
      <section className="section-container">
        <h2 className="text-2xl font-bold mb-6">
          {currentCategory ? "Products" : "All Products"}
        </h2>
        {productsToShow.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsToShow.map((product) => (
              <Card key={product.id} className="hover-lift overflow-hidden group">
                <div className="h-48 overflow-hidden bg-muted">
                  <img
                    src={product.image_url || productsImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = productsImage;
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                  {!currentCategory && product.parent_id && (
                    <p className="text-sm text-muted-foreground">
                      {getParentName(product.parent_id)}
                    </p>
                  )}
                </CardHeader>
                {product.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {product.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No products found{currentCategory ? " in this category" : ""}.
            </p>
          </Card>
        )}
      </section>

      {/* Additional Info Section */}
      <section className="section-container mt-20">
        <Card className="bg-section-pattern">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Custom Solutions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We offer custom sizing, specifications, and bulk supply arrangements. Our technical
              team is ready to assist with your specific requirements.
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
