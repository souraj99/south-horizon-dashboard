import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  MobileStepper,
  Fade,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";

interface ImagePopupProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  title?: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  open,
  onClose,
  images,
  title = "Product Images",
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handleBack();
    } else if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "none",
          overflow: "visible",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "rgba(0, 0, 0, 0.9)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Title */}
        {title && (
          <Typography
            variant="h6"
            component="h2"
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              color: "white",
              zIndex: 10,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            {title}
          </Typography>
        )}

        <DialogContent sx={{ p: 0, position: "relative" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Navigation Arrows for multiple images */}
            {maxSteps > 1 && (
              <>
                <IconButton
                  onClick={handleBack}
                  sx={{
                    position: "absolute",
                    left: 16,
                    zIndex: 10,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <KeyboardArrowLeft />
                </IconButton>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: 16,
                    zIndex: 10,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <KeyboardArrowRight />
                </IconButton>
              </>
            )}

            {/* Image Display */}
            <Fade in={true} timeout={300}>
              <img
                src={images[activeStep]}
                alt={`Product image ${activeStep + 1}`}
                onError={handleImageError}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </Fade>

            {/* Image Counter */}
            {maxSteps > 1 && (
              <Paper
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  {activeStep + 1} / {maxSteps}
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Stepper for multiple images */}
          {maxSteps > 1 && (
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.8)",
                "& .MuiMobileStepper-dot": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                },
                "& .MuiMobileStepper-dotActive": {
                  bgcolor: "white",
                },
              }}
              nextButton={
                <IconButton
                  size="small"
                  onClick={handleNext}
                  disabled={false}
                  sx={{ color: "white" }}
                >
                  <KeyboardArrowRight />
                </IconButton>
              }
              backButton={
                <IconButton
                  size="small"
                  onClick={handleBack}
                  disabled={false}
                  sx={{ color: "white" }}
                >
                  <KeyboardArrowLeft />
                </IconButton>
              }
            />
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ImagePopup;
