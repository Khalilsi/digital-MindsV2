import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import AdminPage from "./pages/adminMainPage";
import UserDetail from "./pages/UserDetail";
import UsersPage from "./pages/UsersPage";
import QuizEditor from "./pages/QuizEditor";
import ProblemForm from "./pages/ProblemForm";
import UserHome from "./pages/UserHome";
import UserQuizTake from "./pages/UserQuizTake";
import UserProblemTake from "./pages/UserProblemTake";
import { clearAuth, getAuth, isTokenExpired } from "./utils/auth";

function RequireAuth({ role, children }) {
  const location = useLocation();
  const auth = getAuth();

  if (!auth || isTokenExpired(auth)) {
    clearAuth();
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (role && auth.type !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/" || location.pathname.startsWith("/user"); // login + user routes

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div style={hideNavbar ? undefined : { paddingTop: "4rem" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin/quizzes"
            element={
              <RequireAuth role="admin">
                <AdminPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/quizzes/:id/edit"
            element={
              <RequireAuth role="admin">
                <QuizEditor />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/quizzes/problem/edit"
            element={
              <RequireAuth role="admin">
                <ProblemForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/problems/new"
            element={
              <RequireAuth role="admin">
                <ProblemForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/problems/:id/edit"
            element={
              <RequireAuth role="admin">
                <ProblemForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <RequireAuth role="admin">
                <UserDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAuth role="admin">
                <UsersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/user/home"
            element={
              <RequireAuth role="user">
                <UserHome />
              </RequireAuth>
            }
          />
          <Route
            path="/user/quizzes/:id"
            element={
              <RequireAuth role="user">
                <UserQuizTake />
              </RequireAuth>
            }
          />
          <Route
            path="/user/problems/:id"
            element={
              <RequireAuth role="user">
                <UserProblemTake />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
