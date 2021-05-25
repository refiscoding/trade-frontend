import * as React from 'react'
import { get } from "lodash";
import { AnimatePresence } from 'framer-motion'
import { Flex, useToast } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

import { Text } from '../../../typography'
import { MenuItem, Tooltip } from './styles'
import { useAppContext } from '../../../context/AppProvider'

import { ApolloError } from 'apollo-boost'
import { ERROR_TOAST } from '../../../constants'
import { useFetchUserNotificationsQuery, Notification } from '../../../generated/graphql'


type SideBarItemProps = {
  title: string
  to: string
  color: string
  hoverColor: string
  accentColor: string
  Icon: React.FC
  tooltipColor?: string
  tooltipBg?: string
  closeOnNavigate?: boolean
  handleClick?: () => void
}

type CounterProps = {
  Icon: React.FC
  notifications: Notification[]
};

const NotificationsCounter: React.FC<CounterProps> = ({ Icon, notifications }) => {
  return (
    <Flex flexDirection="column">
      <Flex
        backgroundColor="#CF2121"
        height="25px"
        width="25px"
        color="#fff"
        textAlign="center"
        justify="center"
        align="center"
        borderRadius="50%"
        fontSize="12px"
        position="absolute"
        top="0"
        left="20px"
      >
        {
          notifications?.length > 9 ? '9+' : notifications?.length
        }
      </Flex>
      <Icon />
    </Flex>
  );
};

const SideBarItem: React.FC<SideBarItemProps> = ({
  accentColor,
  color,
  hoverColor,
  Icon,
  title,
  to,
  tooltipColor,
  tooltipBg,
  closeOnNavigate,
  handleClick
}) => {
  const { drawerOpen, toggleDrawer } = useAppContext()

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const variants = {
    open: {
      x: 0,
      transition: {
        x: { stiffness: 200, velocity: -100 }
      }
    },
    closed: {
      x: isTabletOrMobile ? -50 : 0,
      transition: {
        x: { stiffness: 200 }
      }
    }
  };

  const notificationsIcon = title === "Notifications";

  const toast = useToast();

  const { data: userNotifications, refetch: refetchNotifications } = useFetchUserNotificationsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  });
  const notifications = get(userNotifications, "findUserNotifications.payload");

  const hasNotifications = notifications?.length;

  React.useEffect(() => {
    refetchNotifications();
  }, [refetchNotifications]);

  return (
    <MenuItem
      to={to}
      color={color}
      hoverAccent={accentColor}
      variants={variants}
      hovercolor={hoverColor}
      onClick={() => {
        if (closeOnNavigate && drawerOpen) {
          toggleDrawer()
        }
        handleClick && handleClick()
      }}
      accentcolor={accentColor}
      activeClassName="active-nav-link"
    >
      <Flex
        height="50px"
        alignItems="center"
        justifyContent="center"
        className="sidebar-nav-item-wrapper"
      >
        <Flex className="icon-wrap" mx={3}>
          {
            notificationsIcon
              ? hasNotifications
                ? <NotificationsCounter notifications={notifications} Icon={Icon} />
                : <Icon />
              : <Icon />
          }
        </Flex>
        <AnimatePresence>
          {drawerOpen && (
            <Text
              ml={4}
              color={color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: 'none' }}
            >
              {title}
            </Text>
          )}
        </AnimatePresence>
        {!drawerOpen && !isTabletOrMobile && (
          <Tooltip bg={tooltipBg || 'gray.800'} className="sidebar-tooltip">
            <Text fontSize={13} color={tooltipColor || 'white'}>
              {title}
            </Text>
          </Tooltip>
        )}
      </Flex>
    </MenuItem>
  )
}

export default SideBarItem
