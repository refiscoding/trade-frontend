import * as React from 'react'

import { get } from 'lodash'
import { Grid, Flex, Tag } from '@chakra-ui/core'

import { Text } from '../../typography'
import { theme } from '../../theme'
import { ComponentOrdersOrder, Maybe } from '../../generated/graphql'

type OrderItemComponentProps = {
  cartItem: Maybe<ComponentOrdersOrder>
}

const OrderItemComponent: React.FC<OrderItemComponentProps> = ({ cartItem }) => {
  const itemToUse = cartItem?.product
  const price = get(itemToUse, 'tradeFedCost')
  const name = get(itemToUse, 'name')
  const currency = get(itemToUse, 'currency')
  const quantity = get(cartItem, 'quantity') ?? 1
  const total = price && price * quantity

  return (
    <Grid borderBottom={`1px solid ${theme.colors.background}`} height="90px">
      <Grid gridTemplateColumns="1fr 1fr">
        <Flex>
          <Text fontWeight={600} fontSize={12}>
            {name}
          </Text>
          <Tag
            alignSelf="start"
            justifySelf="start"
            fontSize={11}
            ml={2}
            size="sm"
            background="#c9cfd4"
          >
            {quantity}
          </Tag>
        </Flex>
        <Flex justifySelf="end">
          <Text fontWeight={600} fontSize={14}>{`${currency} ${total}.00`}</Text>
        </Flex>
      </Grid>
    </Grid>
  )
}

export default OrderItemComponent
