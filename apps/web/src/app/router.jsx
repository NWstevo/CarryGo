import { createBrowserRouter, Navigate } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import AppLayout from "../components/layout/AppLayout";

import HomePage from "../features/home/HomePage";
import LoginPage from "../features/auth/LoginPage";
import SignupPage from "../features/auth/SignupPage";
import DashboardPage from "../features/dashboard/DashboardPage";

import TripFeedPage from "../features/trips/TripFeedPage";
import TripDetailPage from "../features/trips/TripDetailPage";
import CreateTripPage from "../features/trips/CreateTripPage";

import RequestFeedPage from "../features/requests/RequestFeedPage";
import RequestDetailPage from "../features/requests/RequestDetailPage";
import CreateRequestPage from "../features/requests/CreateRequestPage";

import ConnectionsPage from "../features/connections/ConnectionsPage";
import ChatPage from "../features/chat/ChatPage";
import DealsPage from "../features/deals/DealsPage";
import RatingsPage from "../features/ratings/RatingsPage";
import AdminDashboardPage from "../features/admin/AdminDashboardPage";
import UserModerationPage from "../features/admin/UserModerationPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/trips",
        element: <TripFeedPage />,
      },
      {
        path: "/trips/new",
        element: <CreateTripPage />,
      },
      {
        path: "/trips/:tripId",
        element: <TripDetailPage />,
      },
      {
        path: "/requests",
        element: <RequestFeedPage />,
      },
      {
        path: "/requests/new",
        element: <CreateRequestPage />,
      },
      {
        path: "/requests/:requestId",
        element: <RequestDetailPage />,
      },
      {
        path: "/connections",
        element: <ConnectionsPage />,
      },
      {
        path: "/chats",
        element: <ChatPage />,
      },
      {
        path: "/chats/:connectionId",
        element: <ChatPage />,
      },
      {
        path: "/deals",
        element: <DealsPage />,
      },
      {
        path: "/ratings",
        element: <RatingsPage />,
      },
      {
        path: "/admin",
        element: <AdminDashboardPage />,
      },
      {
        path: "/admin/users",
        element: <UserModerationPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
