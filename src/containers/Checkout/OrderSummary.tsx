import * as React from 'react'
import { Grid, Flex } from '@chakra-ui/core'
import { Text } from '../../typography'
import { get } from 'lodash'

import ReceiptProduct from './ReceiptProduct'

import { theme } from '../../theme'
import {
  ComponentLocationAddress,
  ComponentCartCartProduct,
  Quotation
} from '../../generated/graphql'
import { toSentenceCase } from '../../utils/toSentenceCase'

type OrderSummaryComponentProps = {
  cartProducts: ComponentCartCartProduct[]
  checkoutTotal: number
  mobileFlow: boolean
  selectedAddress: ComponentLocationAddress | undefined
  setActiveStep: (step: number) => void
  deliveryQuotation?: Quotation[]
}

const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({
  cartProducts,
  checkoutTotal,
  mobileFlow,
  selectedAddress,
  deliveryQuotation
}) => {
  const deliveryTotals = deliveryQuotation?.map((delivery: Quotation) => {
    const GrandTotal = get(delivery, 'ResultSets[0][0].GrandTotal', null)
    return GrandTotal
  })

  const deliverySubTotal = deliveryTotals
    ?.reduce((total, val) => total + val, 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const orderTotal =
    parseInt(deliverySubTotal) +
    parseInt(checkoutTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))

  return (
    <Flex
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
      p={4}
      flexDirection="column"
    >
      <Text mb={5} fontWeight={600} fontSize="1.4rem">
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
          } ${checkoutTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
        </Flex>
      </Grid>
      <Grid mb={5} borderTop={`1px dashed #acacac}`}>
        <Text mt={5} mb={5} fontWeight={600} fontSize="1.4rem">{`Delivery Point`}</Text>
        <Flex>
          <Text fontWeight={600}> Address name: </Text>
          <Text pl={2}>
            {selectedAddress?.name && toSentenceCase(selectedAddress?.name || '-')}
          </Text>
        </Flex>
        <Flex>
          <Text fontWeight={600}> Building: </Text>
          <Text pl={2}>
            {(selectedAddress?.building && toSentenceCase(selectedAddress?.building || '-')) || '-'}
          </Text>
        </Flex>
        <Flex>
          <Text fontWeight={600}> Street: </Text>
          <Text pl={2}>
            {(selectedAddress?.street && toSentenceCase(selectedAddress?.street || '-')) || '-'}
          </Text>
        </Flex>
        <Flex>
          <Text fontWeight={600}> Province: </Text>
          <Text pl={2}>
            {selectedAddress?.province && toSentenceCase(selectedAddress?.province || '-')}
          </Text>
        </Flex>
        <Flex>
          <Text fontWeight={600}> City: </Text>
          <Text pl={2}>
            {selectedAddress?.city && toSentenceCase(selectedAddress?.city || '-')}
          </Text>
        </Flex>
        <Flex>
          <Text fontWeight={600}> Postal Code: </Text>
          <Text pl={2}>
            {selectedAddress?.postalCode && toSentenceCase(selectedAddress?.postalCode || '-')}
          </Text>
        </Flex>
      </Grid>
      <Grid my={3} gridTemplateColumns="1fr 1fr">
        <Text color={theme.colors.blueText} fontWeight={600}>
          Delivery Subtotal
        </Text>
        <Flex justifySelf="end">
          <Text color={theme.colors.blueText} fontWeight={600}>{`${
            cartProducts && cartProducts[0]?.product?.currency
          } ${deliveryTotals
            ?.reduce((total, val) => total + val, 0)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</Text>
        </Flex>
      </Grid>
      <Grid my={3} gridTemplateColumns="1fr 1fr">
        <Text color={theme.colors.blueText} fontWeight={600}>
          Total
        </Text>
        <Flex justifySelf="end">
          <Text color={theme.colors.blueText} fontWeight={600}>{`${
            cartProducts && cartProducts[0]?.product?.currency
          } ${'orderTotal'}`}</Text>
        </Flex>
      </Grid>
    </Flex>
  )
}
export default OrderSummaryComponent
