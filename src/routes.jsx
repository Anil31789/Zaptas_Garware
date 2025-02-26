import { lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";
import AdminLayout from "./admin/AdminLayout";
import ErrorPage from "./pages/ErrorPage";
import PhotosVideos from "./admin/photosVideo";
import ITServiceRequestForm from "./components/UI/ITServiceRequestForm";
import GalleryDetails from "./components/UI/GalleryDetails";
import CalenderHoliday from "./admin/calenderHoliday";
import ViewAllPopup from "./components/UI/ViewAllPopup";
import CalendarViewAll from "./components/UI/CalendarViewAll";
import ServiceTypePage from "./admin/ItReqedit";
import ServiceRequestPage from "./pages/serviceRequest";
import UserProfile from "./components/UI/Profile";
import ITSecurityForm from "./components/UI/ITSecurityForm";
import ExcelUploader from "./admin/telephone";

// import PhotoGallery from "./components/UI/PhotoGallery";

const CsrPage = lazy(() => import("./admin/csr"));
const IndustryPage = lazy(() => import("./admin/Industry"));
const ManagementMessage = lazy(() => import("./admin/managemenetMessage"));
const AwardsPage = lazy(() => import("./admin/awards"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Quicklinks = lazy(() => import("./admin/QuickLinks"));
const Workplace = lazy(() => import("./pages/Workplace"));
const Login = lazy(() => import("./pages/Login"));
const AdminPanel = lazy(() => import("./admin/AdminPanel"));
const UploadBanners = lazy(() => import("./admin/UploadBanners"));
const Announcements = lazy(() => import("./admin/Announcements"));
const ViewAllPosts = lazy(() => import("./components/UI/ViewAllPosts"));
const PhotoGallery = lazy(() => import("./components/UI/PhotoGallery"));

export const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> }, // Default route for "/"
      { path: "about", element: <About /> },
      { path: "workplace", element: <Workplace /> },
      { path: "quicklinks", element: <Quicklinks /> },
      { path: "view-all", element: <ViewAllPosts /> },
      { path: "view-detail", element: <ViewAllPopup /> },
      { path: "ITService", element: <ITServiceRequestForm /> },
      { path: "/gallery/:id", element: <GalleryDetails /> },
      { path: "/calendar-view-all", element: <CalendarViewAll /> },
      { path: "/service", element: <ServiceRequestPage /> },
      { path: "/profile", element: <UserProfile /> },
      { path: "/photos", element: <PhotoGallery /> },
      { path: "/securityform", element: <ITSecurityForm /> },
    ],
  },
  {
    path: "/admin",
    element: (
      // <AdminLayout />
      <ProtectedRoute haveAdminAccess={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminPanel /> }, // Default route for "/admin"
      { path: "upload-banners", element: <UploadBanners /> },
      { path: "announcements", element: <Announcements /> },
      { path: "photosVideo", element: <PhotosVideos /> },
      { path: "qlink", element: <Quicklinks /> },
      { path: "csr", element: <CsrPage /> },
      { path: "industry", element: <IndustryPage /> },
      { path: "ManagementMessage", element: <ManagementMessage /> },
      { path: "awards", element: <AwardsPage /> },
      { path: "CalenderHoliday", element: <CalenderHoliday /> },
      { path: "it", element: <ServiceTypePage /> },
      { path: "telephone", element: <ExcelUploader /> },
      
    ],
  },
  { path: "/login", element: <Login /> },
];
