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

    // Store token and user data
    localStorage.setItem("token", result.token);
    if (result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
    } else if (result.fullname || result.name) {
      // Fallback: create user object from response
      localStorage.setItem("user", JSON.stringify({
        fullname: result.fullname || result.name,
        email: data.email,
      }));
    } else {
      // If no user data, create from email
      const emailName = data.email.toString().split("@")[0];
      localStorage.setItem("user", JSON.stringify({
        fullname: emailName.charAt(0).toUpperCase() + emailName.slice(1),
        email: data.email,
      }));
    }
    window.location.href = "/";
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
