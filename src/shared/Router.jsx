import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Category from '../pages/Category';
import CreateFeed from '../pages/CreateFeed';
import AboutUs from '../pages/AboutUs';
import MyProfile from '../pages/MyProfile';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import DeveloperPage from '../pages/DeveloperPage';
import NavigationLayout from './NavigationLayout';
import ProtectedRoute from './ProtectedRoute';
import MyFeed from '../components/MyFeed';

const router = createBrowserRouter([
  {
    element: <NavigationLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/category', element: <Category /> },
      { path: '/create-feed', element: <CreateFeed /> },
      { path: '/about-us', element: <AboutUs /> },
      { path: '/my-profile', element: <MyProfile /> },
      { path: '/my-feed', element: <MyFeed /> },
      { path: '/developer-page', element: <DeveloperPage /> },
    ],
  },
  { path: '/sign-in', element: <ProtectedRoute element={<SignIn />} /> },
  { path: '/sign-up', element: <ProtectedRoute element={<SignUp />} /> },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
