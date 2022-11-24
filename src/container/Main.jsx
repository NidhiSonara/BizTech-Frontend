import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Loader from "./Loader";

// Pages
const Home = lazy(() => import('../components/Home'))
const AddEditEmployee = lazy(() => import('../components/AddEditEmployee'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/add",
    element: <AddEditEmployee />,
  }
]);



const Main = () => {
 
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
      <ToastContainer/>
    </Suspense>
  );
};

export default Main;