import { lazy } from 'react'
import { RouteProps } from 'react-router'

export interface PrivateRouteObject extends RouteProps {
  exact: boolean
  path: string
  breadcrumb: string
  component: any
  title: string
}

const Profile = lazy(() => import('../containers/Profile'))
const Login = lazy(() => import('../containers/Login'))
const Register = lazy(() => import('../containers/Register'))
const ConfirmEmail = lazy(() => import('../containers/ConfirmEmail'))
const ForgotPassword = lazy(() => import('../containers/ForgotPassword'))
const ResetPassword = lazy(() => import('../containers/ResetPassword'))
const Home = lazy(() => import('../containers/HomePage'))
const Redirect = lazy(() => import('../containers/Redirect'))
const UserDetails = lazy(() => import('../containers/OnboardingUserDetails'))
const onBoardingIntro = lazy(() => import('../containers/OnboardingUserDetails/OnboardingIntro'))
const Seller = lazy(() => import('../containers/Seller'))
const SellerApproval = lazy(() => import('../containers/Seller/seller-approval'))
const ProductView = lazy(() => import('../containers/ProductView'))
const ProductManagement = lazy(() => import('../containers/ProductManagement'))
const ProductCreation = lazy(() => import('../containers/ProductCreation'))
const ProductFilter = lazy(() => import('../containers/ProductFilter'))
const Wishlist = lazy(() => import('../containers/Wishlist'))
const CategoryView = lazy(() => import('../containers/CategoryView'))

const PRIVATE_ROUTES: PrivateRouteObject[] = [
  {
    exact: true,
    path: '/profile',
    breadcrumb: 'My Profile',
    component: Profile,
    title: 'My Profile'
  },
  {
    exact: false,
    path: '/apply-seller',
    breadcrumb: 'Apply Seller',
    component: Seller,
    title: 'Apply Seller'
  },
  {
    exact: false,
    path: '/product-management',
    breadcrumb: 'Product Management',
    component: ProductManagement,
    title: 'Product Management'
  },
  {
    exact: false,
    path: '/product-filter',
    breadcrumb: 'Product Filter',
    component: ProductFilter,
    title: 'Product Filter'
  },
  {
    exact: false,
    path: '/seller-approval',
    breadcrumb: 'Apply Seller',
    component: SellerApproval,
    title: 'Apply Seller'
  },
  {
    exact: false,
    path: '/product/:id',
    breadcrumb: 'Product',
    component: ProductView,
    title: 'Product'
  },
  {
    exact: false,
    path: '/category/:id',
    breadcrumb: 'Category',
    component: CategoryView,
    title: 'Category'
  },
  {
    exact: false,
    path: '/add-product',
    breadcrumb: 'Product Creation',
    component: ProductCreation,
    title: 'Product Creation'
  },
  {
    exact: true,
    path: '/',
    breadcrumb: 'Home',
    component: Home,
    title: 'Home'
  },
  {
    exact: false,
    path: '/wishlist',
    breadcrumb: 'My Wishlist',
    component: Wishlist,
    title: 'My Wishlist'
  }
]

const PUBLIC_ROUTES = [
  {
    exact: true,
    title: 'Login',
    path: '/login',
    component: Login
  },
  {
    exact: true,
    title: 'Register',
    path: '/register',
    component: Register
  },
  {
    exact: true,
    title: 'Confirm Email',
    path: '/confirm-email',
    component: ConfirmEmail
  },
  {
    exact: true,
    title: 'Forgot Password',
    path: '/forgot-password',
    component: ForgotPassword
  },
  {
    exact: true,
    title: 'Reset Password',
    path: '/reset-password',
    component: ResetPassword
  },
  {
    exact: true,
    title: 'Provider Auth',
    path: '/connect/:provider/redirect',
    component: Redirect
  },
  {
    exact: false,
    path: '/user-onboarding-details',
    component: UserDetails,
    title: 'Profile Details'
  },
  {
    exact: false,
    path: '/user-onboarding-intro',
    component: onBoardingIntro,
    title: 'Profile Details'
  }
]

export { PUBLIC_ROUTES, PRIVATE_ROUTES }
