import {
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import * as React from 'react'
import { useMediaQuery } from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router'
import { useHistory } from 'react-router-dom'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { useAppContext } from '../../context/AppProvider'
import { useAuthContext } from '../../context/AuthProvider/index'
import { Text } from '../../typography'
import Breadcrumbs from '../Breadcrumbs'
import SideBarButton from '../SideBar/SideBarButton'
import { images } from '../../theme'

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

const BreadCrumbCont = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  @media screen and (max-width: 40em) {
    display: none;
  }
`

const Header: React.FC<HeaderProps> = ({ ...rest }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const history = useHistory()
  const { drawerOpen, toggleDrawer } = useAppContext()

  const { user, logout } = useAuthContext()

  const handleLogout = () => {
    logout && logout()
    history.push('/dashboard')
  }

  return (
    <HeaderCont pr={4} pl={drawerOpen ? 'calc(186px + 1rem)' : '1rem'} {...rest}>
      {isTabletOrMobile && <SideBarButton color="black" open={drawerOpen} onClick={toggleDrawer} />}
      <Flex width="50%" align="center" justify="center">
        <Image mr={5} width="100%" height="auto" src={images['TradeFedFullLogo']} />
      </Flex>
      <Flex>
        <Image width={30} height={30} src={images['shoppingCart']} />
      </Flex>
    </HeaderCont>
  )
}

export default withRouter(Header)

Header.defaultProps = {
  bg: 'white'
}
