import { Flex, Text } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { useMediaQuery } from 'react-responsive'

type HeroProps = ColorProps & {
  image?: string
  caption?: string
  header?: string | null
  headerMargin?: string
  headerColor?: string
  isCategory?: boolean
}

const Hero: React.FC<HeroProps> = ({ image, isCategory }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '200px' : isCategory ? '450px' : '380px'}
      justifyContent={isCategory ? 'center' : 'flex-start'}
      mr="16px"
      flexDirection="column"
      alignItems="center"
    >
      <Flex
        width="100vw"
        minHeight={isTabletOrMobile ? '200px' : isCategory ? '450px' : '400px'}
        backgroundImage={`url(${image})`}
        backgroundPosition="center"
        backgroundSize={isTabletOrMobile && !isCategory ? 'contain' : 'contain'}
        backgroundRepeat="no-repeat"
      ></Flex>
    </Flex>
  )
}

export default Hero
