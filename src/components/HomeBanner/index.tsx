import * as React from 'react'
import styled from '@emotion/styled'

import { BANNER_IMAGES } from '../../constants'
import { Carousel } from 'react-responsive-carousel'
import { ColorProps } from 'styled-system'
import { Flex, Image } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

type HomeBannerProps = ColorProps & {
  isCategory?: boolean
}

const StyledCarousel = styled(Carousel)`
  margin-left: -1rem;
`

const HomeBanner: React.FC<HomeBannerProps> = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '450px' : '400px'}
      flexDirection="column"
      alignItems="center"
    >
      <StyledCarousel>
        {BANNER_IMAGES.map((banner, index) => (
          <div key={index}>
            <Image src={banner.image} />
          </div>
        ))}
      </StyledCarousel>
    </Flex>
  )
}

export default HomeBanner
