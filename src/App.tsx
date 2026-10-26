import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthLayout from "./Components/AuthLayout";
import NotFound from "./Components/NotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./Pages/Profile";
import ForgotPassword from "./Pages/ForgotPassword";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./context/AuthProvider";
import "./App.css";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
  {
    path: "/profile",
    element: <ProtectedRoute />,
    children: [{ index: true, element: <Profile /> }],
  },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
