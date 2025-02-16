import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Category from '../pages/Category';
import CreateFeed from '../pages/CreateFeed';
import AboutUs from '../pages/AboutUs';
import MyProfile from '../pages/MyProfile';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import NavigationLayout from './NavigationLayout';
import LoginRouter from '../components/LoginRouter';

const router = createBrowserRouter([
  {
    element: <NavigationLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/category', element: <Category /> },
      { path: '/create-feed', element: <CreateFeed /> },
      { path: '/about-us', element: <AboutUs /> },
      { path: '/my-profile', element: <MyProfile /> },
    ],
  },
  { path: '/sign-in', element: <LoginRouter element={<SignIn />} /> },
  { path: '/sign-up', element: <LoginRouter element={<SignUp />} /> },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
