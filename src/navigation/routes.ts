import { lazy } from 'react'
import { RouteProps } from 'react-router'

export interface PrivateRouteObject extends RouteProps {
  exact: boolean
  path: string
  breadcrumb: string
  component: any
  title: string
}

const AboutUs = lazy(() => import('../containers/AboutUs'))
const AddressBook = lazy(() => import('../containers/AddressBook'))
const BusinessOrders = lazy(() => import('../containers/BusinessOrders'))
const Cart = lazy(() => import('../containers/Cart'))
const CategoryView = lazy(() => import('../containers/CategoryView'))
const Checkout = lazy(() => import('../containers/Checkout'))
const CheckoutSuccess = lazy(() => import('../containers/Checkout/successCheckout'))
const ConfirmEmail = lazy(() => import('../containers/ConfirmEmail'))
const CurrentOrders = lazy(() => import('../containers/BusinessOrders/CurrentOrders'))
const ForgotPassword = lazy(() => import('../containers/ForgotPassword'))
const GenerateLabel = lazy(() => import('../containers/GenerateLabel'))
const Home = lazy(() => import('../containers/HomePage'))
const Login = lazy(() => import('../containers/Login'))
const Notifications = lazy(() => import('../containers/Notifications'))
const NucleusPayment = lazy(() => import('../containers/NucleusPayment'))
const onBoardingIntro = lazy(() => import('../containers/OnboardingUserDetails/OnboardingIntro'))
const Orders = lazy(() => import('../containers/Orders'))
const ProductCreation = lazy(() => import('../containers/ProductCreation'))
const ProductFilter = lazy(() => import('../containers/ProductFilter'))
const ProductManagement = lazy(() => import('../containers/ProductManagement'))
const ProductManagementAnalysis = lazy(() => import('../containers/ProductAnalysis'))
const ProductView = lazy(() => import('../containers/ProductView'))
const Profile = lazy(() => import('../containers/Profile'))
const ProfileDetails = lazy(() => import('../containers/ProfileDetails'))
const Redirect = lazy(() => import('../containers/Redirect'))
const Register = lazy(() => import('../containers/Register'))
const ResetPassword = lazy(() => import('../containers/ResetPassword'))
const Returns = lazy(() => import('../containers/Returns'))
const Seller = lazy(() => import('../containers/Seller'))
const SellerApproval = lazy(() => import('../containers/Seller/seller-approval'))
const Support = lazy(() => import('../containers/Support'))
const UploadSuccess = lazy(() => import('../containers/ProductCreation/upload-success'))
const UserDetails = lazy(() => import('../containers/OnboardingUserDetails'))
const ValidatePayment = lazy(() => import('../containers/Payment'))
const Wishlist = lazy(() => import('../containers/Wishlist'))

const PRIVATE_ROUTES: PrivateRouteObject[] = [
  {
    exact: true,
    path: '/profile',
    breadcrumb: 'My Profile',
    component: Profile,
    title: 'My Profile'
  },
  {
    exact: true,
    path: '/profile-details',
    breadcrumb: 'My Profile Details',
    component: ProfileDetails,
    title: 'My Profile Details'
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
    path: '/product-analysis/:id',
    breadcrumb: 'Product Analysis',
    component: ProductManagementAnalysis,
    title: 'Product Analysis'
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
    exact: false,
    path: '/upload-product-success',
    breadcrumb: 'Product Creation',
    component: UploadSuccess,
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
  },
  {
    exact: false,
    path: '/business-orders',
    breadcrumb: 'Business Orders',
    component: BusinessOrders,
    title: 'Business Orders'
  },
  {
    exact: false,
    path: '/generate-label',
    breadcrumb: 'Generate Label',
    component: GenerateLabel,
    title: 'Generate Label'
  },
  {
    exact: false,
    path: '/cart',
    breadcrumb: 'My Cart',
    component: Cart,
    title: 'My Cart'
  },
  {
    exact: false,
    path: '/checkout',
    breadcrumb: 'Checkout',
    component: Checkout,
    title: 'Checkout'
  },
  {
    exact: false,
    path: '/checkout-success',
    breadcrumb: 'Checkout',
    component: CheckoutSuccess,
    title: 'Checkout'
  },
  {
    exact: true,
    title: 'About Us',
    breadcrumb: 'About Us',
    path: '/about-us',
    component: AboutUs
  },
  {
    exact: true,
    title: 'Orders',
    breadcrumb: 'Orders',
    path: '/orders',
    component: Orders
  },
  {
    exact: true,
    title: 'Current Orders',
    breadcrumb: 'Current Orders',
    path: '/current-orders',
    component: CurrentOrders
  },
  {
    exact: false,
    title: 'Support',
    breadcrumb: 'Support',
    path: '/user-support',
    component: Support
  },
  {
    exact: false,
    title: 'Notifications',
    breadcrumb: 'Notifications',
    path: '/notifications',
    component: Notifications
  },
  {
    exact: false,
    title: 'Returns',
    breadcrumb: 'Order Returns',
    path: '/returns',
    component: Returns
  },
  {
    exact: false,
    title: 'Addresses',
    breadcrumb: 'Address Book',
    path: '/addresses',
    component: AddressBook
  },
  {
    exact: false,
    title: 'Before Checkout',
    breadcrumb: 'Before Checkout',
    path: '/before-checkout',
    component: NucleusPayment
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
  },
  {
    exact: false,
    path: '/transactions/validate',
    component: ValidatePayment,
    title: 'Validating Payment'
  }
]

export { PUBLIC_ROUTES, PRIVATE_ROUTES }
