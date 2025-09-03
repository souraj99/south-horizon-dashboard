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

// Status Toggle Component
interface StatusToggleProps {
  couponData: any;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ couponData }) => {
  const dispatch = useDispatch();
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleStatusClick = () => {
    setStatusDialogOpen(true);
  };

  const handleStatusToggleConfirm = async () => {
    setIsToggling(true);
    try {
      // Call the toggle API
      await API.toggleCoupon(couponData.id);

      // Close the dialog
      setStatusDialogOpen(false);

      // Toggle the refresh state (opposite of previous value)
      dispatch(setIsRefreshed(!isRefreshed));

      console.log("Coupon status toggled successfully!");
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleStatusToggleCancel = () => {
    setStatusDialogOpen(false);
  };

  return (
    <>
      <Chip
        label={couponData.isActive ? "Active" : "Inactive"}
        color={couponData.isActive ? "success" : "default"}
        size="small"
        onClick={handleStatusClick}
        sx={{
          cursor: "pointer",
          "&:hover": {
            backgroundColor: couponData.isActive
              ? "rgba(46, 125, 50, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      <Dialog
        open={statusDialogOpen}
        onClose={handleStatusToggleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Toggle Coupon Status</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {couponData.isActive ? "deactivate" : "activate"} the coupon "
            {couponData?.code || "this coupon"}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusToggleCancel} disabled={isToggling}>
            Cancel
          </Button>
          <Button
            onClick={handleStatusToggleConfirm}
            color="primary"
            variant="contained"
            disabled={isToggling}
          >
            {isToggling
              ? "Toggling..."
              : `${couponData.isActive ? "Deactivate" : "Activate"}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

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
    cellRenderer: (params: any) => <StatusToggle couponData={params.data} />,
    width: 100,
    sortable: false,
    filter: false,
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
