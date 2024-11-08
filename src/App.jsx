import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import AdminLayout from "./admin/AdminLayout";

import "./App.css";

import About from "./pages/About";
import Quicklinks from "./pages/Quicklinks";
import Workplace from "./pages/Workplace";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPanel from "./admin/AdminPanel";
import UploadBanners from "./admin/UploadBanners";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "workplace",
        element: <Workplace />,
      },
      {
        path: "quicklinks",
        element: <Quicklinks />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin",
        element: <AdminPanel />,
      },
      {
        path: "upload-banners",
        element: <UploadBanners />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
