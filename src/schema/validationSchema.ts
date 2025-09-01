import * as Yup from "yup";

const LoginValidation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const ProductValidation = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least ₹0.01")
    .typeError("Price must be a valid number"),

  color: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one color must be selected")
    .required("Color selection is required"),

  size: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one size must be selected")
    .required("Size selection is required"),

  images: Yup.array()
    .of(Yup.string().url("Each image must be a valid URL").required())
    .min(1, "At least one image URL is required")
    .required("Product images are required"),

  isFeatured: Yup.boolean().default(false),

  isTop: Yup.boolean().default(false),

  isNew: Yup.boolean().default(true),

  categoryId: Yup.string()
    .required("Category selection is required")
    .min(1, "Please select a valid category"),

  inventory: Yup.number()
    .required("Inventory count is required")
    .integer("Inventory must be a whole number")
    .min(0, "Inventory cannot be negative")
    .typeError("Inventory must be a valid number"),
});

export { LoginValidation, ProductValidation };
