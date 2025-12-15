import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllCategories, useProducts } from "@/hooks/useProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Package, FolderTree, Settings, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const AdminOverview = () => {
  const { data: categories } = useAllCategories();
  const { data: products } = useProducts();
  const { data: settings } = useSiteSettings();

  const stats = [
    {
      title: "Total Categories",
      value: categories?.length || 0,
      icon: FolderTree,
      color: "text-blue-500",
      link: "/admin/dashboard/categories",
    },
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: Package,
      color: "text-green-500",
      link: "/admin/dashboard/products",
    },
    {
      title: "Site Settings",
      value: settings ? Object.keys(settings).length : 0,
      icon: Settings,
      color: "text-orange-500",
      link: "/admin/dashboard/settings",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the DE PIPES admin panel. Manage your website content here.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              to="/admin/dashboard/categories"
              className="block p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold">Add New Category</h3>
              <p className="text-sm text-muted-foreground">
                Create product categories and subcategories
              </p>
            </Link>
            <Link
              to="/admin/dashboard/products"
              className="block p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold">Add New Product</h3>
              <p className="text-sm text-muted-foreground">
                Add products to your catalog
              </p>
            </Link>
            <Link
              to="/admin/dashboard/settings"
              className="block p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold">Update Contact Details</h3>
              <p className="text-sm text-muted-foreground">
                Change phone, email, and address information
              </p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings && (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">Company Name:</span>
                  <p className="font-medium">{settings.company_name || "Not set"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <p className="font-medium">{settings.phone || "Not set"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{settings.email || "Not set"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <p className="font-medium text-sm">{settings.address || "Not set"}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
