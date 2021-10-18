import { Flex, Text } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { useMediaQuery } from 'react-responsive'

type HomeBannerProps = ColorProps & {
  image?: string
  caption?: string
  header?: string | null
  headerMargin?: string
  headerColor?: string
  isCategory?: boolean
}

const HomeBanner: React.FC<HomeBannerProps> = ({ image, headerColor, headerMargin, header }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '450px' : '400px'}
      bg={'#231F20'}
      mr="10px"
      flexDirection="column"
      alignItems="center"
    >
      <Flex
        mt={8}
        width="100vw"
        minHeight={isTabletOrMobile ? '450px' : '490px'}
        backgroundImage={`url(${image})`}
        backgroundPosition="center"
        backgroundSize={isTabletOrMobile ? 'contain' : 'contain'}
        backgroundRepeat="no-repeat"
      >
        <Text mt={headerMargin} color={headerColor}>
          {header}
        </Text>
      </Flex>
    </Flex>
  )
}

export default HomeBanner
