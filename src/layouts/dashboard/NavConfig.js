// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  {
    title: 'Categories',
    path: '/dashboard/categories',
    icon: getIcon('carbon:collapse-categories'),
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: getIcon('file-icons:postscript'),
  },
  {
    title: 'Content Title',
    path: '/dashboard/content-details',
    icon: getIcon('eos-icons:content-lifecycle-management'),
  },
  {
    title: 'Content Data',
    path: '/dashboard/content-data',
    icon: getIcon('carbon:media-library-filled'),
  },
  {
    title: 'Featured Banner',
    path: '/dashboard/featured-banners',
    // icon: getIcon('file-icons:postscript'),
    icon: getIcon('bxs:calendar-star'),
  },
  {
    title: 'Ad Banner',
    path: '/dashboard/ad-banners',
    icon: getIcon('bi:badge-ad-fill'),
  },
  {
    title: 'Packages',
    path: '/dashboard/packages',
    icon: getIcon('fa6-solid:money-check-dollar'),
  },

  {
    title: 'Notification',
    path: '/dashboard/get-notification',
    icon: getIcon('fa6-solid:money-check-dollar'),
  },
  {
    title: 'Notification Send Details',
    path: '/dashboard/get-Send-All-Notification',
    icon: getIcon('fa6-solid:money-check-dollar'),
  },
  {
    title: 'Content Tags',
    path: '/dashboard/get-tags',
    icon: getIcon('fa6-solid:money-check-dollar'),
  },

  { title: 'UPDATED', path: '/dashboard/updated', icon: getIcon('fa6-solid:money-check-dollar') },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
];

export default navConfig;
