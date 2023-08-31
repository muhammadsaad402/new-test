import { Navigate, Route, Routes } from 'react-router-dom';
import React, { useContext } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

//screens
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import Splash from './pages/Splash';
import DashboardApp from './pages/DashboardApp';
import Categories from './pages/Categories/Categories';
import AddCategory from './pages/Categories/AddCategory';
import UpdateCategory from './pages/Categories/UpdateCategory';
import ContentDetails from './pages/ContentDetails/ContentDetails';
import AddContentDetail from './pages/ContentDetails/AddContentDetail';
import UpdateContentDetail from './pages/ContentDetails/UpdateContentDetail';
import ContentData from './pages/ContentData/ContentData';
import AddContentData from './pages/ContentData/AddContentData';
import UpdateContentData from './pages/ContentData/UpdateContentData';
import AdBanners from './pages/AdBanner/AdBanners';
import AddAdBanner from './pages/AdBanner/AddAdBanner';
import UpdateAdBanner from './pages/AdBanner/UpdateAdBanner';
import FeaturedBanners from './pages/FeaturedBanner/FeaturedBanners';
import AddFeaturedBanner from './pages/FeaturedBanner/AddFeaturedBanner';
import UpdateFeaturedBanner from './pages/FeaturedBanner/UpdateFeaturedBanner';
import Packages from './pages/Packages/Packages';
import AddPackage from './pages/Packages/AddPackage';
import UpdatePackage from './pages/Packages/UpdatePackage';
import UsersData from './pages/Users/UserData';
import UpdateUserData from './pages/Users/UpdateUserData';
import AddUserData from './pages/Users/AddUserData';
import Notifcation from './pages/Notifications/Notifcation';
import AddNotification from './pages/Notifications/AddNotification';
import UpdateNotification from './pages/Notifications/UpdateNotification';
import UpdatedHome from './pages/UpdatedHome/updatedHome';
import NotifcationRecords from './pages/NotificationsRecords/NotifcationRecord';
import ContentTags from './pages/ContentTag/ContentTag';
import AddContentTag from './pages/ContentTag/AddContentTag';
import UpdateContentTags from './pages/ContentTag/UpdateContentTag';
// hoooks
import AlertPopup from './components/AlertPopup';

// GlobalContext
import { GlobalContext } from './context/Context';

// ----------------------------------------------------------------------

export default function Router() {
  const { state, dispatch } = useContext(GlobalContext);
  return (
    <>
      {state.user === undefined ? (
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Splash />
                <AlertPopup />
              </>
            }
          />
          {/* <Route
            path="*"
            element={<Navigate to="/" replace />}
          /> */}
        </Routes>
      ) : null}

      {state.user === null ? (
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Login />
                <AlertPopup />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : null}

      {state.user ? (
        <Routes>
          <Route
            path="/dashboard"
            element={
              <>
                <DashboardLayout />
                <AlertPopup />
              </>
            }
          >
            <Route path="app" element={<DashboardApp />} />
            <Route path="categories" element={<Categories />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="update-category/:id" element={<UpdateCategory />} />
            <Route path="content-details" element={<ContentDetails />} />
            <Route path="add-content-detail" element={<AddContentDetail />} />
            <Route path="update-content-detail/:id" element={<UpdateContentDetail />} />
            <Route path="content-data" element={<ContentData />} />
            <Route path="add-content-data" element={<AddContentData />} />
            <Route path="update-content-data/:id" element={<UpdateContentData />} />
            <Route path="featured-banners" element={<FeaturedBanners />} />
            <Route path="add-featured-banner" element={<AddFeaturedBanner />} />
            <Route path="update-featured-banner/:id" element={<UpdateFeaturedBanner />} />
            <Route path="ad-banners" element={<AdBanners />} />
            <Route path="add-ad-banner" element={<AddAdBanner />} />
            <Route path="update-ad-banner/:id" element={<UpdateAdBanner />} />
            <Route path="packages" element={<Packages />} />
            <Route path="add-package" element={<AddPackage />} />
            <Route path="update-package/:id" element={<UpdatePackage />} />
            <Route path="user" element={<User />} />
            <Route path="products" element={<Products />} />
            <Route path="blog" element={<Blog />} />
            <Route path="users" element={<UsersData />} />
            <Route path="update-user-data/:id" element={<UpdateUserData />} />
            <Route path="add-user-data" element={<AddUserData />} />
            <Route path="add-notification" element={<AddNotification />} />
            <Route path="get-notification" element={<Notifcation />} />
            <Route path="update-notification/:id" element={<UpdateNotification />} />
            <Route path="get-Send-All-Notification" element={<NotifcationRecords />} />
            <Route path="get-tags" element={<ContentTags />} />
            <Route path="add-tags" element={<AddContentTag />} />
            <Route path="update-tags/:id" element={<UpdateContentTags />} />
            <Route path="updated" element={<UpdatedHome />} />
          </Route>
          <Route exact path="/" element={<LogoOnlyLayout />}>
            <Route path="/" element={<Navigate to={'/dashboard/app'} />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="404" element={<NotFound />} />
          </Route>
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      ) : null}
    </>
  );
}

// export default function Router() {
//   const { state, dispatch } = useContext(GlobalContext);
//   useEffect(() => {
//     console.log("i run", state.user)
//     return () => {
//     }
//   }, [])

//   return useRoutes([
//     {
//       path: '/dashboard',
//       element: <DashboardLayout />,
//       children: [
//         { path: 'app', element: <DashboardApp /> },
//         { path: 'user', element: <User /> },
//         { path: 'products', element: <Products /> },
//         { path: 'blog', element: <Blog /> },
//       ],
//     },
//     {
//       path: '/',
//       element: <LogoOnlyLayout />,
//       children: [
//         { path: '/', element: state.user ? <Navigate to={"/dashboard/app"} /> : <Navigate to={"/login"} /> },
//         { path: 'login', element: <Login /> },
//         { path: 'splash', element: <Splash /> },
//         { path: 'register', element: <Register /> },
//         { path: '404', element: <NotFound /> },
//         { path: '*', element: <Navigate to="/404" /> },
//       ],
//     },
//     { path: '*', element: <Navigate to="/404" replace /> },
//   ]);
// }
