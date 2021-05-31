import * as React from 'react'
import styled from '@emotion/styled'

import { Form, Formik } from 'formik'
import { useHistory } from 'react-router'
import { Flex, Grid, Tag, Spinner } from '@chakra-ui/core'

import NextButton from './Button'
import NoData from './NoDataScreen'
import OrderSummary from './OrderSummary'
import DeliveryAddresses from './Addresses'
import SelectPayment from './SelectPayment'
import DeliveryDetails from './DeliveryDetails'
import DeliveryAddressForm from './DeliveryAddressForm'
import ProductCard from '../../components/Card/ProductCard'
import DeleteItemsModal from '../../components/DeleteItemsModal'


import { theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { H3, Text } from '../../typography'
import { mapsScriptUrl } from '../../constants'
import { CheckoutProps, initialDeliveryAddressValues, DeliveryAddressValidation } from '.'
import CheckoutSignatoryModal from './CheckoutSignatoryModal'
import { ComponentCartCartProduct } from '../../generated/graphql'

const StepperContainer = styled.div`
  margin-top: 15px;
`
const Step = styled.div``

const CheckoutFlowWeb: React.FC<CheckoutProps> = ({
  active,
  cards,
  addresses,
  timeSlots,
  handlePay,
  cartProducts,
  checkoutTotal,
  setActiveStep,
  selectedAddress,
  noCardDataHeader,
  noCardDataCaption,
  setSelectedAddress,
  createOrderLoading,
  noAddressDataHeader,
  showDeleteCardModal,
  noAddressDataCaption,
  confirmationTextCard,
  setShowDeleteCardModal,
  confirmationTextAddress,
  selectedDeliveryDate,
  setShowDeleteItemsModal,
  setSelectedDeliveryDate,
  selectedDeliveryTimeslot,
  showCheckoutSignatoryModal,
  setSelectedDeliveryTimeslot,
  setShowCheckoutSignatoryModal,
}) => {
  const history = useHistory()
  const numberOfAddresses = addresses?.length
  const numberOfCards = cards?.length
  const cancelButtonStyles = { textDecoration: 'underline', cursor: 'pointer' }
  const deliveryAddressInfoStage = active === 0
  const deliveryDetailsStage = active === 1
  const confirmOrderStage = active === 2
  const confirmPaymentCardStage = active === 3

  const [nextClicked, setNextClicked] = React.useState<boolean | undefined>()

  const handleCancelButtonClicked = () => {
    history.push('/cart')
  }
  const setShowPaymentsOption = () => { }

  return (
    <PageWrap
      title="Checkout"
      alignSelf="center"
      width="75%"
      mt={20}
      pt={0}
      p={0}
      script={mapsScriptUrl}
    >
      {showDeleteCardModal && (
        <DeleteItemsModal
          confirmationText={confirmationTextCard}
          handleCancelButtonClicked={() => { }}
          handleDeleteButtonClicked={() => { }}
        />
      )}
      {showCheckoutSignatoryModal && (
        <CheckoutSignatoryModal
          setShowCheckoutModal={setShowCheckoutSignatoryModal}
        />
      )}
      <Grid gridTemplateRows="130px 1fr">
        <Grid
          p={5}
          mt={5}
          width="76vw"
          borderRadius={5}
          background={theme.colors.accent[50]}
          boxShadow={theme.boxShadowMedium}
        >
          <Grid gridTemplateRows="20px 45px">
            <Flex justify="space-between">
              <H3 textAlign="left" fontSize={18} fontWeight={600}>
                Select Delivery Address
              </H3>
              <Text
                fontSize="12px"
                color={theme.colors.blueText}
                style={cancelButtonStyles}
                onClick={handleCancelButtonClicked}
              >
                Cancel
              </Text>
            </Flex>
            <StepperContainer style={{ marginTop: 15 }}>
              <Stepper activeStep={active}>
                <Step />
                <Step />
                <Step />
              </Stepper>
            </StepperContainer>
          </Grid>
        </Grid>
        <Grid mt={5} gridTemplateColumns="400px 693px">
          <Flex
            p={4}
            mr={5}
            borderRadius={5}
            background={theme.colors.accent[50]}
            boxShadow={theme.boxShadowMedium}
            height={confirmOrderStage ? '350px' : '100%'}
          >
            <Formik
              validationSchema={DeliveryAddressValidation}
              initialValues={initialDeliveryAddressValues}
              onSubmit={() => { }}
            >
              {({ errors }) => {
                return (
                  <Form style={{ width: '100%' }}>
                    {deliveryAddressInfoStage && (
                      <Flex flexDirection="column">
                        <DeliveryAddressForm />
                      </Flex>
                    )}
                    {deliveryDetailsStage && (
                      <Flex flexDirection="column">
                        <DeliveryDetails
                          mobileFlow={false}
                          timeSlots={timeSlots}
                          nextClicked={nextClicked}
                          setNextClicked={setNextClicked}
                          selectedDeliveryDate={selectedDeliveryDate}
                          setSelectedDeliveryDate={setSelectedDeliveryDate}
                          selectedDeliveryTimeslot={selectedDeliveryTimeslot}
                          setSelectedDeliveryTimeslot={setSelectedDeliveryTimeslot}
                        />
                        <NextButton
                          active={active}
                          disabled={false}
                          setActive={() => {
                            setNextClicked(true);
                            if (selectedDeliveryDate && selectedDeliveryTimeslot) {
                              setActiveStep(2)
                            }
                          }}
                        >
                          NEXT
                        </NextButton>
                      </Flex>
                    )}
                    {confirmOrderStage && (
                      <Flex flexDirection="column">
                        <SelectPayment
                          mobileFlow={false}
                          setShowPaymentOptions={setShowPaymentsOption}
                        />
                        <Flex mt={30}>
                          <NextButton
                            active={active}
                            disabled={false}
                            setActive={() => handlePay()}
                          >
                            {
                              createOrderLoading && <Spinner mr={3} />
                            }
                            PROCEED TO PAYMENT
                          </NextButton>
                        </Flex>
                      </Flex>
                    )}
                  </Form>
                )
              }}
            </Formik>
          </Flex>
          <Flex>
            {deliveryAddressInfoStage && !numberOfAddresses ? (
              <NoData header={noAddressDataHeader} caption={noAddressDataCaption} />
            ) : confirmPaymentCardStage && !numberOfCards ? (
              <NoData header={noCardDataHeader} caption={noCardDataCaption} />
            ) : (
              <Grid gridTemplateRows="1fr 40px" width="100%">
                {deliveryAddressInfoStage && (
                  <DeliveryAddresses
                    mobileFlow={false}
                    addresses={addresses}
                    setActive={setActiveStep}
                    setSelectedAddress={setSelectedAddress}
                    confirmationTextAddress={confirmationTextAddress}
                  />
                )}
                {deliveryDetailsStage && (
                  <Flex flexDirection="column">
                    <Grid
                      p={4}
                      borderRadius={5}
                      background={theme.colors.accent[50]}
                      boxShadow={theme.boxShadowMedium}
                      gridTemplateColumns="1fr 50px"
                    >
                      <Flex>
                        <Text mr={3} fontSize={14}>{selectedAddress?.name}:</Text>
                        <Text fontSize={14}>{selectedAddress?.address}</Text>
                      </Flex>
                      <Flex justifySelf="end">
                        <Tag
                          fontSize={12}
                          mr={1}
                          size="sm"
                          background={theme.colors.tag}
                          color={theme.colors.tagText}
                        >
                          {selectedAddress?.type?.toUpperCase()}
                        </Tag>
                      </Flex>
                    </Grid>
                    <Flex
                      mt={4}
                      width="100%"
                      flexDirection="column"
                      overflowY="scroll"
                      maxHeight="600px"
                    >
                      {cartProducts?.map((product: ComponentCartCartProduct) => (
                        <ProductCard
                          key={`${product?.product?.id}_${Math.random()}`}
                          width="100%"
                          isCart={false}
                          editing={false}
                          isWishlist={false}
                          product={product?.product}
                          handleClick={() => { }}
                          handleIconClick={() => { }}
                        />
                      ))}
                    </Flex>
                  </Flex>
                )}
                {confirmOrderStage && (
                  <OrderSummary
                    mobileFlow={false}
                    cartProducts={cartProducts}
                    checkoutTotal={checkoutTotal}
                    selectedAddress={selectedAddress}
                    setActiveStep={setActiveStep}
                    selectedDeliveryDate={selectedDeliveryDate}
                    selectedDeliveryTimeslot={selectedDeliveryTimeslot}
                  />
                )}
              </Grid>
            )}
          </Flex>
        </Grid>
      </Grid>
    </PageWrap>
  )
}

export default CheckoutFlowWeb
