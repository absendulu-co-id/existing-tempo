import React, { useEffect } from "react";

interface Props {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError: () => void;
}

function setWithExpiry(key, value, ttl) {
  const item = {
    value,
    expiry: new Date().getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemString = window.localStorage.getItem(key);
  if (!itemString) return null;

  const item = JSON.parse(itemString);
  const isExpired = new Date().getTime() > item.expiry;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export const ErrorFallback: React.FC<Props> = ({ error, resetError }) => {
  // Handle failed lazy loading of a JS/CSS chunk.
  useEffect(() => {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (error.message && chunkFailedMessage.test(error.message)) {
      if (!getWithExpiry("chunk_failed")) {
        setWithExpiry("chunk_failed", "true", 10000);
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div role="alert" style={{ backgroundColor: "white" }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetError}>Try again</button>
    </div>
  );
};
