import { Flex, Image } from '@chakra-ui/core'
import * as React from 'react'
import { ColorProps } from 'styled-system'
import { images } from '../../theme'
import { H3, Text } from '../../typography'

type InfoPageProps = ColorProps & {
  hasLogo?: boolean
  image: string
  caption: string
  header: string
}

const InfoPage: React.FC<InfoPageProps> = ({ hasLogo, image, caption, header }) => {
  return (
    <Flex width="100%" align="center" justify="center" flexDirection="column">
      {hasLogo && <Image mr={5} width="80%" height="auto" src={images['TradeFedFullLogo']} />}
      <Image mr={5} width="80%" height="60vh" src={image} />
      <Flex width="80%" mb={2} mt={4} align="center" justify="center" flexDirection="column">
        <H3 fontSize="20px" fontWeight={500}>
          {header}
        </H3>
        <Text mt={4} fontSize="14px" textAlign="center">
          {caption}
        </Text>
      </Flex>
    </Flex>
  )
}

export default InfoPage
