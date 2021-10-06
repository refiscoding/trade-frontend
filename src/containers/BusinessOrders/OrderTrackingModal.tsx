import * as React from 'react'

import { Image, Grid } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { images } from '../../theme'
import ModalWrap from '../../components/ModalWrap'
import { Text } from '../../typography'

type OrderTrackingProps = FlexProps & {
  handleCancelButtonClicked: () => void
  trackingText: string
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  trackingText,
  handleCancelButtonClicked
}) => {
  return (
    <ModalWrap
      title="Order Delivery Status"
      isOpen={true}
      onClose={handleCancelButtonClicked}
      isCentered
    >
      <Grid gridTemplateRows="repeat(1fr, 2)" justifyItems="center" padding={5}>
        <Image src={images?.orderTracking} />
        <Text mt={4} fontSize="14px" textAlign="center">
          {trackingText}
        </Text>
      </Grid>
    </ModalWrap>
  )
}

export default OrderTracking
