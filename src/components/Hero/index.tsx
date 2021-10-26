import * as React from 'react'
import { ColorProps } from 'styled-system'
import { Flex } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

type HeroProps = ColorProps & {
  image?: string
  caption?: string
  header?: string | null
  headerMargin?: string
  headerColor?: string
  isCategory?: boolean
}

const Hero: React.FC<HeroProps> = ({ image }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '450px' : '400px'}
      mr="16px"
      flexDirection="column"
      alignItems="center"
    >
      <Flex
        width="100vw"
        minHeight={isTabletOrMobile ? '400px' : '500px'}
        backgroundImage={`url(${image})`}
        backgroundPosition="center"
        backgroundSize={isTabletOrMobile ? 'contain' : 'cover'}
        backgroundRepeat="no-repeat"
      ></Flex>
    </Flex>
  )
}

export default Hero
