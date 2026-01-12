import { useState, useRef } from "react";
import JSZip from "jszip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllCategories } from "@/hooks/useProducts";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, FolderTree, Upload, Image as ImageIcon } from "lucide-react";
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

const AdminCategories = () => {
  const { data: categories, isLoading } = useAllCategories();
  const { getToken } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const zipInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    parent_id: "",
    sort_order: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Bulk selection state
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // ZIP import state
  const [isImportingZip, setIsImportingZip] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState("");
  const [selectedParentForImport, setSelectedParentForImport] = useState("");

  // Image upload state (for editing subcategory image)
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      parent_id: "",
      sort_order: 0,
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
      parent_id: category.parent_id || "",
      sort_order: category.sort_order || 0,
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `category-${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: urlData.publicUrl });
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
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
      const action = editingCategory ? "update-category" : "create-category";
      const data = editingCategory
        ? { id: editingCategory.id, ...formData, parent_id: formData.parent_id || null }
        : { ...formData, parent_id: formData.parent_id || null };

      const { error } = await supabase.functions.invoke("admin-operations", {
        body: { action, token, data },
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["all-product-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["product-categories"] });

      toast({
        title: editingCategory ? "Category updated" : "Category created",
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
        body: { action: "delete-category", token, data: { id } },
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["all-product-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["product-categories"] });

      toast({
        title: "Category deleted",
        description: "The category has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked && categories) {
      setSelectedCategories(new Set(categories.map((c) => c.id)));
    } else {
      setSelectedCategories(new Set());
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    const newSelection = new Set(selectedCategories);
    if (checked) {
      newSelection.add(categoryId);
    } else {
      newSelection.delete(categoryId);
    }
    setSelectedCategories(newSelection);
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.size === 0) return;

    setIsBulkDeleting(true);
    const token = getToken();

    try {
      const deletePromises = Array.from(selectedCategories).map((id) =>
        supabase.functions.invoke("admin-operations", {
          body: { action: "delete-category", token, data: { id } },
        })
      );

      await Promise.all(deletePromises);

      toast({
        title: "Categories deleted",
        description: `${selectedCategories.size} categories have been deleted.`,
      });

      setSelectedCategories(new Set());
      await queryClient.invalidateQueries({ queryKey: ["all-product-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete some categories",
        variant: "destructive",
      });
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  // ZIP import - creates subcategories as products
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

      // Structure: Category Folder > Subcategory Folder > Images
      // OR: Category Folder > Images (image becomes subcategory/product)
      const structure: Record<string, Record<string, { path: string; file: JSZip.JSZipObject }[]>> = {};

      for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.dir) continue;
        if (!isImageFile(path)) continue;

        const parts = path.split("/").filter((p) => p);

        if (parts.length >= 2) {
          const categoryName = parts[0];
          // If there's a subfolder, use it as subcategory name; otherwise use image name
          const subcategoryName = parts.length >= 3 ? parts[1] : parts[parts.length - 1].replace(/\.[^/.]+$/, "");

          if (!structure[categoryName]) {
            structure[categoryName] = {};
          }
          if (!structure[categoryName][subcategoryName]) {
            structure[categoryName][subcategoryName] = [];
          }
          structure[categoryName][subcategoryName].push({ path, file: zipEntry });
        }
      }

      // Count total operations
      let totalOperations = 0;
      for (const cat of Object.keys(structure)) {
        totalOperations++; // Create category
        totalOperations += Object.keys(structure[cat]).length; // Create subcategories
      }

      if (totalOperations === 0) {
        throw new Error("No valid structure found in ZIP. Expected: Category/Subcategory/image.jpg or Category/image.jpg");
      }

      let completed = 0;
      const createdCategories: string[] = [];
      const createdSubcategories: string[] = [];

      for (const [categoryName, subcategories] of Object.entries(structure)) {
        setImportStatus(`Creating category: ${categoryName}`);

        // Find or create parent category
        const categorySlug = generateSlug(categoryName);
        let categoryId: string;

        const existingCategory = categories?.find((c) => c.slug === categorySlug && !c.parent_id);
        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const { data: newCat, error: catError } = await supabase.functions.invoke("admin-operations", {
            body: {
              action: "create-category",
              token,
              data: {
                name: categoryName,
                slug: categorySlug,
                parent_id: selectedParentForImport || null,
              },
            },
          });
          if (catError) {
            console.error("Failed to create category:", catError);
            continue;
          }
          categoryId = newCat.data.id;
          createdCategories.push(categoryName);
        }

        completed++;
        setImportProgress(Math.round((completed / totalOperations) * 100));

        // Create subcategories (these are displayed as products)
        for (const [subcategoryName, images] of Object.entries(subcategories)) {
          setImportStatus(`Creating: ${subcategoryName}`);

          // Use the first image as the subcategory image
          const firstImage = images[0];
          let imageUrl = "";

          try {
            const blob = await firstImage.file.async("blob");
            const filename = firstImage.path.split("/").pop()!;
            const fileExt = filename.split(".").pop()?.toLowerCase() || "jpg";
            const storagePath = `categories/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(storagePath, blob, {
                contentType: `image/${fileExt}`,
              });

            if (!uploadError) {
              const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(storagePath);
              imageUrl = urlData.publicUrl;
            }
          } catch (err) {
            console.error("Image upload error:", err);
          }

          // Create subcategory (as product)
          const subSlug = generateSlug(subcategoryName) + "-" + Date.now().toString(36);
          const { error: subError } = await supabase.functions.invoke("admin-operations", {
            body: {
              action: "create-category",
              token,
              data: {
                name: subcategoryName.replace(/[-_]/g, " "),
                slug: subSlug,
                parent_id: categoryId,
                image_url: imageUrl,
              },
            },
          });

          if (!subError) {
            createdSubcategories.push(subcategoryName);
          } else {
            console.error("Failed to create subcategory:", subError);
          }

          completed++;
          setImportProgress(Math.round((completed / totalOperations) * 100));
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["all-product-categories"] });
      await queryClient.invalidateQueries({ queryKey: ["product-categories"] });

      toast({
        title: "Import completed",
        description: `Created ${createdCategories.length} categories and ${createdSubcategories.length} products.`,
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

  const parentCategories = categories?.filter((c) => !c.parent_id) || [];
  const allSubcategories = categories?.filter((c) => c.parent_id) || [];
  const isAllSelected = categories && categories.length > 0 && selectedCategories.size === categories.length;
  const isSomeSelected = selectedCategories.size > 0;

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">Categories & Products</h1>
          <p className="text-muted-foreground mt-2">
            Categories are shown as sections. Subcategories are displayed as products on the website.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isSomeSelected && (
            <>
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
                Delete Selected ({selectedCategories.size})
              </Button>
            </>
          )}
          <input
            ref={zipInputRef}
            type="file"
            accept=".zip"
            onChange={handleZipImport}
            className="hidden"
          />
          <Select
            value={selectedParentForImport || "_none"}
            onValueChange={(value) => setSelectedParentForImport(value === "_none" ? "" : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Import under..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">No parent (new categories)</SelectItem>
              {parentCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => zipInputRef.current?.click()}
            disabled={isImportingZip}
          >
            {isImportingZip ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Import ZIP
          </Button>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: editingCategory ? formData.slug : generateSlug(name),
                      });
                    }}
                    placeholder="e.g., DI Spun Pipes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., di-spun-pipes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category (makes this a product)</Label>
                  <Select
                    value={formData.parent_id || "_none"}
                    onValueChange={(value) => setFormData({ ...formData, parent_id: value === "_none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None (Top-level category)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">None (Top-level category)</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
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
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image {formData.parent_id && "(Product Image)"}</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Image URL or upload"
                      className="flex-1"
                    />
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-24 h-24 object-cover rounded mt-2" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
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

      {/* Import Progress */}
      {isImportingZip && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{importStatus}</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCategories.size} items?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected categories and their subcategories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              All Categories ({parentCategories.length}) & Products ({allSubcategories.length})
            </div>
            {categories && categories.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                <span className="text-sm font-normal">Select All</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!categories || categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No categories yet. Add your first category or import a ZIP file to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {parentCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedCategories.has(category.id)}
                        onCheckedChange={(checked) => handleSelectCategory(category.id, checked as boolean)}
                      />
                      <FolderTree className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
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
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This will also delete all products in this category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {/* Subcategories (Products) */}
                  {categories
                    .filter((c) => c.parent_id === category.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-4 ml-8 mt-2 bg-muted/30 rounded-lg border-l-2 border-primary/30"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedCategories.has(sub.id)}
                            onCheckedChange={(checked) => handleSelectCategory(sub.id, checked as boolean)}
                          />
                          {sub.image_url ? (
                            <img src={sub.image_url} alt={sub.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{sub.name}</h4>
                            <p className="text-sm text-muted-foreground">{sub.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(sub)}>
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
                                  Are you sure you want to delete "{sub.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(sub.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
