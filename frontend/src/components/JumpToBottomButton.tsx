import React from "react";
import { Box, Fade, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface JumpToBottomButtonProps {
  show: boolean;
  progress: number;
  onClick: () => void;
}

export const JumpToBottomButton: React.FC<JumpToBottomButtonProps> = ({
  show,
  progress,
  onClick,
}) => {
  return (
    <Fade in={show}>
      <Box
        onClick={onClick}
        sx={{
          position: "absolute",
          bottom: 185,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.5,
          py: 0.5,
          borderRadius: 5,
          bgcolor: "primary.main",
          color: "white",
          boxShadow: 3,
          fontSize: 15,
          fontWeight: 500,
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <Box
          sx={{ position: "relative", display: "flex", alignItems: "center" }}
        >
          <CircularProgress
            variant="determinate"
            value={progress}
            size={20}
            thickness={5}
            sx={{ color: "white", opacity: 0.6 }}
          />
          <KeyboardArrowDownIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 14,
            }}
          />
        </Box>
        Новые сообщения
      </Box>
    </Fade>
  );
};
