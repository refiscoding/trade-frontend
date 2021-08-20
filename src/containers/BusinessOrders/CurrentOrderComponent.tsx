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
        p={4}
        width="332px"
        margin="1rem"
      >
        <Flex borderBottom={`1px solid ${theme.colors.background}`} mb={2} pb={3}>
          <Flex p={2}>
            <Image height="80%" style={{ placeSelf: 'center' }} src={images.parcel} />
          </Flex>
          <Flex flexDirection="column">
            <Text fontSize={12} fontWeight={600}>
              Mathias' Parcel
            </Text>
            <Text fontSize={12}>{`Quantity: ${order.items?.length}`}</Text>
            <Text fontSize={12}>{`Order date: ${dayjs(order?.orderDate).format(
              'DD.MM.YYYY'
            )}`}</Text>
            <Text fontSize={14} fontWeight={600}>
              {`R ${order?.orderTotal}`}
            </Text>
          </Flex>
        </Flex>
        <Flex
          justify="space-between"
          width="100%"
          flexDirection="column"
          cursor="pointer"
          onClick={handleOrderClicked}
        >
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
        </Flex>
      </Grid>
    </Flex>
  )
}

export default CurrentOrderComponent
