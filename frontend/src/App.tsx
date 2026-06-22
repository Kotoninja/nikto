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

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

// Форматирование времени
const formatTime = (timestamp: string): string =>
  new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

// Цвет аватара на основе имени
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

const App: React.FC = () => {
  const [inputMessage, setInputMessage] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("Anonymous");

  const {
    messages,
    linkPagination,
    loadingFetchMessages,
    loadingSendMessage,
    loadingPagination,
    setLoadingSendMessage,
    fetchMessages,
    sendMessage,
    fetchNextPage,
  } = useChatMessages();

  const {
    scrollContainerRef,
    isUserScrollingRef,
    isInitialScrollDone,
    showJumpButton,
    progress,
    handleScroll,
    handleJumpClick,
    clearTimers,
  } = useChatScroll(messages, loadingFetchMessages);

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = (): void => {
    if (!inputMessage.trim()) return;

    setLoadingSendMessage(true);
    sendMessage(inputMessage.trim(), username)
      .then(() => {
        setInputMessage("");
        isUserScrollingRef.current = false;
        clearTimers();
      })
      .finally(() => {
        setLoadingSendMessage(false);
      });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ height: "100%"}}>
        <Paper
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            💬 Чат
          </Typography>

          {/* Имя пользователя */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Введите свой NIK"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Список сообщений */}
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

          {/* Кнопка прыжка вниз */}
          <JumpToBottomButton
            show={showJumpButton}
            progress={progress}
            onClick={handleJumpClick}
          />

          {/* Поле ввода */}
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
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !username}
              sx={{ minWidth: 100, height: 56, borderRadius: 2, gap: 1 }}
              loading={loadingSendMessage}
              endIcon={<SendIcon />}
            >
              Отправить
            </Button>
          </Box>

          {/* Счётчик сообщений */}
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
