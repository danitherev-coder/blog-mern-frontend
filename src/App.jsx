import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
// import Write from "./pages/CreatePost";
import Home from "./pages/Home";
// import Single from "./pages/GetPost";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePages from "./pages/ProfilePages";
import "./style.scss";
// import Error404 from "./components/Error404";
import { lazy, Suspense } from "react";
// import MyPosts from "./pages/MyPosts";
const MyPosts = lazy(() => import("./pages/MyPosts"));
// import Error404 from "./components/Error404";

const Error404 = lazy(() => import("./components/Error404"));
const Write = lazy(() => import("./pages/CreatePost"));
// const Register = lazy(() => import("./pages/Register"));
// const Login = lazy(() => import("./pages/Login"));
const Single = lazy(() => import("./pages/GetPost"));

const Layout = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <Outlet />
        <Footer />
      </Suspense>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/:id",
        element: <Single />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/editar-perfil/:id",
        element: <ProfilePages />,
      },
      {
        path: "/mis-blogs",
        element: <MyPosts />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*/",
    element: <Error404 />,
  },
  {
    path: "/*",
    element: <Error404 />,
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
