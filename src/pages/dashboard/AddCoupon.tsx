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
  FormControlLabel,
  Switch,
  Alert,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import * as Yup from "yup";
import API from "../../api";

// Form data structure for adding coupons
interface CouponFormData {
  code: string;
  discount: number;
  expiresAt: string;
  maxUses: number;
  minOrderAmount: number;
  description: string;
  isActive: boolean;
}

// Validation schema for coupon
const CouponValidation = Yup.object().shape({
  code: Yup.string()
    .required("Coupon code is required")
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must not exceed 20 characters")
    .matches(
      /^[A-Z0-9_-]+$/,
      "Code must contain only uppercase letters, numbers, underscores, and hyphens"
    ),

  discount: Yup.number()
    .required("Discount is required")
    .positive("Discount must be a positive number")
    .max(100, "Discount cannot exceed 100")
    .typeError("Discount must be a valid number"),

  expiresAt: Yup.string()
    .required("Expiry date is required")
    .test("future-date", "Expiry date cannot be in the past", function (value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),

  maxUses: Yup.number()
    .required("Maximum uses is required")
    .integer("Maximum uses must be a whole number")
    .min(1, "Maximum uses must be at least 1")
    .typeError("Maximum uses must be a valid number"),

  minOrderAmount: Yup.number()
    .required("Minimum order amount is required")
    .min(0, "Minimum order amount cannot be negative")
    .typeError("Minimum order amount must be a valid number"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must not exceed 200 characters"),

  isActive: Yup.boolean().default(true),
});

const AddCoupon: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CouponFormData>({
    resolver: yupResolver(CouponValidation),
    defaultValues: {
      code: "",
      discount: 0,
      expiresAt: "",
      maxUses: 1,
      minOrderAmount: 0,
      description: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: CouponFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Format the data to match API expectations (add missing fields with defaults)
      const couponData = {
        code: data.code.toUpperCase(),
        discount: data.discount,
        discountType: "percentage" as const, // Default to percentage since API expects this
        expiresAt: data.expiresAt,
        maxUses: data.maxUses,
        usedCount: 0, // Default value since API expects this
        minOrderAmount: data.minOrderAmount,
        description: data.description,
        isActive: data.isActive,
      };

      // Submit the coupon data
      console.log("Submitting coupon data:", couponData);
      await API.addCoupon(couponData);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      setSubmitMessage({
        type: "success",
        message: "Coupon created successfully!",
      });
      reset();

      // Navigate back to coupons page after successful creation
      setTimeout(() => {
        navigate("/dashboard/coupons");
      }, 1500);
    } catch (error) {
      console.error("Error creating coupon:", error);
      setSubmitMessage({
        type: "error",
        message: "Failed to create coupon. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSubmitMessage(null);
  };

  const handleBack = () => {
    navigate("/dashboard/coupons");
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Add New Coupon
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
                      name="code"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Coupon Code"
                          fullWidth
                          error={!!errors.code}
                          helperText={errors.code?.message}
                          variant="outlined"
                          placeholder="e.g., SAVE20"
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      )}
                    />
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
                          rows={3}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                          variant="outlined"
                          placeholder="Describe when and how this coupon can be used"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Discount Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Discount Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="discount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Discount (%)"
                          type="number"
                          fullWidth
                          inputProps={{
                            step: 1,
                            min: 0,
                            max: 100,
                          }}
                          error={!!errors.discount}
                          helperText={errors.discount?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="minOrderAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Minimum Order Amount (₹)"
                          type="number"
                          fullWidth
                          inputProps={{ step: 0.01, min: 0 }}
                          error={!!errors.minOrderAmount}
                          helperText={errors.minOrderAmount?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Usage Limits */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Usage Limits
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="maxUses"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Maximum Uses"
                          type="number"
                          fullWidth
                          inputProps={{ step: 1, min: 1 }}
                          error={!!errors.maxUses}
                          helperText={errors.maxUses?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="expiresAt"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Expiry Date"
                          type="date"
                          fullWidth
                          error={!!errors.expiresAt}
                          helperText={errors.expiresAt?.message}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            min: formatDateForInput(new Date()),
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Active Coupon"
                    />
                  )}
                />
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
                {isSubmitting ? "Creating..." : "Create Coupon"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddCoupon;
