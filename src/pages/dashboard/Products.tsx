import React, { useState } from "react";
import {
  Box,
  Chip,
  Avatar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ImageButton from "../../components/imagePopup/ImageButton";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setIsRefreshed } from "../../store/slices/userSlice";
import { ROUTES } from "../../lib/consts";

const productsColumnDefs = [
  {
    headerName: "Product",
    field: "name",
    cellRenderer: (params: any) => {
      let firstImage = "";
      if (params.data?.images) {
        const images = Array.isArray(params.data.images)
          ? params.data.images
          : typeof params.data.images === "string"
          ? (() => {
              try {
                const parsed = JSON.parse(params.data.images);
                return Array.isArray(parsed) ? parsed : [params.data.images];
              } catch {
                return [params.data.images];
              }
            })()
          : [];
        firstImage = images.length > 0 ? images[0] : "";
      }

      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
          <Avatar
            src={firstImage}
            alt={params.value || "Product"}
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              "& img": {
                objectFit: "cover",
              },
            }}
            variant="rounded"
          >
            {!firstImage &&
              (params.value ? params.value.charAt(0).toUpperCase() : "P")}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {params.value || "Unnamed Product"}
          </Typography>
        </Box>
      );
    },
    width: 280,
  },
  { headerName: "Description", field: "description" },
  {
    headerName: "Colors",
    field: "color",
    cellRenderer: (params: any) => {
      const colors = Array.isArray(params.value)
        ? params.value
        : typeof params.value === "string"
        ? params.value.includes(",")
          ? params.value.split(",")
          : [params.value]
        : [];
      return (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {colors.slice(0, 2).map((color: string, index: number) => (
            <Chip key={index} label={color.trim()} size="small" />
          ))}
          {colors.length > 2 && (
            <Chip
              label={`+${colors.length - 2}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      );
    },
  },
  {
    headerName: "Images",
    field: "images",
    cellRenderer: (params: any) => (
      <ImageButton
        images={params.value}
        productName={params.data?.name}
        variant="chip"
      />
    ),
  },
  { headerName: "Quantity", field: "inventory.quantity" },
  {
    headerName: "Price (INR)",
    field: "price",
    cellRenderer: (params: any) =>
      params.value ? `₹${Number(params.value).toFixed(2)}` : "-",
  },
  {
    headerName: "Size",
    field: "size",
    cellRenderer: (params: any) => {
      const sizes = Array.isArray(params.value)
        ? params.value
        : typeof params.value === "string"
        ? params.value.includes(",")
          ? params.value.split(",")
          : [params.value]
        : [];
      return (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {sizes.slice(0, 2).map((size: string, index: number) => (
            <Chip
              key={index}
              label={size.trim()}
              size="small"
              color="secondary"
            />
          ))}
          {sizes.length > 2 && (
            <Chip
              label={`+${sizes.length - 2}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      );
    },
  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: (params: any) => <ActionButtons productData={params.data} />,
    width: 120,
    sortable: false,
    filter: false,
  },
];

// Action Buttons Component (Edit and Delete)
interface ActionButtonsProps {
  productData: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ productData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    // Store the product data in localStorage for the EditProduct page to use
    localStorage.setItem("editProductData", JSON.stringify(productData));
    // Navigate to edit product page
    navigate(ROUTES.EDIT_PRODUCT.replace(":id", productData.id));
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // Call the actual API to delete the product
      await API.deleteProduct(productData.id);

      // Close the dialog
      setDeleteDialogOpen(false);

      // Toggle the refresh state (opposite of previous value)
      dispatch(setIsRefreshed(!isRefreshed));

      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    // Just close the dialog, don't delete anything
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton
          color="primary"
          size="small"
          onClick={handleEditClick}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton
          color="error"
          size="small"
          onClick={handleDeleteClick}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.04)",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "
            {productData?.name || "this product"}"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Products: React.FC = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);

  return (
    <>
      <GenericAgGrid
        title="Products Overview"
        columnDefs={productsColumnDefs}
        fetchData={API.getAllProducts}
        refreshStatus={isRefreshed}
        type="products"
      />
    </>
  );
};

export default Products;
