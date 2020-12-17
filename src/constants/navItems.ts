export type NavItem = {
  to: string
  title: string
  icon: string
  subMenu?: Array<{ to: string; title: string }>
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: `/dashboard`,
    title: 'Home',
    icon: 'home'
  },
  {
    to: `/`,
    title: 'Become a Seller',
    icon: 'briefcase'
  },
  {
    to: `/profile`,
    title: 'My Account',
    icon: 'user'
  },
  {
    to: `/`,
    title: 'My Wish List',
    icon: 'star'
  },
  {
    to: `/`,
    title: 'Notifications',
    icon: 'bell'
  },
  {
    to: `/`,
    title: 'About Us',
    icon: 'users'
  },
  {
    to: `/`,
    title: 'Support',
    icon: 'help'
  }
]