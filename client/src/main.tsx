import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./Context/AppContext.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { SocketContextProvider } from "./Context/SocketContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      enabled: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SocketContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
