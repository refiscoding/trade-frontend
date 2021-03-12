import { Flex } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { Text } from '../../typography'
import { useMediaQuery } from 'react-responsive'

type HeroProps = ColorProps & {
  image?: string
  caption?: string
  header?: string | null
  headerMargin?: string
  headerColor?: string
}

const Hero: React.FC<HeroProps> = ({ image, caption, headerColor, headerMargin, header }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Flex
      width="100vw"
      minHeight={isTabletOrMobile ? '200px' : '400px'}
      flexDirection="column"
      alignItems="center"
      backgroundImage={`url(${image})`}
      backgroundPosition="center"
      backgroundSize={isTabletOrMobile ? 'contain' : 'cover'}
      backgroundRepeat="no-repeat"
      my={2}
      ml="-1rem"
      pt="3rem"
    >
      <Text fontWeight={600} fontSize={20} mt={headerMargin} color={headerColor}>
        {header}
      </Text>
      <Text>{caption}</Text>
    </Flex>
  )
}

export default Hero
