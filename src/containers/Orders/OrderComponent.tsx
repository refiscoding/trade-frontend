import * as React from 'react'

import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import { ChevronRight } from 'react-feather'
import { Flex, Grid, Image, Tag } from '@chakra-ui/core'

import setOrderStatusAndColor from './setOrderStatusAndColor'

import { Text } from '../../typography'
import { theme, images } from '../../theme'
import { Order } from '../../generated/graphql'

dayjs.extend(RelativeTime)
dayjs.extend(LocalizedFormat)

type OrderComponentProps = {
  setSelectedOrder: (val: Order) => void
  order: Order
}

const OrderComponent: React.FC<OrderComponentProps> = ({ setSelectedOrder, order }) => {
  const handleOrderClicked = () => {
    setSelectedOrder(order)
  }
  const orderStatusAndColor = setOrderStatusAndColor(order)

  return (
    <Grid
      borderRadius="10px"
      boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
      backgroundColor="white"
      p={4}
      height="200px"
      width="350px"
      mt={5}
      cursor="pointer"
      onClick={handleOrderClicked}
    >
      <Flex
        justify="space-between"
        borderBottom={`1px solid ${theme.colors.background}`}
        ml={-8}
        mb={2}
        width="364px"
        pl={6}
        pb={3}
      >
        <Text fontSize={14} fontWeight={600}>{`Order# ${order?.orderNumber}`}</Text>
        <Flex alignSelf="start">
          <Tag
            fontSize={12}
            mr={1}
            size="sm"
            background={orderStatusAndColor?.colors?.background}
            color={orderStatusAndColor?.colors?.color}
          >
            {orderStatusAndColor?.status?.toUpperCase()}
          </Tag>
        </Flex>
        <ChevronRight />
      </Flex>
      {order?.signatory && (
        <Flex mb={3}>
          <Text
            fontSize={12}
          >{`Signed by: ${order?.signatory?.name} (${order?.signatory?.relation})`}</Text>
        </Flex>
      )}
      <Flex justify="space-between" width="100%">
        <Flex mt={3} ml={3} width="70%">
          <Image height="50%" src={images.parcel} />
        </Flex>
        <Flex flexDirection="column" mt={3} width="100%" justifySelf="start">
          <Text fontSize={14}>{order?.deliveryAddress?.name}</Text>
          <Text fontSize={14}>{order?.deliveryAddress?.province}</Text>
          <Text fontSize={14}>{order?.deliveryAddress?.postalCode}</Text>
        </Flex>
      </Flex>
    </Grid>
  )
}

export default OrderComponent
