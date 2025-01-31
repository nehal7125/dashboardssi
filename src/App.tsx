import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import CustomerProfilePage from './pages/CustomerManagement/CustomerProfile';
import InspectorProfilePage from './pages/InspectorManagement/InspectorProfile';
import ReportingAnalyticsPage from './pages/ReportingAnalytics';
import Counter from './components/Counter/Counter';
import { useAppSelector, useAppDispatch } from './hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './pages/NotFound';
import { signInSuccess, signOut } from './features/auth/authSlice';
import CompanyDetailsPage from './pages/CompanyDetails/CompanyDetails';
import EquipmentTypesPage from './pages/InventoryManagement/EquipmentTypes';
import PartTypesPage from './pages/InventoryManagement/PartTypes';
import InventoryPage from './pages/InventoryManagement/Inventory';
import SEIDashboard from './pages/Dashboard/SEIDashboard';
import ResetPassword from './pages/Authentication/ResetPassword';
import ResetPasswordMessage from './components/ResetPasswordLogout';
import NewAccountCreation from './pages/NewAccountCreation';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
// useEffect
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    if (token) {
      dispatch(signInSuccess({ authToken: token,  role: role }));
    } else {
      dispatch(signOut());
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/newAccountCreation" element={<NewAccountCreation />} />
        {/* Auth Routes */}
        {!isAuthenticated ? (
          <>
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/auth/signin" />} />
          </>
        ) : (
          <>
            <Route
              path="/auth/signin"
              element={<Navigate to="/dashboard" />}
              />
            <Route
              path="/auth/signup"
              element={<Navigate to="/dashboard" />}
              />
          </>
        )}

        {/* Reset Password Route */}
        {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}

        {/* Redirect Root to Dashboard if Authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth/signin" />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <DefaultLayout>
                <Outlet /> {/* Renders child routes */}
              </DefaultLayout>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        >
          <Route path="reset-password" element={<ResetPasswordMessage />} />
          <Route
            path='dashboard'
            element={
              <>
                <PageTitle title="SSI Dashboard | Safe Sphere Innovations App" />
                <SEIDashboard />
              </>
            }
          />
          <Route
            path="counter"
            element={
              <>
                <PageTitle title="Counter | Safe Sphere Innovations App" />
                <Counter />
              </>
            }
          />
          <Route
            path="company-management/company-details"
            element={
              <>
                <PageTitle title="Company Details | Safe Sphere Innovations App" />
                <CompanyDetailsPage/>
              </>
            }
          />
          <Route
            path="customer-management/customer-profiles"
            element={
              <>
                <PageTitle title="Customer Profiles | Safe Sphere Innovations App" />
                <CustomerProfilePage />
              </>
            }
          />
          <Route
            path="inventory-management/equipment-types"
            element={
              <>
                <PageTitle title="Equipment Types | Safe Sphere Innovations App" />
                <EquipmentTypesPage />
              </>
            }
          />
          <Route
            path="inventory-management/part-types"
            element={
              <>
                <PageTitle title="Part Types | Safe Sphere Innovations App" />
                <PartTypesPage />
              </>
            }
          />
          <Route
            path="inventory-management/inventory"
            element={
              <>
                <PageTitle title="Inventory | Safe Sphere Innovations App" />
                <InventoryPage />
              </>
            }
          />
          <Route
            path="inspector-management/inspector-profiles"
            element={
              <>
                <PageTitle title="Inspector Profiles | Safe Sphere Innovations App" />
                <InspectorProfilePage />
              </>
            }
          />
          <Route
            path="reporting-analytics"
            element={
              <>
                <PageTitle title="Reporting and Analytics | Safe Sphere Innovations App" />
                <ReportingAnalyticsPage />
              </>
            }
          />
          <Route
            path="calendar"
            element={
              <>
                <PageTitle title="Calendar | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <Calendar />
              </>
            }
          />
          <Route
            path="profile"
            element={
              <>
                <PageTitle title="Profile | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            }
          />
          <Route
            path="forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <FormElements />
              </>
            }
          />
          <Route
            path="forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="tables"
            element={
              <>
                <PageTitle title="Tables | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <Tables />
              </>
            }
          />
          <Route
            path="settings"
            element={
              <>
                <PageTitle title="Settings | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>
            }
          />
          <Route
            path="chart"
            element={
              <>
                <PageTitle title="Basic Chart | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <Chart />
              </>
            }
          />
          <Route
            path="ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | SSI Admin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
// import { ReactElement, useEffect, useState } from 'react';
// import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';

// import Loader from './common/Loader';
// import PageTitle from './components/PageTitle';
// import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';
// import Calendar from './pages/Calendar';
// import Chart from './pages/Chart';
// import FormElements from './pages/Form/FormElements';
// import FormLayout from './pages/Form/FormLayout';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
// import Tables from './pages/Tables';
// import Alerts from './pages/UiElements/Alerts';
// import Buttons from './pages/UiElements/Buttons';
// import DefaultLayout from './layout/DefaultLayout';
// import CustomerProfilePage from './pages/CustomerManagement/CustomerProfile';
// import InspectorProfilePage from './pages/InspectorManagement/InspectorProfile';
// import ReportingAnalyticsPage from './pages/ReportingAnalytics';
// import Counter from './components/Counter/Counter';
// import { useAppSelector, useAppDispatch } from './hooks';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import NotFound from './pages/NotFound';
// import { signInSuccess, signOut } from './features/auth/authSlice';
// import CompanyDetailsPage from './pages/CompanyDetails/CompanyDetails';
// import EquipmentTypesPage from './pages/InventoryManagement/EquipmentTypes';
// import PartTypesPage from './pages/InventoryManagement/PartTypes';
// import InventoryPage from './pages/InventoryManagement/Inventory';
// import SEIDashboard from './pages/Dashboard/SEIDashboard';
// import ResetPassword from './pages/Authentication/ResetPassword';
// import ResetPasswordMessage from './components/ResetPasswordLogout';
// import NewAccountCreation from './pages/NewAccountCreation';
// import routes from './routes/routeConfig';
// import ProtectedRoute from './routes/ProtectedRoutes';

// // function App() {
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const { pathname } = useLocation();
// //   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
// //   const dispatch = useAppDispatch();
// // // useEffect
// //   useEffect(() => {
// //     const token = localStorage.getItem('authToken');
// //     if (token) {
// //       dispatch(signInSuccess({ authToken: token }));
// //     } else {
// //       dispatch(signOut());
// //     }
// //     setLoading(false);
// //   }, [dispatch]);

// //   useEffect(() => {
// //     window.scrollTo(0, 0);
// //   }, [pathname]);

// //   if (loading) {
// //     return <Loader />;
// //   }

// //   return (
// //     <>
// //       <ToastContainer />
// //       <Routes>
// //         <Route path="/newAccountCreation" element={<NewAccountCreation />} />
// //         {/* Auth Routes */}
// //         {!isAuthenticated ? (
// //           <>
// //             <Route path="/auth/signin" element={<SignIn />} />
// //             <Route path="/auth/signup" element={<SignUp />} />
// //             <Route path="/reset-password" element={<ResetPassword />} />
// //             <Route path="*" element={<Navigate to="/auth/signin" />} />
// //           </>
// //         ) : (
// //           <>
// //             <Route
// //               path="/auth/signin"
// //               element={<Navigate to="/dashboard" />}
// //               />
// //             <Route
// //               path="/auth/signup"
// //               element={<Navigate to="/dashboard" />}
// //               />
// //           </>
// //         )}

// //         {/* Reset Password Route */}
// //         {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}

// //         {/* Redirect Root to Dashboard if Authenticated */}
// //         <Route
// //           path="/"
// //           element={
// //             isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth/signin" />
// //           }
// //         />

// //         {/* Protected Routes */}
// //         <Route
// //           path="/*"
// //           element={
// //             isAuthenticated ? (
// //               <DefaultLayout>
// //                 <Outlet /> {/* Renders child routes */}
// //               </DefaultLayout>
// //             ) : (
// //               <Navigate to="/auth/signin" />
// //             )
// //           }
// //         >
// //           <Route path="reset-password" element={<ResetPasswordMessage />} />
// //           <Route
// //             path='dashboard'
// //             element={
// //               <>
// //                 <PageTitle title="SSI Dashboard | Safe Sphere Innovations App" />
// //                 <SEIDashboard />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="counter"
// //             element={
// //               <>
// //                 <PageTitle title="Counter | Safe Sphere Innovations App" />
// //                 <Counter />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="company-management/company-details"
// //             element={
// //               <>
// //                 <PageTitle title="Company Details | Safe Sphere Innovations App" />
// //                 <CompanyDetailsPage/>
// //               </>
// //             }
// //           />
// //           <Route
// //             path="customer-management/customer-profiles"
// //             element={
// //               <>
// //                 <PageTitle title="Customer Profiles | Safe Sphere Innovations App" />
// //                 <CustomerProfilePage />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="inventory-management/equipment-types"
// //             element={
// //               <>
// //                 <PageTitle title="Equipment Types | Safe Sphere Innovations App" />
// //                 <EquipmentTypesPage />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="inventory-management/part-types"
// //             element={
// //               <>
// //                 <PageTitle title="Part Types | Safe Sphere Innovations App" />
// //                 <PartTypesPage />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="inventory-management/inventory"
// //             element={
// //               <>
// //                 <PageTitle title="Inventory | Safe Sphere Innovations App" />
// //                 <InventoryPage />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="inspector-management/inspector-profiles"
// //             element={
// //               <>
// //                 <PageTitle title="Inspector Profiles | Safe Sphere Innovations App" />
// //                 <InspectorProfilePage />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="reporting-analytics"
// //             element={
// //               <>
// //                 <PageTitle title="Reporting and Analytics | Safe Sphere Innovations App" />
// //                 <ReportingAnalyticsPage />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="calendar"
// //             element={
// //               <>
// //                 <PageTitle title="Calendar | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <Calendar />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="profile"
// //             element={
// //               <>
// //                 <PageTitle title="Profile | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <Profile />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="forms/form-elements"
// //             element={
// //               <>
// //                 <PageTitle title="Form Elements | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <FormElements />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="forms/form-layout"
// //             element={
// //               <>
// //                 <PageTitle title="Form Layout | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <FormLayout />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="tables"
// //             element={
// //               <>
// //                 <PageTitle title="Tables | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <Tables />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="settings"
// //             element={
// //               <>
// //                 <PageTitle title="Settings | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <Settings />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="chart"
// //             element={
// //               <>
// //                 <PageTitle title="Basic Chart | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <Chart />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="ui/alerts"
// //             element={
// //               <>
// //                 <PageTitle title="Alerts | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <Alerts />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="ui/buttons"
// //             element={
// //               <>
// //                 <PageTitle title="Buttons | SSI Admin - Tailwind CSS Admin Dashboard Template" />
// //                 <Buttons />
// //               </>
// //             }
// //           />
// //           <Route
// //             path="*"
// //             element={<NotFound />}
// //           />
// //         </Route>
// //       </Routes>
// //     </>
// //   );
// // }

// // export default App;

// interface RoleGuardProps {
//   element: ReactElement;
//   roles: string[];
// }

// // RoleGuard HOC
// const RoleGuard: React.FC<RoleGuardProps> = ({ element, roles }) => {
//   const userRole = useAppSelector((state) => state.auth.role);
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

//   const roleMapping: Record<string, string> = {
//     Admin: 'admin',
//     user: 'user',
//     guest: 'guest',
//   };
//   const normalizedRole = roleMapping[userRole || 'guest'];

//   console.log('App.tsx=>userRole', userRole);
//   console.log('App.tsx=>normalizedRole===>', normalizedRole);

//   if (!isAuthenticated) {
//     return <Navigate to="/auth/signin" />;
//   }

//   if (roles && !roles.includes(normalizedRole)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return element;
// };

// // Route Configuration
// const routesConfig = [
//   { path: '/dashboard', element: <SEIDashboard />, roles: ['admin', 'user'] },
//   { path: '/counter', element: <Counter />, roles: ['user'] },
//   {
//     path: '/company-management/company-details',
//     element: <CompanyDetailsPage />,
//     roles: ['admin'],
//   },
//   { path: '/profile', element: <Profile />, roles: ['user', 'admin'] },
//   { path: '/settings', element: <Settings />, roles: ['admin'] },
//   { path: '/chart', element: <Chart />, roles: ['user'] },
// ];

// // App Component
// function App() {
//   const [loading, setLoading] = useState(true);
//   const { pathname } = useLocation();
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     const role = localStorage.getItem('role');
//     if (token) {
//       dispatch(signInSuccess({ authToken: token, role: role }));
//     } else {
//       dispatch(signOut());
//     }
//     setLoading(false);
//   }, [dispatch]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   if (loading) return <Loader />;

//   return (
//     <>
//       <ToastContainer />
//       <Routes>
//         {!isAuthenticated ? (
//           <>
//             <Route path="/auth/signin" element={<SignIn />} />
//             <Route path="/auth/signup" element={<SignUp />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="*" element={<Navigate to="/auth/signin" />} />
//           </>
//         ) : (
//           <Route
//             path="/"
//             element={
//               <DefaultLayout>
//                 <Outlet />
//               </DefaultLayout>
//             }
//           >
//             {routesConfig.map(({ path, element, roles }) => (
//               <Route key={path} path={path} element={<RoleGuard element={element} roles={roles} />} />
//             ))}
//             <Route path="*" element={<NotFound />} />
//           </Route>
//         )}
//         <Route
//           path="/"
//           element={
//             <Navigate to={isAuthenticated ? '/dashboard' : '/auth/signin'} replace />
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;
