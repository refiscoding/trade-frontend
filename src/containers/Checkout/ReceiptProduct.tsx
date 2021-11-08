import * as React from 'react'

import { Grid, Flex, Tag, Image } from '@chakra-ui/core'
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
          <Image width="70px" height="60px" src={product?.coverImage?.url || ''} />
          <Grid gridTemplateRows="1fr 2fr">
            <Text ml={5} fontWeight={600} fontSize={14}>
              {product?.name}
            </Text>
            <Text ml={5} fontWeight={600} fontSize={14}>{`${
              product?.currency
            } ${(product?.tradeFedCost
              ? product?.tradeFedCost * (quantity || 1)
              : product?.tradeFedCost
            )
              ?.toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
          </Grid>
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
          <Text fontWeight={600} fontSize={14}>{`${product?.currency} ${(product?.tradeFedCost
            ? product?.tradeFedCost * (quantity || 1)
            : product?.tradeFedCost
          )
            ?.toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
        </Flex>
      </Grid>
    </Flex>
  )
}

export default ReceiptProductComponent
