import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import api from "../api";
import { type MessageInterface } from "./types/chat";
import { MessageField } from "./components/MessageField";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CircularProgress, Box as MuiBox, Fade } from "@mui/material";
import { useIntersectionObserver } from "@siberiacancode/reactuse";

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

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("Anonymous");
  const [linkPagination, setLinkPagination] = useState<string>("");

  // Loading
  const [loadingFetchMessages, setLoadingFetchMessages] =
    useState<boolean>(true);
  const [loadingSendMessage, setLoadingSendMessage] = useState<boolean>(false);
  const [loadingPagination, setLoadingPagination] = useState<boolean>(false);

  // Обработчик отправки сообщения
  const handleSendMessage = (): void => {
    if (inputMessage.trim()) {
      setLoadingSendMessage(true);
      api
        .post("create", { username: username, text: inputMessage.trim() })
        .then(function (response) {
          const messageDetail = response?.data;
          const newMessage: MessageInterface = {
            id: messageDetail.id,
            text: messageDetail.text,
            timestamp: messageDetail.timestamp,
            username: username || "Anonymous",
          };
          setMessages([...messages, newMessage]);
          setInputMessage("");

          isUserScrollingRef.current = false;
          setShowJumpButton(false);
          clearTimers();
        })
        .catch(console.error)
        .finally(() => {
          setLoadingSendMessage(false);
        });
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
  const formatTime = (timestamp: string): string => {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
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

  const messagesList = messages?.map((message) => (
    <MessageField
      key={message.id}
      id={message.id}
      text={message.text}
      timestamp={message.timestamp}
      username={message.username}
      getAvatarColor={getAvatarColor}
      formatTime={formatTime}
    />
  ));

  const fetchMessages = () => {
    return api
      .get("all")
      .then(function (response) {
        setMessages(response?.data?.results);
        setLinkPagination(response?.data?.next);
      })
      .catch(console.error)
      .finally(() => {
        setLoadingFetchMessages(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Down button
  const INACTIVITY_MS = 5000;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isUserScrollingRef = React.useRef(false);
  const inactivityTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const progressIntervalRef = React.useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);

  const [showJumpButton, setShowJumpButton] = useState(false);
  const [progress, setProgress] = useState(100); // % до автоскролла

  const scrollToBottom = (smooth = true) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  const isNearBottom = (): boolean => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 50;
  };

  const clearTimers = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const startInactivityCountdown = () => {
    clearTimers();
    setProgress(100);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / INACTIVITY_MS) * 100);
      setProgress(remaining);
    }, 100);

    inactivityTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      isUserScrollingRef.current = false;
      setShowJumpButton(false);
      scrollToBottom(true);
    }, INACTIVITY_MS);
  };

  const handleScroll = () => {
    if (isNearBottom()) {
      isUserScrollingRef.current = false;
      setShowJumpButton(false);
      clearTimers();
      return;
    }

    isUserScrollingRef.current = true;
    setShowJumpButton(true);
    startInactivityCountdown();
  };

  const handleJumpClick = () => {
    isUserScrollingRef.current = false;
    setShowJumpButton(false);
    clearTimers();
    scrollToBottom(true);
  };

  // Начальный скролл вниз после первой загрузки сообщений.
  // Пагинация разблокируется только ПОСЛЕ того, как скролл реально применён.
  useEffect(() => {
    if (loadingFetchMessages) return;

    if (!isInitialScrollDone) {
      scrollToBottom(false); // мгновенно, без анимации, при первом заходе
      // ждём два кадра, чтобы браузер точно успел применить scrollTop
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsInitialScrollDone(true);
        });
      });
      return;
    }

    if (!isUserScrollingRef.current) {
      scrollToBottom(true);
    }
  }, [messages, loadingFetchMessages, isInitialScrollDone]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Pagination trigger
  const fetchNextPage = () => {
    if (!linkPagination || loadingPagination) return;
    const el = scrollContainerRef.current;
    const prevScrollHeight = el?.scrollHeight ?? 0;

    setLoadingPagination(true);
    api
      .get(linkPagination)
      .then(function (response) {
        setMessages((prev) => [...(response?.data?.results ?? []), ...prev]);
        setLinkPagination(response?.data?.next);
        requestAnimationFrame(() => {
          if (el) {
            const newScrollHeight = el.scrollHeight;
            el.scrollTop += newScrollHeight - prevScrollHeight;
          }
        });
      })
      .catch(console.error)
      .finally(() => {
        setLoadingPagination(false);
      });
  };

  const { ref } = useIntersectionObserver<HTMLDivElement>({
    threshold: 1,
    onChange: (entry) => {
      if (
        entry[0].isIntersecting &&
        !loadingFetchMessages &&
        isInitialScrollDone
      ) {
        fetchNextPage();
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ height: "100vh", py: 3 }}>
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
            ref={scrollContainerRef}
            onScroll={!loadingFetchMessages ? handleScroll : undefined}
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              minHeight: 200,
              maxHeight: "calc(100vh - 350px)",
              display: loadingFetchMessages ? "flex" : "block",
              alignItems: loadingFetchMessages ? "center" : undefined,
              justifyContent: loadingFetchMessages ? "center" : undefined,
            }}
          >
            {loadingFetchMessages ? (
              <CircularProgress aria-label="Loading…" />
            ) : (
              <Stack spacing={2}>
                {linkPagination && <div ref={ref} style={{ height: 1 }} />}
                {messagesList}
              </Stack>
            )}
          </Box>

          {/* Down button */}
          <Fade in={showJumpButton}>
            <Box
              onClick={handleJumpClick}
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
              <MuiBox
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
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
              </MuiBox>
              Новые сообщения
            </Box>
          </Fade>

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
              loading={loadingSendMessage}
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