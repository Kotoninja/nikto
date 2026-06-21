import { type MessageFieldInterface } from "../types/chat";
import { Paper, Typography, Box, Avatar } from "@mui/material";

export function MessageField({
  id,
  text,
  timestamp,
  username,
  getAvatarColor,
  formatTime,
}: MessageFieldInterface) {
  return (
    <Box
      key={id}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: getAvatarColor(username),
          width: 36,
          height: 36,
          fontSize: "0.9rem",
        }}
      >
        {username.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
          }}
        >
          {/* <Typography variant="subtitle2" fontWeight="bold"> */}
            {username}
          {/* </Typography> */}
          <Typography variant="caption" color="textSecondary">
            {formatTime(String(timestamp))}
          </Typography>
        </Box>
        <Paper
          sx={{
            p: 1.5,
            bgcolor: username === "System" ? "#e3f2fd" : "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
            {text}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
