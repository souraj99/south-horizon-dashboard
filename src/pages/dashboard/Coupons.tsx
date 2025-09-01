import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setIsRefreshed } from "../../store/slices/userSlice";
import { useState } from "react";
import { ROUTES } from "../../lib/consts";

const couponsColumnDefs = [
  { headerName: "Code", field: "code" },
  {
    headerName: "Discount",
    field: "discount",
    cellRenderer: (params: any) => {
      const discountType = params.data?.discountType || "percentage";
      const discount = params.value || 0;
      return discountType === "percentage" ? `${discount}%` : `₹${discount}`;
    },
  },
  {
    headerName: "Expires At",
    field: "expiresAt",
    cellRenderer: (params: any) => {
      if (!params.value) return "-";
      const date = new Date(params.value);
      return date.toLocaleDateString();
    },
  },
  { headerName: "Max Uses", field: "maxUses" },
  {
    headerName: "Min Order Amount",
    field: "minOrderAmount",
    cellRenderer: (params: any) => (params.value ? `₹${params.value}` : "₹0"),
  },
  {
    headerName: "Status",
    field: "isActive",
    cellRenderer: (params: any) => (
      <Chip
        label={params.value ? "Active" : "Inactive"}
        color={params.value ? "success" : "default"}
        size="small"
      />
    ),
  },
  { headerName: "Description", field: "description" },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: (params: any) => <ActionButtons couponData={params.data} />,
    width: 120,
    sortable: false,
    filter: false,
  },
];

// Action Buttons Component
interface ActionButtonsProps {
  couponData: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ couponData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    // Store coupon data in localStorage for the edit page
    localStorage.setItem("editCouponData", JSON.stringify(couponData));
    navigate(ROUTES.EDIT_COUPON);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      // Call the actual API to delete the coupon
      await API.deleteCoupon(couponData.id);

      // Close the dialog
      setDeleteDialogOpen(false);

      // Toggle the refresh state (opposite of previous value)
      dispatch(setIsRefreshed(!isRefreshed));

      console.log("Coupon deleted successfully!");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Failed to delete coupon. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton color="primary" size="small" onClick={handleEditClick}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton color="error" size="small" onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Coupon</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete coupon "
            {couponData?.code || "this coupon"}"? This action cannot be undone.
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

const Coupons: React.FC = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  return (
    <>
      <GenericAgGrid
        title="Coupons Overview"
        columnDefs={couponsColumnDefs}
        fetchData={API.getAllCoupons}
        refreshStatus={isRefreshed}
        type="coupons"
      />
    </>
  );
};

export default Coupons;
