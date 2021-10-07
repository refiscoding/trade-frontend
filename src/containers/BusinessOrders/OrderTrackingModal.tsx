import * as React from 'react'
import { ApolloError } from 'apollo-boost'
import { get } from 'lodash'
import { Image, Grid, useToast, Spinner } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { ERROR_TOAST } from '../../constants'
import { images } from '../../theme'
import { Text } from '../../typography'
import { useFetchTrackingQuery } from '../../generated/graphql'
import ModalWrap from '../../components/ModalWrap'

type OrderTrackingProps = FlexProps & {
  handleCancelButtonClicked: () => void
  waybill: string
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ handleCancelButtonClicked, waybill }) => {
  const toast = useToast()

  const { data, loading } = useFetchTrackingQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    variables: { waybill: waybill }
  })

  const trackingResult = get(data, 'getTracking')
  const trackingData = trackingResult?.ResultSets?.[0]?.length
  console.log('trackingData', trackingData)
  return (
    <ModalWrap
      title="Order Delivery Status"
      isOpen={true}
      onClose={handleCancelButtonClicked}
      isCentered
    >
      <Grid gridTemplateRows="repeat(1fr, 2)" justifyItems="center" padding={5}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Image src={images?.orderTracking} />
            <Text mt={4} fontSize="14px" textAlign="center">
              {trackingData === 0
                ? `Order #${waybill} has dispatched and yet to be collected by courier`
                : `Order #${waybill} has been dispatched and is `}
            </Text>
          </>
        )}
      </Grid>
    </ModalWrap>
  )
}

export default OrderTracking
