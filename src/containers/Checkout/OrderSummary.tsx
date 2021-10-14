import * as React from 'react'
import { Grid, Flex, Image } from '@chakra-ui/core'
import { Text } from '../../typography'

import ReceiptProduct from './ReceiptProduct'

import { images, theme } from '../../theme'
import { ComponentLocationAddress, ComponentCartCartProduct } from '../../generated/graphql'

type OrderSummaryComponentProps = {
  cartProducts: ComponentCartCartProduct[]
  checkoutTotal: number
  mobileFlow: boolean
  selectedAddress: ComponentLocationAddress | undefined
  setActiveStep: (step: number) => void
}

const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({
  cartProducts,
  checkoutTotal,
  mobileFlow,
  selectedAddress,
  setActiveStep
}) => {
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
          Order Subtotal
        </Text>
        <Flex justifySelf="end">
          <Text color={theme.colors.blueText} fontWeight={600}>{`${
            cartProducts && cartProducts[0]?.product?.currency
          } ${checkoutTotal}.00`}</Text>
        </Flex>
      </Grid>
      <Grid mb={5} borderTop={`1px dashed #acacac}`}>
        <Text mt={5} fontWeight={600}>{`Delivery Point`}</Text>
        <Text mt={3}>{selectedAddress?.name || '-'}</Text>
        <Text>{selectedAddress?.province || '-'}</Text>
        <Text>{selectedAddress?.city || '-'}</Text>
        <Text mt={3}>{selectedAddress?.postalCode || '-'}</Text>
      </Grid>
      <Grid my={6} gridTemplateColumns="1fr 1fr">
        <Text color={theme.colors.blueText} fontWeight={600}>
          Delivery Subtotal
        </Text>
        <Flex justifySelf="end">
          <Text color={theme.colors.blueText} fontWeight={600}>{`${
            cartProducts && cartProducts[0]?.product?.currency
          } ${checkoutTotal}.00`}</Text>
        </Flex>
      </Grid>
      <Grid my={6} gridTemplateColumns="1fr 1fr">
        <Text color={theme.colors.blueText} fontWeight={600}>
          Total
        </Text>
        <Flex justifySelf="end">
          <Text color={theme.colors.blueText} fontWeight={600}>{`${
            cartProducts && cartProducts[0]?.product?.currency
          } ${checkoutTotal}.00`}</Text>
        </Flex>
      </Grid>
    </Flex>
  )
}
export default OrderSummaryComponent
