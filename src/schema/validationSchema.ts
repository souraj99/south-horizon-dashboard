import * as Yup from "yup";
type AnyPresentValue = FileList | string | number | boolean;

const LoginValidation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const createNumberField = (fieldName: string, ref: string | null) => {
  let validation = Yup.number()
    .required(`${fieldName} is required`)
    .transform((originalValue) => {
      console.log(`${fieldName} transformed value: `, originalValue);
      return originalValue === "" ? 0 : originalValue;
    })
    .typeError(`${fieldName} must be a valid number`);

  if (ref) {
    validation = validation.max(
      Yup.ref(ref),
      `${fieldName} must not be greater than ${ref}`
    );
  }

  // Log the validation value at this stage
  validation = validation.test("log", `${fieldName} log test`, (value) => {
    console.log(`${fieldName} value: `, value); // Log the field value
    return true; // Return true to pass the validation test
  });
  return validation;
};

const CreateCampaignValidation = Yup.object().shape({
  name: Yup.string().required("Campaign name is required"),

  campaignLimit: createNumberField("Campaign Limit", null),
  dailyLimit: createNumberField("Daily Limit", "campaignLimit"),
  weeklyLimit: createNumberField("Weekly Limit", "dailyLimit"),
  monthlyLimit: createNumberField("Monthly Limit", "weeklyLimit"),

  description: Yup.string()
    .required("Description is required")
    .max(400, "Maximum word limit is 400 characters"),

  startDate: Yup.date()
    // .min(new Date(), "Start date cannot be in the past")
    .required("Start date is required")
    .typeError("Invalid start date"),

  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date")
    .typeError("Invalid end date"),

  campaignStatus: Yup.string().required("Campaign status is required"),

  campaignIcon: Yup.mixed<AnyPresentValue>()
    .required("Campaign icon is required")
    .nullable()
    .test("fileType", "Only PNG or JPG files are allowed", (value) => {
      if (value === null) return true;
      if (value instanceof FileList && value.length > 0) {
        const fileType = value[0].type;
        return fileType === "image/png" || fileType === "image/jpeg";
      }
      return false;
    }),
});
const CreateEditCampaignValidation = Yup.object().shape({
  name: Yup.string().required("Campaign name is required"),

  campaignLimit: createNumberField("Campaign Limit", null),
  dailyLimit: createNumberField("Daily Limit", "campaignLimit"),
  weeklyLimit: createNumberField("Weekly Limit", "dailyLimit"),
  monthlyLimit: createNumberField("Monthly Limit", "weeklyLimit"),

  description: Yup.string()
    .required("Description is required")
    .max(400, "Maximum word limit is 400 characters"),

  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid start date"),

  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date")
    .typeError("Invalid end date"),

  campaignStatus: Yup.string().required("Campaign status is required"),

  campaignIcon: Yup.mixed<AnyPresentValue>()
    .required("Campaign icon is required")
    .nullable()
    .test("fileType", "Only PNG or JPG files are allowed", (value) => {
      if (value === null) return true;
      if (value instanceof FileList && value.length > 0) {
        const fileType = value[0].type;
        return fileType === "image/png" || fileType === "image/jpeg";
      }
      return false;
    }),
});

const CreateOfferValidation = Yup.object().shape({
  title: Yup.string().required("Campaign name is required"),
  description: Yup.string()
    .required("Description is required")
    .max(400, "Maximum word limit is 400 characters"),
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid start date"),

  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date")
    .typeError("Invalid end date"),
  giftThumbnail: Yup.mixed<FileList>()
    .required("Offer thumbnail is required")
    .test("fileType", "Only PNG or JPG files are allowed", (value) => {
      if (value === null) return true;
      if (value instanceof FileList && value.length > 0) {
        const fileType = value[0].type;
        return fileType === "image/png" || fileType === "image/jpeg";
      }
      return false;
    }),
  giftIcon: Yup.mixed<FileList>()
    .required("Offer icon is required")
    .test("fileType", "Only PNG or JPG files are allowed", (value) => {
      if (value === null) return true;
      if (value instanceof FileList && value.length > 0) {
        const fileType = value[0].type;
        return fileType === "image/png" || fileType === "image/jpeg";
      }
      return false;
    }),
  giftType: Yup.string().required("Type is required"),
  tncIsLink: Yup.boolean()
    .required("T&C link preference is required")
    .typeError("Invalid value for T&C link preference"),
  redemptionLink: Yup.string()
    .nullable()
    .when("tncIsLink", {
      is: true,
      then: (schema) =>
        schema
          .url("Invalid URL for redemption link")
          .required("Redemption link is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  tncContent: Yup.string()
    .nullable()
    .when("tncIsLink", {
      is: false,
      then: (schema) =>
        schema
          .required("T&C content is required when T&C is not a link")
          .max(2000, "Maximum word limit for T&C content is 2000 characters"),
      otherwise: (schema) => schema.nullable(),
    }),
  tags: Yup.array()
    .of(Yup.string().required("Tag cannot be empty."))
    .min(1, "At least one tag is required")
    .required("Tags are required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .typeError("Amount must be a valid number"),
  brand: Yup.string().required("Brand is required"),
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

export {
  LoginValidation,
  CreateCampaignValidation,
  CreateOfferValidation,
  CreateEditCampaignValidation,
  ProductValidation,
};
