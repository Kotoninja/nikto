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
          {linkPagination && (
            <Box
              ref={ref}
              sx={{ height: 1, display: "flex", justifyContent: "center" }}
            >
              {loadingPagination && <CircularProgress size={20} />}
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
