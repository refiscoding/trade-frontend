import { Flex, FlexProps } from '@chakra-ui/core'
import styled from '@emotion/styled'
import { Variants } from 'framer-motion'
import * as React from 'react'
import { MotionFlex } from '..';
import { useMediaQuery } from "react-responsive";


import { theme } from "../../theme";

const PanelWrapper = styled(MotionFlex)`
  top: 0;
  right: 15%;
  bottom: 0;
  width: 400px;
  display: flex;
  max-width: 100%;
  position: fixed;
  overflow-y: auto;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  @media screen and (max-width: 768px) {
    width: 100%;
    position: relative;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`
const PanelWrapperMobile = styled(MotionFlex)`
  bottom: -10;
  right: 0;
  width: 400px;
  display: flex;
  max-width: 100%;
  position: fixed;
  overflow-y: auto;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  @media screen and (max-width: 768px) {
    width: 100%;
    position: relative;
  }
  ::-webkit-scrollbar {
    display: none;
  }
`

const variants: Variants = {
  hidden: {
    x: 'calc(800px + 15%)'
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      damping: 20
    }
  }
}

const SideSlider: React.FC<FlexProps> = ({ children, justify }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  return (
    <React.Fragment>
      {
        isTabletOrMobile
          ? (
            <PanelWrapperMobile
              p={5}
              m={[5, 0]}
              bg={theme.colors.background}
              initial="hidden"
              animate="visible"
              rounded={['md', 0]}
              variants={variants}
            >
              <Flex flexDir="column" width="100%" minHeight="100%" justify={justify}>
                {children}
              </Flex>
            </PanelWrapperMobile>
          )
          : (
            <PanelWrapper
              p={5}
              m={[5, 0]}
              bg={theme.colors.background}
              initial="hidden"
              animate="visible"
              rounded={['md', 0]}
              variants={variants}
            >
              <Flex flexDir="column" width="100%" minHeight="100%" justify={justify}>
                {children}
              </Flex>
            </PanelWrapper>
          )
      }
    </React.Fragment>
  )
}

export default SideSlider

SideSlider.defaultProps = {
  justify: 'center'
}
