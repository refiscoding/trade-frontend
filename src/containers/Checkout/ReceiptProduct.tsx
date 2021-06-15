import * as React from 'react'

import { Grid, Flex, Tag } from '@chakra-ui/core'
import { Text } from '../../typography'
import { theme } from '../../theme'

import { Product, Maybe } from '../../generated/graphql'

type ReceiptProductComponentProps = {
  product: Maybe<Product> | undefined
  quantity: Maybe<number> | undefined
  mobileFlow: boolean
}

const ReceiptProductComponent: React.FC<ReceiptProductComponentProps> = ({
  product,
  quantity,
  mobileFlow
}) => {
  return (
    <Flex height="70px" alignSelf="start" borderBottom={`1px solid ${theme.colors.background}`}>
      <Grid width="100%" gridTemplateColumns="50% 50%" justifyContent="space-between">
        <Flex justifySelf="start">
          <Text fontWeight={600} fontSize={14}>
            {product?.name}
          </Text>
          <Tag
            height="40%"
            justifySelf="start"
            alignSelf="start"
            fontSize={11}
            ml={2}
            size="sm"
            background="#B6DAF5"
            color="#004A81"
          >
            {quantity}
          </Tag>
        </Flex>
        <Flex justifySelf="end">
          <Text fontWeight={600} fontSize={14}>{`${product?.currency} ${
            product?.tradeFedCost ? product?.tradeFedCost * (quantity || 1) : product?.tradeFedCost
          }.00`}</Text>
        </Flex>
      </Grid>
    </Flex>
  )
}

export default ReceiptProductComponent
