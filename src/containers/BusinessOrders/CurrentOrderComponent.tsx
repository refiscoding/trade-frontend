import * as React from 'react'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import ProgressBar from '@ramonak/react-progress-bar'
import { Flex, Grid, Image } from '@chakra-ui/core'

import { Text } from '../../typography'
import { images, theme } from '../../theme'
import { Order } from '../../generated/graphql'

dayjs.extend(RelativeTime)
dayjs.extend(LocalizedFormat)

type CurrentOrderComponentProps = {
  order: Order
  setSelectedOrder: (val: Order) => void
}

const CurrentOrderComponent: React.FC<CurrentOrderComponentProps> = ({
  order,
  setSelectedOrder
}) => {
  const handleOrderClicked = () => {
    setSelectedOrder(order)
  }

  return (
    <Flex>
      <Grid
        borderRadius="4px"
        boxShadow="0.8px 2px 4px rgba(0,0,0,0.25)"
        backgroundColor="white"
        p={2}
        margin="0.5rem"
      >
        <Flex borderBottom={`1px solid ${theme.colors.background}`}>
          <Flex p={2}>
            <Image height="70%" style={{ placeSelf: 'center' }} src={images.parcel} />
          </Flex>
          <Flex flexDirection="column" pt={2} pl={4}>
            <Text fontSize={12} pb={2} pt={4} fontWeight={800}>
              Order: {order?.orderNumber}
            </Text>
            <Text fontSize={12} pb={2}>{`Quantity: ${order.items?.length}`}</Text>
            <Text fontSize={12} pb={2}>{`Order date: ${dayjs(order?.orderDate).format(
              'DD.MM.YYYY'
            )}`}</Text>
            <Text fontSize={15} pt={2} fontWeight={800}>
              {`R ${order?.orderTotal}`}
            </Text>
          </Flex>
        </Flex>
        <Flex
          justify="space-between"
          width="100%"
          flexDirection="column"
          cursor="pointer"
          p={2}
          onClick={handleOrderClicked}
        >
          {order?.businessOrderStatus === 'CONFIRMATION' && (
            <>
              <Flex pb={2}>
                <Text fontSize={14} fontWeight={600}>
                  Parcel being processed
                </Text>
              </Flex>
              <ProgressBar
                width="100%"
                completed={25}
                borderRadius="4px"
                bgColor="#3acf2f"
                baseBgColor="#e7e7e7"
                labelColor="transparent"
              />
            </>
          )}
          {order?.businessOrderStatus === 'PROCESSING' && (
            <>
              <Flex pb={2}>
                <Text fontSize={14} fontWeight={600}>
                  Parcel Picked & Packed
                </Text>
              </Flex>
              <ProgressBar
                width="100%"
                completed={50}
                borderRadius="4px"
                bgColor="#3acf2f"
                baseBgColor="#e7e7e7"
                labelColor="transparent"
              />
            </>
          )}
          {order?.businessOrderStatus === 'READY' && (
            <>
              <Flex pb={2}>
                <Text fontSize={14} fontWeight={600}>
                  Parcel Out For Delivery
                </Text>
              </Flex>
              <ProgressBar
                width="100%"
                completed={75}
                borderRadius="4px"
                bgColor="#3acf2f"
                baseBgColor="#e7e7e7"
                labelColor="transparent"
              />
            </>
          )}
          {order?.businessOrderStatus === 'DISPATCHED' && (
            <>
              <Flex pb={2}>
                <Text fontSize={14} fontWeight={600}>
                  Delivered
                </Text>
              </Flex>
              <ProgressBar
                width="100%"
                completed={100}
                borderRadius="4px"
                bgColor="#3acf2f"
                baseBgColor="#e7e7e7"
                labelColor="transparent"
              />
            </>
          )}
        </Flex>
      </Grid>
    </Flex>
  )
}

export default CurrentOrderComponent
