import * as React from 'react'

import { Carousel } from 'react-responsive-carousel'
import { ColorProps } from 'styled-system'
import { Flex, Text } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

type HomeBannerProps = ColorProps & {
  caption?: string
  header?: string | null
  headerMargin?: string
  headerColor?: string
  isCategory?: boolean
}

// image={isTabletOrMobile ? images.heroImg : images.homeBanner2}

const HomeBanner: React.FC<HomeBannerProps> = ({ headerColor, headerMargin, header }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '450px' : '400px'}
      bg={'#231F20'}
      mr="16px"
      flexDirection="column"
      alignItems="center"
    >
      <Flex
        mt={8}
        width="100vw"
        minHeight={isTabletOrMobile ? '450px' : '490px'}
        backgroundPosition="center"
        backgroundSize={isTabletOrMobile ? 'contain' : 'contain'}
        backgroundRepeat="no-repeat"
      >
        <Carousel>
          <div>
            <img src="assets/1.jpeg" />
            <p className="legend">Legend 1</p>
          </div>
          <div>
            <img src="assets/2.jpeg" />
            <p className="legend">Legend 2</p>
          </div>
          <div>
            <img src="assets/3.jpeg" />
            <p className="legend">Legend 3</p>
          </div>
        </Carousel>
        <Text mt={headerMargin} color={headerColor}>
          {header}
        </Text>
      </Flex>
    </Flex>
  )
}

export default HomeBanner
