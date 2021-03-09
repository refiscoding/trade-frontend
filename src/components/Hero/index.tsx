import { Flex } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { Text } from '../../typography'

type HeroProps = ColorProps & {
  image?: string
  caption?: string
  header?: string | null
  imageUrl?: boolean
  headerMargin?: string
  headerColor?: string
}

const Hero: React.FC<HeroProps> = ({ image, caption, headerColor, headerMargin, imageUrl, header }) => {
  const imageLink = imageUrl ? `${process.env.REACT_APP_API_HOST}${image}` : image
  return (
    <Flex
      width="100vw"
      minHeight="200px"
      flexDirection="column"
      alignItems="center"
      backgroundImage={`url(${imageLink})`}
      backgroundPosition="center"
      backgroundSize="contain"
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
