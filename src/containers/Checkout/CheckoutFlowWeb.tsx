import * as React from 'react'
import styled from '@emotion/styled'

import { Form, Formik } from 'formik'
import { useHistory } from 'react-router'
import { Flex, Grid } from '@chakra-ui/core'

import { theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { H3, Text } from '../../typography'
import { CheckoutProps, initialDeliveryAddressValues, DeliveryAddressValidation } from '.'

import BeforeCheckoutModal from '../NucleusPayment/BeforeCheckoutModal'
import CheckoutSignatoryModal from './CheckoutSignatoryModal'
import DeleteItemsModal from '../../components/DeleteItemsModal'
import DeliveryAddresses from './Addresses'
import DeliveryAddressForm from './DeliveryAddressForm'
import NextButton from './Button'
import NoData from './NoDataScreen'
import OrderSummary from './OrderSummary'
import SelectPayment from './SelectPayment'

const StepperContainer = styled.div`
  margin-top: 15px;
`
const Step = styled.div``

const CheckoutFlowWeb: React.FC<CheckoutProps> = ({
  active,
  cards,
  addresses,
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
  beforeCheckoutText,
  confirmationTextCard,
  confirmationTextAddress,
  showCheckoutSignatoryModal,
  setShowCheckoutSignatoryModal
}) => {
  const history = useHistory()
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const numberOfAddresses = addresses?.length
  const numberOfCards = cards?.length
  const cancelButtonStyles = { textDecoration: 'underline', cursor: 'pointer' }
  const deliveryAddressInfoStage = active === 0
  const confirmOrderStage = active === 1
  const confirmPaymentCardStage = active === 2

  const handleCancelButtonClicked = () => {
    history.push('/cart')
  }
  const setShowPaymentsOption = () => {}

  const handleNext = () => {
    setShowModal(true)
  }

  const stepsMap = [
    'Select Delivery Address',
    'Set Delivery Date and Time',
    'Confirm Order and Pay'
  ]

  return (
    <PageWrap title="Checkout" alignSelf="center" width="90%" mt={20} pt={0} p={0}>
      <Flex width="100%">
        {showDeleteCardModal && (
          <DeleteItemsModal
            confirmationText={confirmationTextCard}
            handleCancelButtonClicked={() => {}}
            handleDeleteButtonClicked={() => {}}
          />
        )}
        {showCheckoutSignatoryModal && (
          <CheckoutSignatoryModal setShowCheckoutModal={setShowCheckoutSignatoryModal} />
        )}
        {showModal && (
          <BeforeCheckoutModal
            checkoutTotal={checkoutTotal}
            confirmationText={beforeCheckoutText}
            handleProceedButtonClicked={handlePay}
            createOrderLoading={createOrderLoading}
            handleCancelButtonClicked={() => setShowModal(false)}
          />
        )}
        <Flex width="100%" flexDirection="column">
          <Grid
            p={5}
            width="100%"
            borderRadius={5}
            background={theme.colors.accent[50]}
            boxShadow={theme.boxShadowMedium}
          >
            <Grid gridTemplateRows="20px 45px">
              <Flex justify="space-between">
                <H3 textAlign="left" fontSize={18} fontWeight={600}>
                  {stepsMap[active]}
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
          <Grid mt={5} gridTemplateColumns="400px 1fr" columnGap="15px">
            <Flex
              p={4}
              borderRadius={5}
              background={theme.colors.accent[50]}
              boxShadow={theme.boxShadowMedium}
              height={confirmOrderStage ? '350px' : '100%'}
            >
              <Formik
                validationSchema={DeliveryAddressValidation}
                initialValues={initialDeliveryAddressValues}
                onSubmit={() => {}}
              >
                {({ errors }) => {
                  return (
                    <Form style={{ width: '100%' }}>
                      {deliveryAddressInfoStage && (
                        <Flex flexDirection="column">
                          <DeliveryAddressForm />
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
                              setActive={() => handleNext()}
                            >
                              CONTINUE
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
                  {confirmOrderStage && (
                    <OrderSummary
                      mobileFlow={false}
                      cartProducts={cartProducts}
                      checkoutTotal={checkoutTotal}
                      selectedAddress={selectedAddress}
                      setActiveStep={setActiveStep}
                    />
                  )}
                </Grid>
              )}
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default CheckoutFlowWeb
