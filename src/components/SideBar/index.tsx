import { Flex, useToast } from '@chakra-ui/core'
import { AnimatePresence, motion, useAnimation, Variants } from 'framer-motion'
import * as React from 'react'
import { useMediaQuery } from 'react-responsive'
import { ColorProps } from 'styled-system'
import { useAppContext } from '../../context/AppProvider'
import { NavItem, AUTH_NAV_ITEMS, LOGOUT_NAV_ITEM } from '../../constants/navItems'
import { images } from '../../theme'
import { Text } from '../../typography'
import Header from '../Header'
import SideBarButton from './SideBarButton'
import SideBarItem from './SideBarItem'
import { MenuCont, Overlay, RenderWrapper } from './styles'
import { useAuthContext } from '../../context/AuthProvider'
import { useHistory } from 'react-router'
import { useFetchUserNotificationsQuery } from '../../generated/graphql'
import { ApolloError } from 'apollo-boost'
import { ERROR_TOAST } from '../../constants'
import { useAuthContext } from '../../context/AuthProvider'

type SideBarProps = ColorProps & {
  accentColor: string
  borderColor?: string
  closeOnNavigate?: boolean
  color: string
  hoverColor: string
  navItems: NavItem[]
  tooltipBg?: string
  tooltipColor?: string
}

const SideBar: React.FC<SideBarProps> = ({
  accentColor,
  bg,
  borderColor,
  children,
  color,
  hoverColor,
  navItems,
  tooltipBg,
  tooltipColor,
  closeOnNavigate
}) => {
  const { drawerOpen, toggleDrawer } = useAppContext()
  const { isAuthenticated, logout } = useAuthContext()
  const { user, isAuthenticated, logout } = useAuthContext()

  const toast = useToast()
  const history = useHistory()

  const controls = useAnimation()

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  React.useEffect(() => {
    if (drawerOpen) {
      controls.start('open')
    } else {
      controls.start('closed')
    }
  }, [isTabletOrMobile, drawerOpen, controls])

  const { refetch: refetchNotifications } = useFetchUserNotificationsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  });

  React.useEffect(() => {
    refetchNotifications();
  }, [refetchNotifications]);


  const handleNavItems = () => {
    const updatedNavItems = navItems
    if (user?.isSeller === 'approved') {
      updatedNavItems[1] = SELLER_NAV_ITEM
    }
    return updatedNavItems
  }

  const variants: Variants = {
    open: {
      x: 0,
      width: 250,
      transition: { staggerChildren: 0.05, delayChildren: 0.05, stiffness: 10, damping: 5 }
    },
    closed: {
      x: -250,
      width: 250,
      transition: {
        stiffness: 80,
        staggerDirection: -1,
        staggerChildren: 0.1
      }
    }
  }

  const handleAuth = () => {
    if (!isAuthenticated) {
      return
    }
    logout && logout()
    history.push('/')
  }

  const authSection = isAuthenticated ? LOGOUT_NAV_ITEM : AUTH_NAV_ITEMS

  return (
    <>
      <MenuCont
        bg={bg}
        flexDir="column"
        animate={controls}
        variants={variants}
        alignItems="flex-start"
        // Calculate offset based on icon size
        iconOffset={(64 - 20) / 2}
        justifyContent="flex-start"
        initial={{ width: drawerOpen ? 300 : 64 }}
      >
        <Flex
          pl="20px"
          width="100%"
          height="64px"
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row-reverse"
          mb={5}
        >
          <SideBarButton color={color} open={drawerOpen} onClick={toggleDrawer} />
          <Flex flex={1} mr={4}>
            <AnimatePresence>
              {drawerOpen && (
                <Flex flexDirection="column" pt={5}>
                  <motion.img
                    width="100%"
                    height="auto"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={images.TradeFedFullLogo}
                    style={{ alignSelf: 'flex-start' }}
                  />
                  <Text
                    fontSize="12px"
                    color={color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, pointerEvents: 'none' }}
                  >
                    A B2B and B2C Trade App
                  </Text>
                </Flex>
              )}
            </AnimatePresence>
          </Flex>
        </Flex>
        {(handleNavItems() as NavItem[]).map((props) => (
          <SideBarItem
            color={color}
            key={props.title}
            hoverColor={hoverColor}
            accentColor={accentColor}
            tooltipColor={tooltipColor}
            tooltipBg={tooltipBg}
            closeOnNavigate={closeOnNavigate}
            {...props}
          />
        ))}
        <Flex flexDirection="column" mt={10} width="100%">
          {(authSection as NavItem[]).map((props) => (
            <SideBarItem
              handleClick={handleAuth}
              color={color}
              key={props.title}
              hoverColor={hoverColor}
              accentColor={accentColor}
              tooltipColor={tooltipColor}
              tooltipBg={tooltipBg}
              closeOnNavigate={closeOnNavigate}
              {...props}
            />
          ))}
        </Flex>
      </MenuCont>
      <RenderWrapper
        className="render-wrapper"
        pl={isTabletOrMobile ? 0 : drawerOpen ? '250px' : 4}
      >
        <Header />
        {children}
        {isTabletOrMobile && (
          <Overlay
            onClick={toggleDrawer}
            initial={{ opacity: 0 }}
            pointerEvents={drawerOpen ? 'auto' : 'none'}
            animate={drawerOpen ? { opacity: 1 } : { opacity: 0 }}
          />
        )}
      </RenderWrapper>
    </>
  )
}

export default SideBar

SideBar.defaultProps = {
  color: 'white',
  bg: 'gray.900',
  hoverColor: 'gray.800',
  borderColor: 'gray.700',
  accentColor: 'cyan.500'
}
