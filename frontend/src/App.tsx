import React, { useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useChatMessages } from "./hooks/useChatMessages";
import { useChatScroll } from "./hooks/useChatScroll";
import { ChatMessages } from "./components/ChatMessages";
import { JumpToBottomButton } from "./components/JumpToBottomButton";

import { useWebSocket } from "./hooks/useWebSockets";

import ASCIIText from "../@/components/ASCIIText";

const theme = createTheme({
  palette: {
    primary: { main: "#000000" },
    secondary: { main: "#717171" },
  },
});

// Форматирование времени
const formatTime = (timestamp: string): string =>
  new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

// Цвет аватара на основе имени
const getAvatarColor = (name: string): string => {
  const colors = [
    "#f5f5f5",
    "#d9d9d9",
    "#bfbfbf",
    "#8c8c8c",
    "#595959",
    "#404040",
    "#262626",
    "#0d0d0d",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const App: React.FC = () => {
  const [inputMessage, setInputMessage] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("Anonymous");

  const {
    messages,
    linkPagination,
    loadingFetchMessages,
    loadingPagination,
    setMessages,
    fetchMessages,
    fetchNextPage,
  } = useChatMessages();

  const {
    scrollContainerRef,
    isInitialScrollDone,
    justSentRef,
    showJumpButton,
    progress,
    handleScroll,
    handleJumpClick,
  } = useChatScroll(messages, loadingFetchMessages);

  useEffect(() => {
    fetchMessages();
  }, []);

  const { sendMessage } = useWebSocket(setMessages);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage.trim(), username);
    justSentRef.current = true;
    setInputMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ height: "100vh", py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            p: 3,
            borderRadius: 4,

            // Эффект премиального светлого стекла (Light Cyber-Glass)
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",

            // Мягкая светлая пиксельная текстура для заднего фона
            backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px)
          `,
            backgroundSize: "6px 6px",
          }}
        >
          {/* Хедер с ником и ASCII-анимацией */}
          {username}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "300px",
              overflow: "hidden",
              position: "relative",
              borderRadius: 3,
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, transparent 100%)",
              mb: 2,
            }}
          >
          </Box> */}

          {/* Ввод NIK-нейма */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Введите свой NIK"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  color: "#1e293b",
                  "& fieldset": { borderColor: "rgba(0, 0, 0, 0.15)" },
                  "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
                "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.6)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
              }}
            />
          </Box>

          <Divider sx={{ my: 1, borderColor: "rgba(0, 0, 0, 0.08)" }} />

          {/* СВЕТЛАЯ ОБЛАСТЬ ЧАТА С ЭФФЕКТОМ РАЗМЫТИЯ БЕЗ ПИКСЕЛЕЙ */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              my: 1,
              p: 2,
              borderRadius: 3,
              // Матовое стекло без пиксельной сетки
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.02)",
            }}
          >
            <ChatMessages
              messages={messages}
              loadingFetchMessages={loadingFetchMessages}
              loadingPagination={loadingPagination}
              linkPagination={linkPagination}
              isInitialScrollDone={isInitialScrollDone}
              scrollContainerRef={scrollContainerRef}
              onScroll={handleScroll}
              onFetchNextPage={() => fetchNextPage(scrollContainerRef.current)}
              formatTime={formatTime}
              getAvatarColor={getAvatarColor}
            />
          </Box>

          {/* Кнопка прыжка вниз */}
          <JumpToBottomButton
            show={showJumpButton}
            progress={progress}
            onClick={handleJumpClick}
          />

          {/* Поле ввода сообщения */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", mt: 1 }}>
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
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  color: "#1e293b",
                  padding: "14px",
                  "& fieldset": { borderColor: "rgba(0, 0, 0, 0.12)" },
                  "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.25)" },
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !username}
              sx={{
                minWidth: 120,
                height: 54,
                borderRadius: 3,
                gap: 1,
                backgroundColor: "#1976d2",
                color: "#fff",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#115293",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(0, 0, 0, 0.06)",
                  color: "rgba(0, 0, 0, 0.26)",
                },
              }}
              endIcon={<SendIcon />}
            >
              Отправить
            </Button>
          </Box>

          {/* Счётчик и системные алерты */}
          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "24px",
            }}
          >
            <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
              Сообщений: {messages.length}
            </Typography>
            {!username && (
              <Alert
                severity="info"
                icon={false}
                sx={{
                  py: 0,
                  px: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: "rgba(2, 136, 209, 0.08)",
                  color: "#0288d1",
                  border: "1px solid rgba(2, 136, 209, 0.15)",
                  fontSize: "0.75rem",
                }}
              >
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
