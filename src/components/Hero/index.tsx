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

const Hero: React.FC<HeroProps> = ({
  image,
  caption,
  isCategory,
  headerColor,
  headerMargin,
  header
}) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="1450px"
      minHeight={isTabletOrMobile ? '200px' : isCategory ? '450px' : '400px'}
      bg={isCategory ? 'rgba(0,0,0,0.2)' : '#231F20'}
      justifyContent={isCategory ? 'center' : 'flex-start'}
      mr="10px"
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
        my={2}
        ml="-1rem"
      >
        <Text fontWeight={600} fontSize={20} mt={headerMargin} color={headerColor}>
          {header}
        </Text>
        <Text>{caption}</Text>
      </Flex>
    </Flex>
  )
}

export default Hero
