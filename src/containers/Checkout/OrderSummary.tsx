import * as React from 'react'
import { Grid, Flex, Image } from '@chakra-ui/core'
import { Text } from '../../typography'

import ReceiptProduct from './ReceiptProduct'

import { timeSlots } from './dummyData'
import { images, theme } from '../../theme'
import { TimeSlot } from './AddressComponent'
import { ComponentLocationAddress, ComponentCartCartProduct } from '../../generated/graphql'

type OrderSummaryComponentProps = {
  cartProducts: ComponentCartCartProduct[]
  checkoutTotal: number
  mobileFlow: boolean
  selectedDeliveryTimeslot: string | undefined
  selectedDeliveryDate: Date | Date[]
  selectedAddress: ComponentLocationAddress | undefined
  setActiveStep: (step: number) => void
}

const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({
  cartProducts,
  checkoutTotal,
  mobileFlow,
  selectedDeliveryDate,
  selectedDeliveryTimeslot,
  selectedAddress,
  setActiveStep
}) => {
  const selectedTimeSlot = timeSlots?.filter(
    (slot: TimeSlot) => slot?.id === selectedDeliveryTimeslot
  )
  const selectedDate = selectedDeliveryDate?.toString()?.split('00:00:00')?.join('')

  const addressDetails = selectedAddress?.address?.split(',') ?? []
  const CTAStyles = { textDecoration: 'underline', cursor: 'pointer' }

  const handleChangeDeliveryDateTime = () => {
    if (mobileFlow) {
      setActiveStep(2)
    } else {
      setActiveStep(1)
    }
  }
  const handleChangeDeliveryAddress = () => {
    setActiveStep(0)
  }
  return (
    <Flex
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
      p={4}
      flexDirection="column"
    >
      <Text mb={5} fontWeight={600}>
        Order Summary
      </Text>
      <Grid
        p={2}
        rowGap="10px"
        height="300px"
        overflowY="scroll"
        cursor="pointer"
        alignContent="start"
        alignItems="start"
      >
        {cartProducts?.map((item: ComponentCartCartProduct, index: number) => {
          const { product, quantity } = item
          return (
            <ReceiptProduct
              key={`${index}_checkout_product`}
              mobileFlow={mobileFlow}
              product={product}
              quantity={quantity}
            />
          )
        })}
      </Grid>
      <Grid my={6} gridTemplateColumns="1fr 1fr">
        <Text color={theme.colors.blueText} fontWeight={600}>
          Order Total
        </Text>
        <Flex justifySelf="end">
          <Text color={theme.colors.blueText} fontWeight={600}>{`R ${checkoutTotal}.00`}</Text>
        </Flex>
      </Grid>
      <Grid mb={5} borderTop={`1px dashed #acacac}`}>
        <Text mt={5} fontWeight={600}>{`Delivery Method`}</Text>
        <Flex
          mt={3}
          mb={3}
          borderRadius={3}
          background={theme.colors.info}
          p={2}
          width="100%"
          height="100px"
          alignItems="center"
          justifyItems="space-between"
        >
          <Image src={images.infoIcon} height="30%" />
          <Text fontSize={12} ml={3}>
            Delivery is not included as part of your total. A TradeFed representative will contact
            you to arrange for delivery to the address and in the proposed date and time.
          </Text>
        </Flex>
        <Text mt={3} mb={2} fontWeight={600} fontSize={mobileFlow ? '14px' : ''}>
          Proposed Date
        </Text>
        <Text mb={3} fontSize={mobileFlow ? '14px' : ''}>
          {selectedDate}
        </Text>
        <Text mb={2} fontWeight={600} fontSize={mobileFlow ? '14px' : ''}>
          Proposed Time
        </Text>
        <Text
          mb={3}
          fontSize={mobileFlow ? '14px' : ''}
        >{`${selectedTimeSlot[0]?.startTime} - ${selectedTimeSlot[0]?.endTime}`}</Text>
        <Text
          onClick={handleChangeDeliveryDateTime}
          mt={3}
          style={CTAStyles}
          color={theme.colors.blueText}
          fontSize={12}
          fontWeight={600}
        >{`Change`}</Text>
      </Grid>
      <Grid mb={5} borderTop={`1px dashed #acacac}`}>
        <Text mt={5} fontWeight={600}>{`Delivery Point`}</Text>
        <Text mt={3}>{selectedAddress?.name}</Text>
        <Text>{addressDetails[1]}</Text>
        <Text>{addressDetails[2]}</Text>
        <Text mt={3}>{selectedAddress?.postalCode}</Text>
        <Text
          onClick={handleChangeDeliveryAddress}
          mt={3}
          style={CTAStyles}
          color={theme.colors.blueText}
          fontSize={12}
          fontWeight={600}
        >{`Change`}</Text>
      </Grid>
    </Flex>
  )
}
export default OrderSummaryComponent
