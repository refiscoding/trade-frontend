import { Flex, Image, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import * as React from 'react'
import { images } from '../../../theme'

type ProductManagementCardProps = FlexProps & {
  title: string
  caption: string
}

const ProductManagementCard: React.FC<ProductManagementCardProps> = ({ title, caption }) => {
  return (
    <Flex
      flexDirection="column"
      width="330px"
      height="185px"
      bg="white"
      boxShadow="0 2px 4px 0 rgba(0,0,0,0.1)"
      borderRadius="8px"
      my={2}
    >
      <Text m="15px" fontWeight={600} fontSize="14px">
        {title}
      </Text>
      <Flex width="100%" flexDirection="column" alignItems="center">
        <Image m={2} width="70px" height="auto" src={images.filesIcon} />
        <Text fontSize="12px">{caption}</Text>
      </Flex>
    </Flex>
  )
}

export default ProductManagementCard
