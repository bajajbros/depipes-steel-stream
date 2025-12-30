import { useState, useRef } from "react";
import JSZip from "jszip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAllCategories, useProducts } from "@/hooks/useProducts";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, Package, Upload, Download, FolderArchive, Image as ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProducts = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories } = useAllCategories();
  const { getToken } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const imageImportRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    specifications: "",
    image_url: "",
    category_id: "",
    is_featured: false,
    sort_order: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isImportingZip, setIsImportingZip] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>("");

  // Bulk selection state
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Image import state
  const [isImageImportOpen, setIsImageImportOpen] = useState(false);
  const [importCategoryId, setImportCategoryId] = useState<string>("");
  const [importSubcategoryId, setImportSubcategoryId] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isImageImporting, setIsImageImporting] = useState(false);
  const [imageImportProgress, setImageImportProgress] = useState(0);

  const parentCategories = categories?.filter((c) => !c.parent_id) || [];
  const getSubcategories = (parentId: string) =>
    categories?.filter((c) => c.parent_id === parentId) || [];

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      specifications: "",
      image_url: "",
      category_id: "",
      is_featured: false,
      sort_order: 0,
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      specifications: product.specifications || "",
      image_url: product.image_url || "",
      category_id: product.category_id || "",
      is_featured: product.is_featured || false,
      sort_order: product.sort_order || 0,
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast({
        title: "Validation error",
        description: "Name and slug are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const token = getToken();

    try {
      const action = editingProduct ? "update-product" : "create-product";
      const data = editingProduct
        ? { id: editingProduct.id, ...formData, category_id: formData.category_id || null }
        : { ...formData, category_id: formData.category_id || null };

      const { error } = await supabase.functions.invoke("admin-operations", {
        body: { action, token, data },
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: editingProduct ? "Product updated" : "Product created",
        description: "Your changes have been saved successfully.",
      });

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = getToken();

    try {
      const { error } = await supabase.functions.invoke("admin-operations", {
        body: { action: "delete-product", token, data: { id } },
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Product deleted",
        description: "The product has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && products) {
      setSelectedProducts(new Set(products.map((p) => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelection = new Set(selectedProducts);
    if (checked) {
      newSelection.add(productId);
    } else {
      newSelection.delete(productId);
    }
    setSelectedProducts(newSelection);
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    setIsBulkDeleting(true);
    const token = getToken();

    try {
      const deletePromises = Array.from(selectedProducts).map((id) =>
        supabase.functions.invoke("admin-operations", {
          body: { action: "delete-product", token, data: { id } },
        })
      );

      await Promise.all(deletePromises);
      
      toast({
        title: "Products deleted",
        description: `${selectedProducts.size} products have been deleted.`,
      });
      
      setSelectedProducts(new Set());
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete some products",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  // Image import handlers
  const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedImages(Array.from(files));
    }
  };

  const resetImageImport = () => {
    setImportCategoryId("");
    setImportSubcategoryId("");
    setSelectedImages([]);
    setImageImportProgress(0);
    if (imageImportRef.current) {
      imageImportRef.current.value = "";
    }
  };

  const handleImageImport = async () => {
    if (!importSubcategoryId && !importCategoryId) {
      toast({
        title: "Validation error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    if (selectedImages.length === 0) {
      toast({
        title: "Validation error",
        description: "Please select images",
        variant: "destructive",
      });
      return;
    }

    setIsImageImporting(true);
    setImageImportProgress(0);

    const categoryId = importSubcategoryId || importCategoryId;
    const total = selectedImages.length;
    let completed = 0;
    const token = getToken();

    try {
      for (const file of selectedImages) {
        // Get product name from filename (without extension)
        const productName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const slug = generateSlugFromName(productName) + "-" + Date.now();

        // Upload image to storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${generateSlugFromName(productName)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        // Create product
        const { error } = await supabase.functions.invoke("admin-operations", {
          body: {
            action: "create-product",
            token,
            data: {
              name: productName,
              slug,
              description: "",
              specifications: "",
              image_url: urlData.publicUrl,
              category_id: categoryId,
              is_featured: false,
              sort_order: 0,
            },
          },
        });

        if (error) {
          console.error("Product creation error:", error);
          toast({
            title: "Error",
            description: `Failed to create product for ${file.name}`,
            variant: "destructive",
          });
        }

        completed++;
        setImageImportProgress((completed / total) * 100);
      }

      toast({
        title: "Import completed",
        description: `${completed} products imported successfully`,
      });
      
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsImageImportOpen(false);
      resetImageImport();
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsImageImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = ["name", "category_slug", "description", "specifications", "image_url", "is_featured", "sort_order"];
    const exampleRows = [
      ["K-7 DI Pipe 100mm", "di-pipes-fittings", "High-quality ductile iron pipe", "Size: 100mm, Class: K-7", "", "false", "1"],
      ["CI Bend 90°", "ci-pipes-fittings", "Cast iron 90 degree bend", "Angle: 90°, Material: CI", "", "false", "2"],
    ];
    
    const csvContent = [
      headers.join(","),
      ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const token = getToken();

    try {
      const text = await file.text();
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error("CSV file must have a header row and at least one data row");
      }

      const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
      const requiredHeaders = ["name"];
      
      for (const required of requiredHeaders) {
        if (!headers.includes(required)) {
          throw new Error(`Missing required column: ${required}`);
        }
      }

      const productsData: any[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/("([^"]*)"|[^,]*)/g)?.map(v => 
          v.trim().replace(/^"|"$/g, "")
        ) || [];
        
        if (values.length === 0 || !values[headers.indexOf("name")]) continue;

        const name = values[headers.indexOf("name")] || "";
        const categorySlug = values[headers.indexOf("category_slug")] || "";
        
        let categoryId = null;
        if (categorySlug && categories) {
          const category = categories.find(c => c.slug === categorySlug);
          if (category) {
            categoryId = category.id;
          }
        }

        productsData.push({
          name,
          slug: generateSlugFromName(name),
          category_id: categoryId,
          description: values[headers.indexOf("description")] || null,
          specifications: values[headers.indexOf("specifications")] || null,
          image_url: values[headers.indexOf("image_url")] || null,
          is_featured: values[headers.indexOf("is_featured")]?.toLowerCase() === "true",
          sort_order: parseInt(values[headers.indexOf("sort_order")]) || 0,
        });
      }

      if (productsData.length === 0) {
        throw new Error("No valid products found in CSV");
      }

      let successCount = 0;
      let failCount = 0;

      for (const product of productsData) {
        try {
          const { error } = await supabase.functions.invoke("admin-operations", {
            body: { action: "create-product", token, data: product },
          });
          
          if (error) {
            failCount++;
            console.error(`Failed to import ${product.name}:`, error);
          } else {
            successCount++;
          }
        } catch (err) {
          failCount++;
          console.error(`Failed to import ${product.name}:`, err);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Import completed",
        description: `Successfully imported ${successCount} products. ${failCount > 0 ? `Failed: ${failCount}` : ""}`,
      });

    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isImageFile = (filename: string): boolean => {
    const ext = filename.toLowerCase().split(".").pop();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
  };

  const handleZipImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImportingZip(true);
    setImportProgress(0);
    setImportStatus("Reading ZIP file...");
    const token = getToken();

    try {
      const zip = await JSZip.loadAsync(file);
      
      const folderContents: Record<string, { path: string; file: JSZip.JSZipObject }[]> = {};
      const rootImages: { path: string; file: JSZip.JSZipObject }[] = [];

      for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) continue;
        if (!isImageFile(path)) continue;

        const parts = path.split("/").filter(p => p);
        
        if (parts.length === 1) {
          rootImages.push({ path, file: zipEntry });
        } else {
          const folderName = parts[0];
          if (!folderContents[folderName]) {
            folderContents[folderName] = [];
          }
          folderContents[folderName].push({ path, file: zipEntry });
        }
      }

      const allFiles: { path: string; file: JSZip.JSZipObject; categoryName: string | null }[] = [];
      
      for (const [folderName, images] of Object.entries(folderContents)) {
        for (const img of images) {
          allFiles.push({ ...img, categoryName: folderName });
        }
      }
      for (const img of rootImages) {
        allFiles.push({ ...img, categoryName: null });
      }

      if (allFiles.length === 0) {
        throw new Error("No image files found in ZIP");
      }

      let successCount = 0;
      let failCount = 0;
      const createdCategories = new Set<string>();

      for (let i = 0; i < allFiles.length; i++) {
        const { path, file: zipEntry, categoryName } = allFiles[i];
        const filename = path.split("/").pop()!;
        const productName = filename.replace(/\.[^/.]+$/, "");

        setImportStatus(`Uploading ${i + 1}/${allFiles.length}: ${productName}`);
        setImportProgress(Math.round((i / allFiles.length) * 100));

        try {
          const blob = await zipEntry.async("blob");
          const imageFile = new File([blob], filename, { type: `image/${filename.split(".").pop()?.toLowerCase() || "jpeg"}` });

          const formDataUpload = new FormData();
          formDataUpload.append("file", imageFile);
          formDataUpload.append("token", token || "");
          formDataUpload.append("productName", productName);
          if (categoryName) {
            formDataUpload.append("categoryName", categoryName);
          }
          if (selectedParentCategory) {
            formDataUpload.append("parentCategoryId", selectedParentCategory);
          }

          const { data, error } = await supabase.functions.invoke("import-zip", {
            body: formDataUpload,
          });

          if (error) {
            failCount++;
            console.error(`Failed to import ${productName}:`, error);
          } else {
            successCount++;
            if (data.categoryCreated && categoryName) {
              createdCategories.add(categoryName);
            }
          }
        } catch (err) {
          failCount++;
          console.error(`Error processing ${filename}:`, err);
        }
      }

      setImportProgress(100);
      setImportStatus("");

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["all-product-categories"] });

      toast({
        title: "ZIP Import completed",
        description: `Created ${createdCategories.size} categories, ${successCount} products. ${failCount > 0 ? `Failed: ${failCount}` : ""}`,
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsImportingZip(false);
      setImportProgress(0);
      setImportStatus("");
      if (zipInputRef.current) {
        zipInputRef.current.value = "";
      }
    }
  };

  const isAllSelected = products && products.length > 0 && selectedProducts.size === products.length;
  const isSomeSelected = selectedProducts.size > 0;

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isSomeSelected && (
            <Button
              variant="destructive"
              onClick={() => setShowBulkDeleteConfirm(true)}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Selected ({selectedProducts.size})
            </Button>
          )}
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            CSV Template
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileImport}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Import CSV
          </Button>
          <input
            ref={zipInputRef}
            type="file"
            accept=".zip"
            onChange={handleZipImport}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <Select
              value={selectedParentCategory || "_none"}
              onValueChange={(value) => setSelectedParentCategory(value === "_none" ? "" : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">No parent</SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => zipInputRef.current?.click()}
              disabled={isImportingZip}
              variant="outline"
            >
              {isImportingZip ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FolderArchive className="h-4 w-4 mr-2" />
              )}
              Import ZIP
            </Button>
          </div>
          {isImportingZip && (
            <div className="w-full max-w-xs space-y-1">
              <Progress value={importProgress} className="h-2" />
              <p className="text-xs text-muted-foreground truncate">{importStatus}</p>
            </div>
          )}

          {/* Image Import Dialog */}
          <Dialog open={isImageImportOpen} onOpenChange={setIsImageImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ImageIcon className="h-4 w-4 mr-2" />
                Import Images
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Import Products from Images</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={importCategoryId || "_none"}
                    onValueChange={(value) => {
                      setImportCategoryId(value === "_none" ? "" : value);
                      setImportSubcategoryId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Select category</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {importCategoryId && getSubcategories(importCategoryId).length > 0 && (
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Select
                      value={importSubcategoryId || "_none"}
                      onValueChange={(value) => setImportSubcategoryId(value === "_none" ? "" : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">No subcategory</SelectItem>
                        {getSubcategories(importCategoryId).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Select Images</Label>
                  <Input
                    ref={imageImportRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesSelected}
                  />
                  {selectedImages.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedImages.length} images selected
                    </p>
                  )}
                </div>

                {selectedImages.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-1 border rounded p-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <ImageIcon className="h-3 w-3" />
                        {file.name.replace(/\.[^/.]+$/, "")}
                      </div>
                    ))}
                  </div>
                )}

                {isImageImporting && (
                  <div className="space-y-2">
                    <Progress value={imageImportProgress} />
                    <p className="text-sm text-muted-foreground text-center">
                      Importing... {Math.round(imageImportProgress)}%
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsImageImportOpen(false);
                      resetImageImport();
                    }}
                    disabled={isImageImporting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImageImport}
                    disabled={isImageImporting || selectedImages.length === 0 || (!importCategoryId && !importSubcategoryId)}
                  >
                    {isImageImporting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Import {selectedImages.length} Products
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: editingProduct ? formData.slug : generateSlug(name),
                    });
                  }}
                  placeholder="e.g., K-7 Class DI Pipe 150mm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., k7-di-pipe-150mm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id || "_none"}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value === "_none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">None</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.parent_id ? `  ↳ ${cat.name}` : cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief product description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Product specifications (comma-separated or newline-separated)"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/product.jpg"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                  />
                  <Label htmlFor="is_featured">Featured Product</Label>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              All Products ({products?.length || 0})
            </div>
            {products && products.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm font-normal cursor-pointer">
                  Select All
                </Label>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No products yet. Add your first product to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedProducts.has(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                    />
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {product.name}
                        {product.is_featured && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getCategoryName(product.category_id)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedProducts.size} Products?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all selected products. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBulkDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
