import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GamePage from "./pages/GamePage";
import LearningPage from "./pages/LearningPage";
import Layout from "./layouts/mainLayout";

// Layout component

// Register action handler
async function registerAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = {
    fullname: formData.get("fullname"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "Đăng ký thất bại" };
    }

    // Redirect to login page on success
    window.location.href = "/login";
    return { success: true };
  } catch (error) {
    return { error: "Lỗi kết nối đến server" };
  }
}

// Login action handler
async function loginAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.message || "Đăng nhập thất bại" };
    }

    // Store token and redirect
    localStorage.setItem("token", result.token);
    window.location.href = "/game";
    return { success: true };
  } catch (error) {
    return { error: "Lỗi kết nối đến server" };
  }
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: "/register",
        element: <RegisterPage />,
        action: registerAction,
      },
      {
        path: "/game",
        element: <GamePage />,
      },
      {
        path: "/learn",
        element: <LearningPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
