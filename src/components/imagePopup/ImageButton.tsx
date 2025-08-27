import React, { useState } from "react";
import { Button, Chip, Box } from "@mui/material";
import {
  Image as ImageIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import ImagePopup from "../imagePopup/ImagePopup";

interface ImageButtonProps {
  images: string | string[];
  productName?: string;
  variant?: "button" | "chip";
}

const ImageButton: React.FC<ImageButtonProps> = ({
  images,
  productName,
  variant = "button",
}) => {
  const [popupOpen, setPopupOpen] = useState(false);

  // Convert images to array if it's a string
  const imageArray = React.useMemo(() => {
    if (typeof images === "string") {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [images];
      } catch {
        // If parsing fails, treat as single URL
        return [images];
      }
    }
    return Array.isArray(images) ? images : [];
  }, [images]);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  if (!imageArray || imageArray.length === 0) {
    return <Chip label="No Images" size="small" color="default" disabled />;
  }

  if (variant === "chip") {
    return (
      <Box>
        <Chip
          icon={<ImageIcon />}
          label={`${imageArray.length} Image${
            imageArray.length > 1 ? "s" : ""
          }`}
          onClick={handleOpenPopup}
          clickable
          color="primary"
          size="small"
          sx={{
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        />
        <ImagePopup
          open={popupOpen}
          onClose={handleClosePopup}
          images={imageArray}
          title={productName ? `${productName} - Images` : "Product Images"}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        startIcon={<VisibilityIcon />}
        onClick={handleOpenPopup}
        sx={{
          textTransform: "none",
          minWidth: "auto",
          px: 2,
        }}
      >
        View Images ({imageArray.length})
      </Button>
      <ImagePopup
        open={popupOpen}
        onClose={handleClosePopup}
        images={imageArray}
        title={productName ? `${productName} - Images` : "Product Images"}
      />
    </Box>
  );
};

export default ImageButton;
