import * as React from 'react'
import { get } from "lodash";
import { ApolloError } from 'apollo-boost'
import { AnimatePresence } from 'framer-motion'
import { Flex, useToast } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

import { theme } from '../../../theme';
import { Text } from '../../../typography'
import { MenuItem, Tooltip } from './styles'
import { ERROR_TOAST } from '../../../constants'
import { useAppContext } from '../../../context/AppProvider'
import { useFetchUserNotificationsQuery, useFetchUsersWhishlistQuery } from '../../../generated/graphql'

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
  count: number
  color: string
};

const NotificationsCounter: React.FC<CounterProps> = ({ Icon, count, color }) => {
  return (
    <Flex flexDirection="column">
      <Flex
        backgroundColor={color}
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
          count > 9 ? '9+' : count
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

  const wishlistIcon = title === "My Wish List";
  const notificationsIcon = title === "Notifications";

  const toast = useToast();

  const { data: userNotifications, refetch: refetchNotifications } = useFetchUserNotificationsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  });
  const { data: userWishlist, refetch: refetchWishlist } = useFetchUsersWhishlistQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
  });
  const notifications = get(userNotifications, "findUserNotifications.payload");
  const products = get(userWishlist, 'findOneWishlist.payload.products', null);
  const hasWishlist = userWishlist?.findOneWishlist?.payload;
  const hasWishlistProducts = hasWishlist?.products?.length;
  const hasNotifications = notifications?.length;

  React.useEffect(() => {
    refetchNotifications();
    refetchWishlist()
  }, [refetchNotifications, refetchWishlist]);

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
                ? <NotificationsCounter count={notifications?.length} Icon={Icon} color="#CF2121" />
                : <Icon />
              : wishlistIcon
                ? hasWishlistProducts
                  ? <NotificationsCounter count={products?.length} Icon={Icon} color={theme.colors.brand[500]} />
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
