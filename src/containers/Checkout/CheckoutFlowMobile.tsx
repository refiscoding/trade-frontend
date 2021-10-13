import * as React from 'react'

import { isEmpty } from 'lodash'
import { Form, Formik } from 'formik'
import { ChevronRight } from 'react-feather'
import { Flex, Grid, Image, Tag, Button } from '@chakra-ui/core'

import { theme, images } from '../../theme'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { H3, Text } from '../../typography'
import { DeliveryAddressValidation, initialDeliveryAddressValues, CheckoutProps } from '.'

import BeforeCheckoutModal from '../NucleusPayment/BeforeCheckoutModal'
import ActionButton from './ActionButton'
import CardInfo from './CardInfo'
import CheckoutItemsModal from './CheckoutProductsModal'
import CheckoutSignatoryModal from './CheckoutSignatoryModal'
import DeleteItemsModal from '../../components/DeleteItemsModal'
import DeliveryAddresses from './Addresses'
import DeliveryAddressForm from './DeliveryAddressForm'
import NextButton from './Button'
import NoData from './NoDataScreen'
import OrderSummary from './OrderSummary'
import SelectPayment from './SelectPayment'

import { ComponentLocationAddress } from '../../generated/graphql'

type SelectPaymentComponentProps = {
  setShowPaymentOptions: (show: boolean) => void
}

const SelectPaymentComponent: React.FC<SelectPaymentComponentProps> = ({
  setShowPaymentOptions
}) => {
  return (
    <Flex
      mb={5}
      p={4}
      borderRadius={5}
      boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
      backgroundColor={theme.colors.accent[50]}
      onClick={() => setShowPaymentOptions(true)}
      cursor="pointer"
    >
      <Grid gridTemplateRows="40px 1fr">
        <Text fontWeight={600}>Select Payment Method</Text>
        <Grid gridTemplateRows="30px 1fr" p={2}>
          <Text fontWeight={600} fontSize={12} my={2}>
            Credit and Debit Card
          </Text>
          <Grid gridTemplateColumns="1fr 1fr" alignContent="center">
            <Grid gridTemplateColumns="1fr 1fr 1fr" alignContent="center" columnGap="15px">
              <Flex>
                <Image src={images.masterCardPayment} />
              </Flex>
              <Flex>
                <Image src={images.visaCardPayment} />
              </Flex>
              <Flex>
                <Image src={images.AmericanExpressPayment} />
              </Flex>
            </Grid>
            <Flex justifySelf="end">
              <ChevronRight />
            </Flex>
          </Grid>
        </Grid>
      </Grid>
    </Flex>
  )
}

type DeliveryItemsComponentProps = {
  handleViewDeliveryItemsClicked: () => void
  selectedAddress: ComponentLocationAddress | undefined
}

const DeliveryItemsComponent: React.FC<DeliveryItemsComponentProps> = ({
  handleViewDeliveryItemsClicked,
  selectedAddress
}) => {
  const actionTextStyle = { textDecoration: 'underline', cursor: 'pointer' }

  return (
    <Grid
      p={5}
      mb={5}
      width="100%"
      borderRadius="5px"
      gridTemplateRows="40px 1fr"
      boxShadow={theme.boxShadowLight}
      backgroundColor={theme.colors.accent[50]}
    >
      <Flex justify="space-between">
        <Text fontWeight={600}>Delivery Address</Text>
        <Text
          onClick={handleViewDeliveryItemsClicked}
          fontSize={12}
          style={actionTextStyle}
          color={theme.colors.blueText}
        >
          Show Delivery Items
        </Text>
      </Flex>
      <Flex flexDirection="column">
        <Flex justify="space-between">
          <Text mb={3} fontSize={14}>
            {selectedAddress?.name}{' '}
          </Text>
          <Tag fontSize={10} size="sm" background={theme.colors.tag} color={theme.colors.tagText}>
            {selectedAddress?.type?.toUpperCase()}
          </Tag>
        </Flex>
        <Text mt={3} fontSize={14}>
          {selectedAddress?.name || '-'}
        </Text>
        <Text fontSize={14}>{selectedAddress?.province || '-'} </Text>
        <Text fontSize={14}>{selectedAddress?.city || '-'} </Text>
        <Text fontSize={14}>{selectedAddress?.suburb || '-'} </Text>
        <Text mt={3} fontSize={14}>
          {selectedAddress?.postalCode || '-'}
        </Text>
      </Flex>
    </Grid>
  )
}

const CheckoutFlowMobile: React.FC<CheckoutProps> = ({
  active,
  cards,
  addresses,
  handlePay,
  cartProducts,
  setActiveStep,
  checkoutTotal,
  selectedAddress,
  noCardDataHeader,
  noCardDataCaption,
  setSelectedAddress,
  createOrderLoading,
  beforeCheckoutText,
  showDeleteCardModal,
  noAddressDataHeader,
  noAddressDataCaption,
  confirmationTextCard,
  confirmationTextAddress,
  showCheckoutSignatoryModal,
  setShowCheckoutSignatoryModal
}) => {
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [showPaymentOptions, setShowPaymentOptions] = React.useState<boolean>()
  const [showCheckoutItemsModal, setShowCheckoutItemsModal] = React.useState<boolean>()

  const numberOfAddresses = addresses?.length
  const numberOfCards = cards?.length
  const firstStage = active === 0
  const addDeliveryAddressStage = active === 1
  const selectPaymentStage = active === 2
  const confirmPaymentStage = active === 3

  const handleViewDeliveryItemsClicked = () => {
    setShowCheckoutItemsModal(true)
  }

  const showPayments = () => {
    setShowPaymentOptions(false)
  }

  const ctaTextStyles = { color: 'blue', textDecoration: 'underline' }

  const handleChangePayment = () => {
    setShowPaymentOptions(true)
  }

  const handleNext = () => {
    setShowModal(true)
  }

  const stepsMap = ['Select Delivery Address', 'Add Delivery Address', 'Confirm Order and Pay']

  return (
    <PageWrap title="Checkout" alignSelf="center" width="100%">
      {showDeleteCardModal && (
        <DeleteItemsModal
          confirmationText={confirmationTextCard}
          handleCancelButtonClicked={() => {}}
          handleDeleteButtonClicked={() => {}}
        />
      )}
      {showCheckoutItemsModal && (
        <CheckoutItemsModal
          products={cartProducts}
          setShowCheckoutModal={setShowCheckoutItemsModal}
        />
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
      {showCheckoutSignatoryModal && (
        <CheckoutSignatoryModal setShowCheckoutModal={setShowCheckoutSignatoryModal} />
      )}
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left" fontSize={18} fontWeight={600}>
          {showPaymentOptions ? 'Select Payment Method' : stepsMap[active]}
        </H3>
      </Flex>
      <Formik
        validationSchema={DeliveryAddressValidation}
        initialValues={initialDeliveryAddressValues}
        onSubmit={() => {}}
      >
        {({ errors }) => {
          return (
            <Form style={{ width: '100%' }}>
              <Stepper activeStep={active}>
                <ActionButton setActive={setActiveStep}>
                  <Text fontSize={12}>Add a Delivery Address</Text>
                  <ChevronRight />
                </ActionButton>
                <DeliveryAddressForm />
                <DeliveryItemsComponent
                  selectedAddress={selectedAddress}
                  handleViewDeliveryItemsClicked={handleViewDeliveryItemsClicked}
                />
                {!showPaymentOptions && (
                  <SelectPaymentComponent setShowPaymentOptions={setShowPaymentOptions} />
                )}
                {!showPaymentOptions && <CardInfo />}
              </Stepper>
              <Flex>
                {showPaymentOptions ? (
                  <SelectPayment mobileFlow setShowPaymentOptions={showPayments} />
                ) : (
                  <Flex width="100%">
                    {firstStage && !numberOfAddresses ? (
                      <NoData header={noAddressDataHeader} caption={noAddressDataCaption} />
                    ) : confirmPaymentStage && !numberOfCards ? (
                      <NoData header={noCardDataHeader} caption={noCardDataCaption} />
                    ) : firstStage ? (
                      <DeliveryAddresses
                        mobileFlow
                        addresses={addresses}
                        setActive={setActiveStep}
                        confirmationTextAddress={confirmationTextAddress}
                        setSelectedAddress={setSelectedAddress}
                      />
                    ) : addDeliveryAddressStage ? (
                      <NextButton
                        type="submit"
                        active={active}
                        disabled={!isEmpty(errors)}
                        setActive={() => setActiveStep(0)}
                      >
                        NEXT
                      </NextButton>
                    ) : (
                      selectPaymentStage && (
                        <Flex flexDirection="column">
                          <OrderSummary
                            mobileFlow
                            cartProducts={cartProducts}
                            checkoutTotal={checkoutTotal}
                            selectedAddress={selectedAddress}
                            setActiveStep={setActiveStep}
                          />
                          <Button
                            mt={5}
                            width="100%"
                            type="button"
                            variantColor="brand"
                            variant="solid"
                            onClick={() => handleNext()}
                          >
                            {`CONTINUE`}
                          </Button>
                          <Text
                            mt={4}
                            style={ctaTextStyles}
                            fontSize={12}
                            textAlign="center"
                            onClick={handleChangePayment}
                          >
                            Change Payment Method
                          </Text>
                        </Flex>
                      )
                    )}
                  </Flex>
                )}
              </Flex>
            </Form>
          )
        }}
      </Formik>
    </PageWrap>
  )
}

export default CheckoutFlowMobile
