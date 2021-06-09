import * as React from 'react'

import { useMediaQuery } from 'react-responsive'
import { Flex, Image, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { images } from '../../../theme'

type ProductManagementCardProps = FlexProps & {
  title: string
  caption: string
}

const ProductManagementCard: React.FC<ProductManagementCardProps> = ({ title, caption }) => {
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })
  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const mobileCardWidth = isTinyPhone
    ? '320px'
    : isSmallPhone
    ? '350px'
    : isTabletOrMobile
    ? '400px'
    : '600px'
  const mobileCardHeight = isTinyPhone ? '320px' : isSmallPhone ? '290px' : '270px'

  return (
    <Flex
      flexDirection="column"
      minWidth={mobileCardWidth}
      height={mobileCardHeight}
      bg="white"
      boxShadow="0 2px 4px 0 rgba(0,0,0,0.1)"
      borderRadius="8px"
      my={2}
    >
      <Text m="15px" fontWeight={600} fontSize="14px">
        {title}
      </Text>
      <Flex width="100%" flexDirection="column" alignItems="center" margin="auto">
        <Image width="70px" height="auto" src={images.filesIcon} />
        <Text fontSize="12px">{caption}</Text>
      </Flex>
    </Flex>
  )
}

export default ProductManagementCard
