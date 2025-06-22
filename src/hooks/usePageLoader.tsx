"use client";

import { createContext, useContext, useState } from "react";
import { Loader2 } from "lucide-react";

const LoaderContext = createContext<{
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
} | null>(null);

export const usePageLoader = () => {
  const context = useContext(LoaderContext);
  if (!context)
    throw new Error("usePageLoader must be used inside LoaderProvider");
  return context;
};

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoading = (msg = "Loading...") => {
    setMessage(msg);
    setVisible(true);
  };

  const hideLoading = () => setVisible(false);

  return (
    <LoaderContext.Provider value={{ showLoading, hideLoading }}>
      {visible && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-purple-600/70 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
          <p className="text-white text-sm">{message}</p>
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
}
