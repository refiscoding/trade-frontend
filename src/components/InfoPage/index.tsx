import * as React from 'react'
import { Button, Flex, Image, CircularProgress } from '@chakra-ui/core'
import { ColorProps } from 'styled-system'
import { useMediaQuery } from 'react-responsive'

import { images, theme } from '../../theme'
import { H3 } from '../../typography'

type InfoPageProps = ColorProps & {
  hasLogo?: boolean
  loading?: boolean
  image: string
  caption: string
  header: string
  action?: () => void
  actionText?: string
  smallIcon?: boolean
}

const InfoPage: React.FC<InfoPageProps> = ({
  image,
  action,
  header,
  hasLogo,
  loading,
  smallIcon,
  caption,
  actionText
}) => {
  const isWebViewport = useMediaQuery({
    query: '(min-width: 40em)'
  })
  const logoWidth = isWebViewport ? '35%' : '80%'
  const ctaButtonWidth = isWebViewport ? '35%' : '100%'
  const ctaButtonMargin = isWebViewport ? '1em' : '0'
  const imageHeight = isWebViewport ? '40vh' : '55vh'
  return (
    <Flex width="100%" align="center" justify="center" flexDirection="column">
      {hasLogo && <Image mr={5} width={logoWidth} height="auto" src={images['TFLogo']} />}
      <Image mr={5} width={smallIcon ? '40%' : '80%'} height={imageHeight} src={image} />
      <Flex width="80%" mb={2} mt={4} align="center" justify="center" flexDirection="column">
        <H3 fontSize="20px" fontWeight={600}>
          {header}
        </H3>
        <Flex mt={3} maxWidth={550} wordBreak="break-word">
          {caption}
        </Flex>
      </Flex>
      {action && !loading && (
        <Button
          onClick={action}
          mt={4}
          width={ctaButtonWidth}
          ml={ctaButtonMargin}
          type="submit"
          variantColor="brand"
        >
          {actionText}
        </Button>
      )}
      {action && loading && <CircularProgress isIndeterminate color={theme.colors.brand[500]} />}
    </Flex>
  )
}

export default InfoPage
