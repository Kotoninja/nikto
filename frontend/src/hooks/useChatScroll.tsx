import React, { useState, useEffect } from "react";

const INACTIVITY_MS = 5000;

export const useChatScroll = (
  messages: unknown[],
  loadingFetchMessages: boolean,
) => {
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
  const [progress, setProgress] = useState(100);

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

  // Начальный скролл вниз + разблокировка пагинации после него
  useEffect(() => {
    if (loadingFetchMessages) return;

    if (!isInitialScrollDone) {
      scrollToBottom(false);
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

  // Чистим таймеры при размонтировании
  useEffect(() => {
    return () => clearTimers();
  }, []);

  return {
    scrollContainerRef,
    isUserScrollingRef,
    isInitialScrollDone,
    showJumpButton,
    progress,
    handleScroll,
    handleJumpClick,
    clearTimers,
  };
};
