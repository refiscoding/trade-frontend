import React from 'react'
import {
  Bell,
  Briefcase,
  HelpCircle,
  Home,
  Lock,
  LogOut,
  Star,
  Truck,
  User,
  UserPlus,
  Users
} from 'react-feather'

export type NavItem = {
  to: string
  title: string
  Icon: React.FC
  subMenu?: Array<{ to: string; title: string }>
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: `/`,
    title: 'Home',
    Icon: Home
  },
  {
    to: `/wishlist`,
    title: 'My Wish List',
    Icon: Star
  },
  {
    to: `/profile`,
    title: 'My Account',
    Icon: User
  },
  {
    to: `/notifications`,
    title: 'Notifications',
    Icon: Bell
  },
  {
    to: '/about-us',
    title: 'About Us',
    Icon: Users
  },
  {
    to: `/user-support`,
    title: 'Support',
    Icon: HelpCircle
  }
]

export const BECOME_SELLER_NAV_ITEM = {
  to: `/apply-seller`,
  title: 'Become a Seller',
  Icon: Briefcase
}

export const SELLER_NAV_ITEM = {
  to: `/product-management`,
  title: 'Product Management',
  Icon: Briefcase
}

export const BUSINESS_NAV_ITEM = {
  to: `/business-orders`,
  title: 'Business Orders',
  Icon: Truck
}

export const LOGOUT_NAV_ITEM: NavItem[] = [
  {
    to: `/`,
    title: 'Logout',
    Icon: LogOut
  }
]

export const AUTH_NAV_ITEMS: NavItem[] = [
  {
    to: `/register`,
    title: 'Sign Up',
    Icon: UserPlus
  },
  {
    to: `/login`,
    title: 'Login',
    Icon: Lock
  }
]
