"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ThemeProvider } from "../app/theme/ThemeProvider";
import React from "react";
import { Toaster } from "sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "white",
              color: "black",
            },
            className: "dark:bg-gray-800 dark:text-white",
          }}
        />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
