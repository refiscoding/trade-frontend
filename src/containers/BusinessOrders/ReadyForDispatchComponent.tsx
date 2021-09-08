import * as React from 'react'

import dayjs from 'dayjs'
import { Button, Flex, Grid, Link, useToast } from '@chakra-ui/core'
import { ChevronRight } from 'react-feather'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import RelativeTime from 'dayjs/plugin/relativeTime'

import { Order } from '../../generated/graphql'
import { SUCCESS_TOAST } from '../../constants/index'
import { Text } from '../../typography'
import { theme } from '../../theme'
import strapiHelpers from '../../utils/strapiHelpers'

dayjs.extend(LocalizedFormat)
dayjs.extend(RelativeTime)

type ReadyForDispatchComponentProps = {
  setSelectedOrder: (val: Order) => void
  order: Order
}

const ReadyForDispatchComponent: React.FC<ReadyForDispatchComponentProps> = ({
  setSelectedOrder,
  order
}) => {
  const toast = useToast()

  const handleOrderClicked = () => {
    setSelectedOrder(order)
  }

  return (
    <Grid
      borderRadius="4px"
      boxShadow="0.8px 2px 4px rgba(0,0,0,0.25)"
      backgroundColor="white"
      p={4}
      width="332px"
      margin="1rem"
    >
      <Flex borderBottom={`1px solid ${theme.colors.background}`} mb={2} pb={3}>
        <Text
          fontSize={16}
          fontWeight={600}
        >{`Order Ready For Dispatch - ${order?.orderNumber}`}</Text>
      </Flex>
      <Flex
        justify="space-between"
        borderBottom={`1px solid ${theme.colors.background}`}
        pt={2}
        pb={3}
        cursor="pointer"
        onClick={handleOrderClicked}
      >
        <Text fontSize={12} fontWeight={700}>
          Order information
        </Text>
        <ChevronRight />
      </Flex>
      <Flex justify="space-between" width="100%" flexDirection="column">
        <Flex mt={3} ml={3} width="90%">
          <Button
            type="submit"
            mt={4}
            width="95%"
            variantColor="brand"
            onClick={() => {
              toast({
                description: 'Order Dispatch Email Successfully Sent',
                ...SUCCESS_TOAST
              })
              return strapiHelpers.sendOrderDispatchEmail
            }}
          >
            <Text fontSize="12px">DISPATCH</Text>
          </Button>
        </Flex>
        <Flex flexDirection="column" mt={3} mb={3} width="100%" alignItems="center">
          <Text fontSize={12} fontWeight={700}>
            Something not right?{' '}
            <Link href="#" cursor="pointer">
              Contact Support
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Grid>
  )
}

export default ReadyForDispatchComponent
