import { Bell, Briefcase, HelpCircle, Home, Lock, Star, User, Users } from 'react-feather'
import React from 'react'

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
    to: `/apply-seller`,
    title: 'Become a Seller',
    Icon: Briefcase
  },
  {
    to: `/profile`,
    title: 'My Account',
    Icon: User
  },
  {
    to: `/wishlist`,
    title: 'My Wish List',
    Icon: Star
  },
  {
    to: `/`,
    title: 'Notifications',
    Icon: Bell
  },
  {
    to: '/about-us',
    title: 'About Us',
    Icon: Users
  },
  {
    to: `/login`,
    title: 'Support',
    Icon: HelpCircle
  }
]

export const SELLER_NAV_ITEM: NavItem = {
  to: `/product-management`,
  title: 'Product Management',
  Icon: Briefcase
}

export const LOGOUT_NAV_ITEM: NavItem[] = [
  {
    to: `/`,
    title: 'Logout',
    Icon: Lock
  }
]

export const AUTH_NAV_ITEMS: NavItem[] = [
  {
    to: `/login`,
    title: 'Login',
    Icon: Lock
  },
  {
    to: `/register`,
    title: 'Sign Up',
    Icon: Lock
  }
]
