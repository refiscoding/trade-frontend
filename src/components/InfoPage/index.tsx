import * as React from 'react'
import { Button, Flex, Image } from '@chakra-ui/core'
import { ColorProps } from 'styled-system'
import { useMediaQuery } from "react-responsive";

import { images } from '../../theme'
import { H3, Text } from '../../typography'

type InfoPageProps = ColorProps & {
  hasLogo?: boolean
  image: string
  caption: string
  header: string
  action?: () => void
  actionText?: string
}

const InfoPage: React.FC<InfoPageProps> = ({
  hasLogo,
  image,
  caption,
  header,
  action,
  actionText
}) => {
  const isWebViewport = useMediaQuery({
    query: "(min-width: 40em)"
  });
  const logoWidth = isWebViewport ? "35%" : "80%";
  const ctaButtonWidth = isWebViewport ? "35%" : "100%";
  const ctaButtonMargin = isWebViewport ? "1em" : "0";
  const imageHeight = isWebViewport ? "40vh" : "55vh";
  return (
    <Flex width="100%" align="center" justify="center" flexDirection="column">
      {hasLogo && <Image mr={5} width={logoWidth} height="auto" src={images['TradeFedFullLogo']} />}
      <Image mr={5} width="80%" height={imageHeight} src={image} />
      <Flex width="80%" mb={2} mt={4} align="center" justify="center" flexDirection="column">
        <H3 fontSize="20px" fontWeight={600}>
          {header}
        </H3>
        <Text mt={4} fontSize="14px" textAlign="center">
          {caption}
        </Text>
      </Flex>
      {action && (
        <Button onClick={action} mt={4} width={ctaButtonWidth} ml={ctaButtonMargin} type="submit" variantColor="brand">
          {actionText}
        </Button>
      )}
    </Flex>
  )
}

export default InfoPage
