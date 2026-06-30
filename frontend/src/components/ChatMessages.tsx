import React from "react";
import { Box, Stack, CircularProgress } from "@mui/material";
import { useIntersectionObserver } from "@siberiacancode/reactuse";
import { type MessageInterface } from "../types/chat";
import { MessageField } from "./MessageField";

interface ChatMessagesProps {
  messages: MessageInterface[];
  loadingFetchMessages: boolean;
  loadingPagination: boolean;
  linkPagination: string;
  isInitialScrollDone: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  onFetchNextPage: () => void;
  formatTime: (timestamp: string) => string;
  getAvatarColor: (name: string) => string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loadingFetchMessages,
  loadingPagination,
  linkPagination,
  isInitialScrollDone,
  scrollContainerRef,
  onScroll,
  onFetchNextPage,
  formatTime,
  getAvatarColor,
}) => {
  const { ref } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    onChange: (entry) => {
      if (
        entry[0].isIntersecting &&
        !loadingFetchMessages &&
        isInitialScrollDone
      ) {
        onFetchNextPage();
      }
    },
  });

  return (
    <Box
      ref={scrollContainerRef}
      onScroll={!loadingFetchMessages ? onScroll : undefined}
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 1, // Небольшой внутренний отступ для контента
        bgcolor: "transparent", // Убрали белый/серый цвет, теперь тут идеальная темнота
        height: "100%",
        display: loadingFetchMessages ? "flex" : "block",
        alignItems: loadingFetchMessages ? "center" : undefined,
        justifyContent: loadingFetchMessages ? "center" : undefined,

        // Кастомный красивый скроллбар (Cyber-scroll)
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          "&:hover": {
            background: "rgba(57, 255, 19, 0.3)", // Легкая неоновая подсветка при наведении на скролл
          },
        },
      }}
    >
      {loadingFetchMessages ? (
        <CircularProgress sx={{ color: "#39FF14" }} aria-label="Loading…" />
      ) : (
        <Stack spacing={2}>
          {linkPagination && (
            <Box
              ref={ref}
              sx={{
                height: 1,
                display: "flex",
                justifyContent: "center",
                py: 1,
              }}
            >
              {loadingPagination && (
                <CircularProgress size={20} sx={{ color: "#39FF14" }} />
              )}
            </Box>
          )}
          {messages.map((message) => (
            <MessageField
              key={message.id}
              id={message.id}
              text={message.text}
              timestamp={message.timestamp}
              username={message.username}
              getAvatarColor={getAvatarColor}
              formatTime={formatTime}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};
