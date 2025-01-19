"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ThemeProvider } from "../app/theme/ThemeProvider";
import React from "react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </Provider>
  );
}
