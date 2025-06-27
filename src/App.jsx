import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import SearchList from './pages/SearchList';
import BlogView from './pages/BlogView';
import CreateBlog from './pages/CreateBlog';
import UpdateBlog from './pages/UpdateBlog';
import YourBlog from './pages/YourBlog';
import Comments from './pages/Comments';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';


// ✅ Common layout with Navbar & Footer
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// ✅ Dashboard layout without Navbar/Footer if needed
const DashboardLayout = () => (
  <>
    <Navbar />
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  </>
);

// ✅ Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blogs", element: <Blog /> },
      { path: "about", element: <About /> },
      { path: "search", element: <SearchList /> },
      {
        path: "blogs/:blogId",
        element: (
          <ProtectedRoute>
            <BlogView />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: (
      <>
        <Navbar />
        <Signup />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: "/write-blog",
    element: (
      <>
        <Navbar />
        <CreateBlog />
      </>
    ),
  },
  {
    path: "/profile",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "write-blog", element: <CreateBlog /> },
      { path: "write-blog/:blogId", element: <UpdateBlog /> },
      { path: "your-blog", element: <YourBlog /> },
      { path: "comments", element: <Comments /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
