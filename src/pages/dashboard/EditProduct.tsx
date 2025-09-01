import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  FormHelperText,
  Alert,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { ProductValidation } from "../../schema/validationSchema";
import { ProductRequest } from "../../interface/api";
import API from "../../api";
import { ROUTES } from "../../lib/consts";

// Interface for stored product data which might have different types
interface StoredProductData {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  color?: string | string[];
  size?: string | string[];
  images?: string | string[];
  isFeatured?: boolean;
  isTop?: boolean;
  isNew?: boolean;
  categoryId?: string;
  inventory?: number;
}

const colorOptions = [
  "red",
  "blue",
  "green",
  "yellow",
  "black",
  "white",
  "purple",
  "orange",
  "pink",
  "brown",
];
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [newColorInput, setNewColorInput] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [productData, setProductData] = useState<StoredProductData | null>(
    null
  );
  const [apiCategories, setApiCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const handleBackToProducts = () => {
    history.back();
  };

  // Load product data from localStorage on component mount
  React.useEffect(() => {
    const storedProductData = localStorage.getItem("editProductData");
    if (storedProductData) {
      try {
        const parsedData = JSON.parse(storedProductData);
        setProductData(parsedData);
        console.log(parsedData);
        // Parse images
        let images = [""];
        if (parsedData.images) {
          if (Array.isArray(parsedData.images)) {
            images = parsedData.images;
          } else if (typeof parsedData.images === "string") {
            try {
              const parsed = JSON.parse(parsedData.images);
              images = Array.isArray(parsed) ? parsed : [parsedData.images];
            } catch {
              images = [parsedData.images];
            }
          }
        }
        setImageUrls(images);

        // Clear localStorage after loading
        localStorage.removeItem("editProductData");
      } catch (error) {
        console.error("Error parsing product data:", error);
      }
    }
  }, []);

  // Fetch categories from API
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await API.getAllCategories();
        // Handle the correct API response format: array of objects with id and name
        if (Array.isArray(response)) {
          const transformedCategories = response.map(
            (category: { id: string; name: string }) => ({
              value: category.id,
              label: category.name,
            })
          );
          setApiCategories(transformedCategories);
        } else {
          // Fallback if response is not in expected format
          setApiCategories([
            { value: "mens-clothing", label: "Men's Clothing" },
            { value: "womens-clothing", label: "Women's Clothing" },
            { value: "kids-clothing", label: "Kids' Clothing" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to some default categories if API fails
        setApiCategories([
          { value: "mens-clothing", label: "Men's Clothing" },
          { value: "womens-clothing", label: "Women's Clothing" },
          { value: "kids-clothing", label: "Kids' Clothing" },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductRequest>({
    resolver: yupResolver(ProductValidation),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      color: [],
      size: [],
      images: [""],
      isFeatured: false,
      isTop: false,
      isNew: true,
      categoryId: "",
      inventory: 0,
    },
  });

  // Update form with product data when it's loaded
  React.useEffect(() => {
    if (productData) {
      setValue("name", productData.name || "");
      setValue("description", productData.description || "");
      setValue("price", productData.price || 0);
      setValue("categoryId", productData.categoryId || "");
      setValue("inventory", productData.inventory || 0);
      setValue("isFeatured", productData.isFeatured || false);
      setValue("isTop", productData.isTop || false);
      setValue("isNew", productData.isNew || false);

      // Handle colors
      if (productData.color) {
        const colors = Array.isArray(productData.color)
          ? productData.color
          : typeof productData.color === "string"
          ? productData.color.split(",").map((c: string) => c.trim())
          : [];
        setValue("color", colors);
      }

      // Handle sizes
      if (productData.size) {
        const sizes = Array.isArray(productData.size)
          ? productData.size
          : typeof productData.size === "string"
          ? productData.size.split(",").map((s: string) => s.trim())
          : [];
        setValue("size", sizes);
      }

      // Handle images
      setValue(
        "images",
        imageUrls.filter((url) => url.trim() !== "")
      );
    }
  }, [productData, setValue, imageUrls]);

  const watchedColors = watch("color");
  const watchedSizes = watch("size");

  const onSubmit = async (data: ProductRequest) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Filter out empty image URLs
      const filteredImages = imageUrls.filter((url) => url.trim() !== "");
      const productUpdateData: ProductRequest = {
        ...data,
        images: filteredImages,
      };

      // Simulate API call for updating product
      console.log("Updating product data:", productUpdateData);
      if (productData?.categoryId) {
        await API.updateProducts(productUpdateData, productData.categoryId);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(ROUTES.PRODUCTS);
      setSubmitMessage({
        type: "success",
        message: "Product updated successfully!",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      setSubmitMessage({
        type: "error",
        message: "Failed to update product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleColorToggle = (colorValue: string, currentColors: string[]) => {
    if (currentColors.includes(colorValue)) {
      return currentColors.filter((color) => color !== colorValue);
    } else {
      return [...currentColors, colorValue];
    }
  };

  const handleSizeToggle = (sizeValue: string, currentSizes: string[]) => {
    if (currentSizes.includes(sizeValue)) {
      return currentSizes.filter((size) => size !== sizeValue);
    } else {
      return [...currentSizes, sizeValue];
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    setValue(
      "images",
      newImageUrls.filter((url) => url.trim() !== "")
    );
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageField = (index: number) => {
    if (imageUrls.length > 1) {
      const newImageUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newImageUrls);
      setValue(
        "images",
        newImageUrls.filter((url) => url.trim() !== "")
      );
    }
  };

  const handleReset = () => {
    reset();
    setImageUrls([""]);
    setSubmitMessage(null);
    setCustomColors([]);
    setCustomCategories([]);
    setNewColorInput("");
    setNewCategoryInput("");
  };

  const addCustomColor = () => {
    if (
      newColorInput.trim() &&
      !colorOptions.includes(newColorInput.toLowerCase()) &&
      !customColors.includes(newColorInput.toLowerCase())
    ) {
      const newColor = newColorInput.toLowerCase().trim();
      setCustomColors([...customColors, newColor]);
      setNewColorInput("");
    }
  };

  const removeCustomColor = (colorToRemove: string) => {
    setCustomColors(customColors.filter((color) => color !== colorToRemove));
    // Also remove from selected colors if it exists
    const currentColors = watch("color");
    if (currentColors.includes(colorToRemove)) {
      setValue(
        "color",
        currentColors.filter((color) => color !== colorToRemove)
      );
    }
  };

  const addCustomCategory = () => {
    if (
      newCategoryInput.trim() &&
      !apiCategories.some(
        (cat: { value: string; label: string }) =>
          cat.label.toLowerCase() === newCategoryInput.toLowerCase()
      ) &&
      !customCategories.some(
        (cat: { value: string; label: string }) =>
          cat.label.toLowerCase() === newCategoryInput.toLowerCase()
      )
    ) {
      const newCategory = {
        value: newCategoryInput.toLowerCase().replace(/\s+/g, "-"),
        label: newCategoryInput.trim(),
      };
      setCustomCategories([...customCategories, newCategory]);
      setNewCategoryInput("");
    }
  };

  const removeCustomCategory = (categoryToRemove: {
    value: string;
    label: string;
  }) => {
    setCustomCategories(
      customCategories.filter((cat) => cat.value !== categoryToRemove.value)
    );
    // Also clear from form if this category was selected
    if (watch("categoryId") === categoryToRemove.value) {
      setValue("categoryId", "");
    }
  };

  // Combine default and custom options
  const allColors = [...colorOptions, ...customColors];
  const allCategories = [...apiCategories, ...customCategories];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton
          onClick={handleBackToProducts}
          sx={{
            bgcolor: "grey.100",
            "&:hover": { bgcolor: "grey.200" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Edit Product
        </Typography>
      </Box>

      {submitMessage && (
        <Alert severity={submitMessage.type} sx={{ mb: 3 }}>
          {submitMessage.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Product Name"
                          fullWidth
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.categoryId}>
                            <InputLabel>
                              {categoriesLoading
                                ? "Loading Categories..."
                                : "Category"}
                            </InputLabel>
                            <Select
                              {...field}
                              label={
                                categoriesLoading
                                  ? "Loading Categories..."
                                  : "Category"
                              }
                              disabled={categoriesLoading}
                            >
                              {categoriesLoading ? (
                                <MenuItem disabled>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <CircularProgress size={16} />
                                    Loading categories...
                                  </Box>
                                </MenuItem>
                              ) : (
                                allCategories.map((category) => (
                                  <MenuItem
                                    key={category.value}
                                    value={category.value}
                                  >
                                    {category.label}
                                    {customCategories.some(
                                      (cat) => cat.value === category.value
                                    ) && (
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeCustomCategory(category);
                                        }}
                                        sx={{ ml: 1 }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {errors.categoryId && (
                              <FormHelperText>
                                {errors.categoryId.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          label="Add Custom Category"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomCategory();
                            }
                          }}
                          disabled={categoriesLoading}
                          sx={{ flexGrow: 1 }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={addCustomCategory}
                          disabled={
                            !newCategoryInput.trim() || categoriesLoading
                          }
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Description"
                          fullWidth
                          multiline
                          rows={4}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Pricing and Inventory */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pricing & Inventory
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Price (INR)"
                          type="number"
                          fullWidth
                          inputProps={{ step: 0.01, min: 0 }}
                          error={!!errors.price}
                          helperText={errors.price?.message}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1 }}>₹</Typography>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="inventory"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Inventory Count"
                          type="number"
                          fullWidth
                          inputProps={{ step: 1, min: 0 }}
                          error={!!errors.inventory}
                          helperText={errors.inventory?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Product Features */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Featured Product"
                      />
                    )}
                  />
                  <Controller
                    name="isTop"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Top Product"
                      />
                    )}
                  />
                  <Controller
                    name="isNew"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="New Product"
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Colors */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Colors
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        {allColors.map((color) => (
                          <Box key={color} sx={{ position: "relative" }}>
                            <Chip
                              label={color}
                              clickable
                              color={
                                watchedColors?.includes(color)
                                  ? "primary"
                                  : "default"
                              }
                              onClick={() => {
                                const newColors = handleColorToggle(
                                  color,
                                  field.value || []
                                );
                                field.onChange(newColors);
                              }}
                              variant={
                                watchedColors?.includes(color)
                                  ? "filled"
                                  : "outlined"
                              }
                              onDelete={
                                customColors.includes(color)
                                  ? () => removeCustomColor(color)
                                  : undefined
                              }
                              deleteIcon={
                                customColors.includes(color) ? (
                                  <DeleteIcon />
                                ) : undefined
                              }
                            />
                          </Box>
                        ))}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <TextField
                          size="small"
                          label="Add Custom Color"
                          value={newColorInput}
                          onChange={(e) => setNewColorInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomColor();
                            }
                          }}
                          sx={{ flexGrow: 1 }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={addCustomColor}
                          disabled={!newColorInput.trim()}
                        >
                          Add
                        </Button>
                      </Box>
                      {errors.color && (
                        <FormHelperText error>
                          {errors.color.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Sizes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sizes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {sizeOptions.map((size) => (
                          <Chip
                            key={size}
                            label={size}
                            clickable
                            color={
                              watchedSizes?.includes(size)
                                ? "primary"
                                : "default"
                            }
                            onClick={() => {
                              const newSizes = handleSizeToggle(
                                size,
                                field.value || []
                              );
                              field.onChange(newSizes);
                            }}
                            variant={
                              watchedSizes?.includes(size)
                                ? "filled"
                                : "outlined"
                            }
                          />
                        ))}
                      </Box>
                      {errors.size && (
                        <FormHelperText error>
                          {errors.size.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Images
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {imageUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
                    >
                      <TextField
                        value={url}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        label={`Image URL ${index + 1}`}
                        fullWidth
                        variant="outlined"
                        placeholder="https://example.com/image.jpg"
                        error={
                          !!errors.images && index < (errors.images.length || 0)
                        }
                        helperText={
                          errors.images &&
                          Array.isArray(errors.images) &&
                          errors.images[index]
                            ? errors.images[index]?.message
                            : undefined
                        }
                      />
                      <IconButton
                        color="error"
                        onClick={() => removeImageField(index)}
                        disabled={imageUrls.length === 1}
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addImageField}
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Add Image URL
                  </Button>
                  {errors.images &&
                    typeof errors.images.message === "string" && (
                      <FormHelperText error>
                        {errors.images.message}
                      </FormHelperText>
                    )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
                sx={{ minWidth: 150 }}
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditProduct;
