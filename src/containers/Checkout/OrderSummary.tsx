import * as React from 'react'
import { Grid, Flex, Image } from '@chakra-ui/core'
import { Text } from '../../typography'

import ReceiptProduct from './ReceiptProduct'

import { images, theme } from '../../theme'
import { ComponentLocationAddress, ComponentCartCartProduct } from '../../generated/graphql'
import { toSentenceCase } from '../../utils/toSentenceCase'

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
          Order Total
        </Text>
        <Flex justifySelf="end">
          <Text color={theme.colors.blueText} fontWeight={600}>{`${
            cartProducts && cartProducts[0]?.product?.currency
          } ${checkoutTotal}.00`}</Text>
        </Flex>
      </Grid>
      <Grid mb={5} borderTop={`1px dashed #acacac}`}>
        <Text mt={5} fontWeight={600} fontSize="1.4rem">{`Delivery Method`}</Text>
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
            you to arrange for delivery to the address.
          </Text>
        </Flex>
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
        <Text mt={5} fontWeight={600} fontSize="1.4rem">{`Delivery Point`}</Text>
        <Flex>
          <Text fontWeight={600}> Address name: </Text>
          <Text pl={2}>
            {selectedAddress?.name && toSentenceCase(selectedAddress?.name || '-')}
          </Text>
        </Flex>
        <Flex>
          <Text fontWeight={600}> Building/Complex: </Text>
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
