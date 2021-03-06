import * as React from 'react'
import styled from '@emotion/styled'

import { get } from 'lodash'
import { motion } from 'framer-motion'
import { ApolloError } from 'apollo-boost'
import { ShoppingCart, Star } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { InstantSearch } from 'react-instantsearch-dom'
import { Flex, Image, Text, useToast } from '@chakra-ui/core'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { RouteComponentProps, withRouter, useHistory } from 'react-router'

import SideBarButton from '../SideBar/SideBarButton'

import { SearchBar } from '../index'
import { images, theme } from '../../theme'
import { useAppContext } from '../../context/AppProvider'
import { useAuthContext } from '../../context/AuthProvider'
import { SEARCH_INDEX, searchClient, ERROR_TOAST } from '../../constants'
import { useFetchUsersCartQuery, useFetchUsersWhishlistQuery } from '../../generated/graphql'

type HeaderProps = RouteComponentProps &
  ColorProps & {
    color?: string
    size?: number
    id?: string
    open?: boolean
    getLoggedInUser?: () => { name?: string; id: string }
  }

type HeaderContProps = SpaceProps &
  ColorProps & {
    color?: string
    open?: boolean
  }

const HeaderCont = styled(motion.div)<HeaderContProps>`
  ${space};
  ${color};
  top: 0;
  right: 0;
  height: 95px;
  z-index: 1290;
  display: flex;
  position: fixed;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: space-between;
  box-shadow: 0 1px 1px 0 ${theme.colors.brand[700]};
  left: ${(props) => (props.open ? '250px' : 0)};
  @media screen and (max-width: 40em) {
    left: 0;
  }
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

const Header: React.FC<HeaderProps> = ({ ...rest }) => {
  const { user, isAuthenticated } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const { drawerOpen, toggleDrawer } = useAppContext()
  const isSellerApproved = user?.isSeller === 'approved'

  const { data: userCart, refetch: refetchCart } = useFetchUsersCartQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const cart = get(userCart, 'findCart.payload')
  const cartProducts = get(userCart, 'findCart.payload.products')

  const numberOfItems = cartProducts?.length
  const hasProducts = numberOfItems > 0

  const { data: userWishlist, refetch: refetchWishlist } = useFetchUsersWhishlistQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const wishlist = get(userWishlist, 'findWishlist.payload')
  const wishlistProducts = get(userCart, 'findCart.payload.products')

  const numberOfProducts = wishlistProducts?.length
  const showProducts = numberOfProducts > 0

  const handleWishlistIconClicked = () => {
    history.push('/wishlist')
  }

  const handleCartIconClicked = () => {
    history.push('/cart')
  }

  const handleMyaccount = () => {
    history.push('/profile')
  }

  const handleBecomeSeller = () => {
    if (isSellerApproved) {
      history.push('/product-management')
      return
    }
    history.push('/apply-seller')
  }

  const handleFilter = () => {
    history.push(`/product-filter`)
  }

  const handleLoginClicked = () => {
    history.push('/login')
  }

  const handleLogoClicked = () => {
    history.push(`/`)
  }

  React.useEffect(() => {
    refetchCart()
  }, [refetchCart])

  React.useEffect(() => {
    refetchWishlist()
  }, [refetchWishlist])

  return (
    <HeaderCont pr={4} pl={drawerOpen ? 'calc(186px + 1rem)' : '1rem'} {...rest}>
      <InstantSearch indexName={SEARCH_INDEX} searchClient={searchClient}>
        <SideBarButton color="white" open={drawerOpen} onClick={toggleDrawer} />
        {!drawerOpen && (
          <Flex
            width={isTabletOrMobile ? '50%' : '40%'}
            align="center"
            justifyContent={isTabletOrMobile ? 'center' : 'flex-start'}
            pl={5}
          >
            <Image
              cursor="pointer"
              onClick={handleLogoClicked}
              mr={5}
              width="200px"
              src={images['TFInverseWhite']}
            />
          </Flex>
        )}
        <Flex display={isTabletOrMobile ? 'none' : 'flex'} width={isTabletOrMobile ? 0 : '55%'}>
          <Flex
            width={drawerOpen ? '50%' : '40%'}
            alignItems="center"
            justifyContent="space-between"
            px={5}
          >
            {user?.isBusiness === true && (
              <Text
                color="white"
                fontSize="14px"
                cursor="pointer"
                onClick={handleBecomeSeller}
                pr={4}
              >
                {isSellerApproved ? 'Product Management' : 'Become a Seller'}
              </Text>
            )}
            {isAuthenticated ? (
              <Text color="white" fontSize="14px" cursor="pointer" onClick={handleMyaccount}>
                My Account
              </Text>
            ) : (
              <Text
                color="white"
                fontSize="14px"
                cursor="pointer"
                onClick={handleLoginClicked}
                pr={4}
              >
                Login / Sign Up
              </Text>
            )}
          </Flex>
          <Flex width="65%" mr={4}>
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <SearchBar handleFilter={handleFilter} handleSearch={() => {}} handleReset={() => {}} />
          </Flex>
        </Flex>
        <Flex flexDirection="column" cursor="pointer" mr={5}>
          {wishlist && showProducts && isAuthenticated && (
            <Flex
              backgroundColor={theme.colors.accent[50]}
              height="25px"
              width="25px"
              color={theme.colors.brand[500]}
              textAlign="center"
              justify="center"
              align="center"
              borderRadius="50%"
              fontSize="12px"
              position="absolute"
              top="4px"
              right="21px"
            >
              {numberOfProducts > 9 ? '9+' : numberOfProducts}
            </Flex>
          )}
          <Star color="white" onClick={handleWishlistIconClicked} />
        </Flex>
        <Flex flexDirection="column" cursor="pointer" mr={5}>
          {cart && hasProducts && isAuthenticated && (
            <Flex
              backgroundColor={theme.colors.accent[50]}
              height="25px"
              width="25px"
              color={theme.colors.brand[700]}
              textAlign="center"
              justify="center"
              align="center"
              mt={18}
              borderRadius="50%"
              fontSize="12px"
              position="absolute"
              top="4px"
              right="21px"
            >
              {numberOfItems > 9 ? '9+' : numberOfItems}
            </Flex>
          )}
          <ShoppingCart color="white" onClick={handleCartIconClicked} />
        </Flex>
      </InstantSearch>
    </HeaderCont>
  )
}

export default withRouter(Header)

Header.defaultProps = {
  bg: 'brand.700'
}
