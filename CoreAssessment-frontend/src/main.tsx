// import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { ProSidebarProvider } from "react-pro-sidebar";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css"
import App from "./App.tsx";
import theme from "./Config/theme.ts";
import { SnackbarProvider } from 'notistack';
import 'preline/preline';

ReactDOM.createRoot(document.getElementById("root")!).render(

    <ProSidebarProvider>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
        <App />
        </SnackbarProvider>
      </ThemeProvider>
      </Provider>
    </ProSidebarProvider>
 
);
