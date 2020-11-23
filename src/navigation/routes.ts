import { lazy } from 'react'
import { RouteProps } from 'react-router'

export interface PrivateRouteObject extends RouteProps {
  exact: boolean
  path: string
  breadcrumb: string
  component: any
  title: string
}

const Users = lazy(() => import('../containers/UserManagement'))
const Profile = lazy(() => import('../containers/Profile'))
const Login = lazy(() => import('../containers/Login'))
const Register = lazy(() => import('../containers/Register'))
const ConfirmEmail = lazy(() => import('../containers/ConfirmEmail'))
const ForgotPassword = lazy(() => import('../containers/ForgotPassword'))
const ResetPassword = lazy(() => import('../containers/ResetPassword'))

const PRIVATE_ROUTES: PrivateRouteObject[] = [
  {
    exact: false,
    path: '/auth/user-management',
    breadcrumb: 'User Management',
    component: Users,
    title: 'User Management'
  },
  {
    exact: false,
    path: '/auth/profile',
    breadcrumb: 'My Profile',
    component: Profile,
    title: 'My Profile'
  }
]

const PUBLIC_ROUTES = [
  {
    exact: true,
    title: 'Login',
    path: '/',
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
  }
]

export { PUBLIC_ROUTES, PRIVATE_ROUTES }
