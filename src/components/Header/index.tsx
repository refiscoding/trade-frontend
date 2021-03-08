import {
  Flex,
  Image
} from '@chakra-ui/core'
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
  left: ${(props) => (props.open ? '250px' : '64px')};
  @media screen and (max-width: 40em) {
    left: 0;
  }
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

const Header: React.FC<HeaderProps> = ({ ...rest }) => {
  const history = useHistory();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' });
  const { drawerOpen, toggleDrawer } = useAppContext();
  const handleCartIconClicked = () => {
    history.push("/cart");
  };

  return (
    <HeaderCont pr={4} pl={drawerOpen ? 'calc(186px + 1rem)' : '1rem'} {...rest}>
      {isTabletOrMobile && <SideBarButton color="black" open={drawerOpen} onClick={toggleDrawer} />}
      <Flex width="50%" align="center" justify="center">
        <Image mr={5} width="100%" height="auto" src={images['TradeFedFullLogo']} />
      </Flex>
      <Flex>
        <ShoppingCart onClick={handleCartIconClicked} />
      </Flex>
    </HeaderCont>
  )
}

export default withRouter(Header)

Header.defaultProps = {
  bg: 'white'
}
