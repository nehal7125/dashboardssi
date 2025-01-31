import React from 'react';
import DefaultLayout from '../layout/DefaultLayout';
const Testing  = React.lazy(() => import('../pages/Test'));
const SEIDashboard = React.lazy(() => import('../pages/Dashboard/SEIDashboard'));
const Counter = React.lazy(() => import('../components/Counter/Counter'));
const CompanyDetailsPage = React.lazy(() => import('../pages/CompanyDetails/CompanyDetails'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Chart = React.lazy(() => import('../pages/Chart'));
const EquipmentTypesPage = React.lazy(() => import('../pages/InventoryManagement/EquipmentTypes'));
const PartTypesPage = React.lazy(() => import('../pages/InventoryManagement/PartTypes'));
const InventoryPage = React.lazy(() => import('../pages/InventoryManagement/Inventory'));
const InspectorProfilePage = React.lazy(() => import('../pages/InspectorManagement/InspectorProfile'));
const CustomerProfilePage = React.lazy(() => import('../pages/CustomerManagement/CustomerProfile'));

interface Route {
  path: string;
  component: React.FC;
  roles: string[]; // Allowed roles
  title: string;
  layout: React.FC<{ children: React.ReactNode }>;
}

const routes: Route[] = [
  {
    path: '/dashboard',
    component: SEIDashboard,
    roles: ['admin'],
    title: 'Dashboard | SSI Admin',
    layout: DefaultLayout,
  },
  {
    path: '/testing',
    component: Testing,
    roles: ['admin'],
    title: 'Testing | SSI Admin',
    layout: DefaultLayout,
  },
  {
    path: '/counter',
    component: Counter,
    roles: ['admin'],
    title: 'Counter | SSI Admin',
    layout: DefaultLayout,
  },
  {
    path: '/company-management/company-details',
    component: CompanyDetailsPage,
    roles: ['admin'],
    title: 'Company Management | SSI Admin',
    layout: DefaultLayout,
  },
  {
    path: '/profile',
    component: Profile,
    roles: ['admin'],
    title: 'Profile | SSI Admin',
    layout: DefaultLayout,
  },
  {
    path: '/settings',
    component: Settings,
    roles: ['admin'],
    title: 'Setting | SSI Admin',
    layout: DefaultLayout,
  },
  {
    path: '/chart',
    component: Chart,
    roles: ['admin'],
    title: 'Charts | SSI Admin',
    layout: DefaultLayout,
  },
  {
    path: '/inventory-management/equipment-types',
    component: EquipmentTypesPage,
    roles: ['admin'],
    title: 'Equipment Types | Safe Sphere Innovations App',
    layout: DefaultLayout,
  },
  {
    path: '/inventory-management/part-types',
    component: PartTypesPage,
    roles: ['admin'],
    title: 'Part Types | Safe Sphere Innovations App',
    layout: DefaultLayout,
  },
  {
    path: '/inventory-management/inventory',
    component: InventoryPage,
    roles: ['admin'],
    title: 'Inventory | Safe Sphere Innovations App',
    layout: DefaultLayout,
  },
  {
    path: '/inspector-management/inspector-profiles',
    component: InspectorProfilePage,
    roles: ['admin'],
    title: 'Inspector Profiles | Safe Sphere Innovations App',
    layout: DefaultLayout,
  },
  {
    path: '/customer-management/customer-profiles',
    component: CustomerProfilePage,
    roles: ['admin'],
    title: 'Customer Profiles | Safe Sphere Innovations App',
    layout: DefaultLayout,
  },
];

export default routes;
