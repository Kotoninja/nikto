import { useState } from "react";
import api from "../../api";
import { type MessageInterface } from "../types/chat";

export const useChatMessages = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [linkPagination, setLinkPagination] = useState<string>("");
  const [loadingFetchMessages, setLoadingFetchMessages] =
    useState<boolean>(true);
  const [loadingPagination, setLoadingPagination] = useState<boolean>(false);

  const fetchMessages = () => {
    return api
      .get("all")
      .then((response) => {
        setMessages(response?.data?.results);
        setLinkPagination(response?.data?.next);
      })
      .catch(console.error)
      .finally(() => {
        setLoadingFetchMessages(false);
      });
  };

  const fetchNextPage = (
    scrollEl: HTMLDivElement | null,
    onBeforeFetch?: (prevScrollHeight: number) => void,
  ) => {
    if (!linkPagination || loadingPagination) return;

    const prevScrollHeight = scrollEl?.scrollHeight ?? 0;
    onBeforeFetch?.(prevScrollHeight);

    setLoadingPagination(true);
    api
      .get(linkPagination)
      .then((response) => {
        setMessages((prev) => [...(response?.data?.results ?? []), ...prev]);
        setLinkPagination(response?.data?.next);
        requestAnimationFrame(() => {
          if (scrollEl) {
            scrollEl.scrollTop += scrollEl.scrollHeight - prevScrollHeight;
          }
        });
      })
      .catch(console.error)
      .finally(() => {
        setLoadingPagination(false);
      });
  };

  return {
    messages,
    linkPagination,
    loadingFetchMessages,
    loadingPagination,
    fetchMessages,
    fetchNextPage,
    setMessages,
  };
};
