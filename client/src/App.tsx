import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layouts/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAppContext } from "./Context/AppContext";
import Profile from "./pages/Profile";
import SuggestedUser from "./pages/SuggestedUser";

function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Routes>
      {!isLoggedIn && (
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
      )}
      {isLoggedIn && <Route path="/register" element={<Navigate to="/" />} />}
      {!isLoggedIn && (
        <Route
          path="/sign-in"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
      )}
      {isLoggedIn && <Route path="/sign-in" element={<Navigate to="/" />} />}
      {!isLoggedIn && <Route path="/" element={<Navigate to="/sign-in" />} />}
      {isLoggedIn && (
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
      )}

      {!isLoggedIn && (
        <Route path="/profile" element={<Navigate to="/login" />} />
      )}
      {isLoggedIn && (
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
      )}
      {isLoggedIn && (
        <Route
          path="/suggested-user"
          element={
            <Layout>
              <SuggestedUser />
            </Layout>
          }
        />
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
export default App;
