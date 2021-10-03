import * as React from 'react'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { ChevronRight } from 'react-feather'
import { Flex, Grid } from '@chakra-ui/core'

import { Text } from '../../typography'
import { theme } from '../../theme'
import { Order } from '../../generated/graphql'

dayjs.extend(RelativeTime)
dayjs.extend(LocalizedFormat)

type BusinessOrderConfirmationComponentProps = {
  order: Order
  setSelectedOrder: (val: Order) => void
}

const BusinessOrderConfirmationComponent: React.FC<BusinessOrderConfirmationComponentProps> = ({
  order,
  setSelectedOrder
}) => {
  const handleOrderClicked = () => {
    setSelectedOrder(order)
  }
  console.log('order', order)

  return (
    <Flex>
      <Grid
        borderRadius="4px"
        boxShadow="0.8px 2px 4px rgba(0,0,0,0.25)"
        backgroundColor="white"
        p={4}
        width="332px"
        margin="1rem"
      >
        <Flex borderBottom={`1px solid ${theme.colors.background}`} mb={2} pb={3}>
          <Text fontSize={16} fontWeight={600}>{`Confirm Order - ${order?.orderNumber}`}</Text>
        </Flex>
        <Flex justify="space-between" pt={2} pb={3} cursor="pointer" onClick={handleOrderClicked}>
          <Text fontSize={12} fontWeight={700}>
            Order information
          </Text>
          <ChevronRight />
        </Flex>
      </Grid>
    </Flex>
  )
}

export default BusinessOrderConfirmationComponent
