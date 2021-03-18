import {Flex, Image, Text} from '@chakra-ui/core'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import * as React from 'react'
import { useMediaQuery } from 'react-responsive'
import { RouteComponentProps, withRouter, useHistory } from 'react-router'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { useAppContext } from '../../context/AppProvider'
import SideBarButton from '../SideBar/SideBarButton'
import { images } from '../../theme'
import { ShoppingCart } from 'react-feather'
import {InstantSearch} from "react-instantsearch-dom";
import {SEARCH_INDEX, searchClient} from "../../constants";
import {SearchBar} from "../index";
import {useAuthContext} from "../../context/AuthProvider";

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
  height: 64px;
  z-index: 1290;
  display: flex;
  position: fixed;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  border-bottom-width: 1px;
  justify-content: space-between;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.17);
  left: ${(props) => (props.open ? '250px' : 0)};
  @media screen and (max-width: 40em) {
    left: 0;
  }
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

const Header: React.FC<HeaderProps> = ({ ...rest }) => {
  const { user } = useAuthContext()
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const { drawerOpen, toggleDrawer } = useAppContext()
  const isSellerApproved = user?.isSeller === 'approved'

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

  return (
    <HeaderCont pr={4} pl={drawerOpen ? 'calc(186px + 1rem)' : '1rem'} {...rest}>
        <InstantSearch indexName={SEARCH_INDEX} searchClient={searchClient}>
          <SideBarButton color="black" open={drawerOpen} onClick={toggleDrawer} />
          <Flex
            width={isTabletOrMobile ? '50%' : '40%'}
            align="center"
            justifyContent={isTabletOrMobile ? 'center' : 'flex-start'}
            pl={5}
          >
            <Image mr={5} width={isTabletOrMobile ? '100%' : '40%'} src={images['TradeFedFullLogo']} />
          </Flex>
          <Flex
            display={isTabletOrMobile ? "none" : "flex"}
            width={isTabletOrMobile ? 0 : '55%'}
          >
            <Flex width="40%" alignItems="center" justifyContent="space-between" px={5}>
              <Text
                color="brand.500"
                fontSize="18px"
                cursor="pointer"
                onClick={() => handleBecomeSeller()}
              >
                {isSellerApproved ? 'Product Management' : 'Become a Seller'}
              </Text>
              <Text
                color="brand.500"
                fontSize="18px"
                cursor="pointer"
                onClick={() => handleMyaccount()}
              >
                My Account
              </Text>
            </Flex>
            <Flex width="65%" mr={4}>
              <SearchBar
                handleFilter={() => {}}
                handleSearch={() => {}}
                handleReset={() => {}}
              />
            </Flex>
          </Flex>
          <Flex>
            <ShoppingCart onClick={handleCartIconClicked} />
          </Flex>
        </InstantSearch>
    </HeaderCont>
  )
}

export default withRouter(Header)

Header.defaultProps = {
  bg: 'white'
}
