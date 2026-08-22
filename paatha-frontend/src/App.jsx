import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from 'react-helmet-async';
import {
  DirectionPage,
  HelpPage,
  HomePage,
  LogoPage,
  NavigationPage,
  ServicesPage,
  StepsPage,
  CreatorPage,
} from "./pages";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileLayout from "./components/MobileLayout";
import store from "./redux/store";
import { fetchMapData } from "./redux/mapSlice";

function App() {
  useEffect(() => {
    store.dispatch(fetchMapData(1));
  }, []);

  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <Routes>
            {/* Full Screen Pages */}
            <Route element={<LoginPage />} path="/login" />
            <Route 
              path="/creator" 
              element={
                <ProtectedRoute allowedRoles={["superadmin", "admin", "editor"]}>
                  <CreatorPage />
                </ProtectedRoute>
              } 
            />

            {/* Mobile-Constrained Pages */}
            <Route element={<MobileLayout />}>
              <Route element={<LogoPage />} path="/" />
              <Route element={<HomePage />} path="/home" />
              <Route element={<HelpPage />} path="/help" />
              <Route element={<ServicesPage />} path="/services" />
              <Route element={<DirectionPage />} path="/directions" />
              <Route element={<StepsPage />} path="/steps" />
              <Route element={<NavigationPage />} path="/navigate" />
            </Route>
          </Routes>
        </Router>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
