import { Flex } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { Text } from '../../typography'

type HeroProps = ColorProps & {
  image: string
  caption: string
  header: string
}

const Hero: React.FC<HeroProps> = ({ image, caption, header }) => {
  return (
    <Flex
      width="100vw"
      minHeight="200px"
      flexDirection="column"
      alignItems="center"
      backgroundImage={`url(${image})`}
      backgroundPosition="center"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      my={2}
      ml="-1rem"
      pt="3rem"
    >
      <Text fontWeight={600} fontSize={20}>
        {header}
      </Text>
      <Text>{caption}</Text>
    </Flex>
  )
}

export default Hero
