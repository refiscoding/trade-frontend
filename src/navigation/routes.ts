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


const PRIVATE_ROUTES: PrivateRouteObject[] = [
  {
    exact: false,
    path: '/dashboard',
    breadcrumb: 'Home',
    component: Home,
    title: 'Dashboard'
  },
  {
    exact: false,
    path: '/profile',
    breadcrumb: 'My Profile',
    component: Profile,
    title: 'My Profile'
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
  }
]

export { PUBLIC_ROUTES, PRIVATE_ROUTES }
