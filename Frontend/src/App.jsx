import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider, useDispatch } from "react-redux";
import theme from "./theme";
import AppRoutes from "./routes";
import { store } from "./store";
import { setCredentials } from "./store/slices/authSlice";
import api from "./api/axios";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/check");
        const { user, token, role } = response.data;
        dispatch(setCredentials({ user, token, role }));
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
