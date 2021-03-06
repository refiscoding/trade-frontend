import * as React from 'react'

import { Grid, Flex } from '@chakra-ui/core'

import OrderItem from './Item'

import { Text } from '../../typography'
import { theme } from '../../theme'
import { Maybe, ComponentOrdersOrder } from '../../generated/graphql'

type OrderItemsSummaryComponentProps = {
  items: Maybe<Maybe<ComponentOrdersOrder>[]> | undefined
  isMobile: boolean
  total: Maybe<number> | undefined
}
const OrderSummaryComponent: React.FC<OrderItemsSummaryComponentProps> = ({
  total,
  items,
  isMobile
}) => {
  return (
    <Grid
      border={`1px solid ${theme.colors.background}`}
      borderRadius={5}
      p={4}
      flexDirection="column"
      width="100%"
      background={isMobile ? theme.colors.accent[50] : ''}
      boxShadow={isMobile ? '0 2px 4px 0 rgba(0,0,0,0.25)' : ''}
      mt={isMobile ? 5 : 0}
      mb={isMobile ? 5 : 0}
    >
      <Text fontWeight={600}>Order Summary</Text>
      <Grid p={2} rowGap="10px" overflowY="scroll" cursor="pointer">
        {items?.map((item: Maybe<ComponentOrdersOrder>, index: number) => {
          return <OrderItem key={`${index}_order_item`} cartItem={item} />
        })}
      </Grid>
      <Grid alignSelf="end" gridTemplateColumns="1fr 1fr">
        <Text fontWeight={600}>Order Total</Text>
        <Flex justifySelf="end">
          <Text fontWeight={600}>
            {`${items && items[0]?.product?.currency} ${total
              ?.toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
          </Text>
        </Flex>
      </Grid>
    </Grid>
  )
}
export default OrderSummaryComponent
