import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Создаем тему
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Интерфейс для сообщения
interface Message {
  id: number;
  text: string;
  timestamp: Date;
  username: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("Anonymous");

  // Обработчик отправки сообщения
  const handleSendMessage = (): void => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage.trim(),
        timestamp: new Date(),
        username: username || "Anonymous",
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  // Обработчик нажатия Enter
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Форматирование времени
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Получение цвета аватара на основе имени
  const getAvatarColor = (name: string): string => {
    const colors = [
      "#2196f3",
      "#4caf50",
      "#ff9800",
      "#e91e63",
      "#9c27b0",
      "#3f51b5",
      "#009688",
      "#f44336",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ height: "100vh", py: 3 }}>
        <Paper
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            💬 Чат
          </Typography>

          {/* Настройка имени пользователя */}
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="enter your NIK"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите свой NIK"
              size="small"
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Область сообщений */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              minHeight: 200,
              maxHeight: "calc(100vh - 350px)",
            }}
          >
            <Stack spacing={2}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: getAvatarColor(msg.username),
                      width: 36,
                      height: 36,
                      fontSize: "0.9rem",
                    }}
                  >
                    {msg.username.charAt(0).toUpperCase()}
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
                      <Typography variant="subtitle2" fontWeight="bold">
                        {msg.username}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Box>
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor:
                          msg.username === "System" ? "#e3f2fd" : "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ wordWrap: "break-word" }}
                      >
                        {msg.text}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Поле ввода сообщения */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="outlined"
              placeholder="Введите сообщение..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!username}
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !username}
              sx={{
                minWidth: 100,
                height: 56,
                borderRadius: 2,
                gap: 1,
              }}
              endIcon={<SendIcon />}
            >
              Отправить
            </Button>
          </Box>

          {/* Информация о количестве сообщений */}
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="textSecondary">
              Сообщений: {messages.length}
            </Typography>
            {!username && (
              <Alert severity="info" sx={{ py: 0 }}>
                Введите имя для отправки сообщений
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
