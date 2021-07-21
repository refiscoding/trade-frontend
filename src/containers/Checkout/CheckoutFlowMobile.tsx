import * as React from 'react'

import { isEmpty } from 'lodash'
import { Form, Formik } from 'formik'
import { ChevronRight } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { Flex, Grid, Image, Tag, Spinner, Button } from '@chakra-ui/core'

import { theme, images } from '../../theme'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { H3, Text } from '../../typography'
import { TimeSlot } from './AddressComponent'
import { DeliveryAddressValidation, initialDeliveryAddressValues, CheckoutProps } from '.'

import BeforeCheckoutModal from '../NucleusPayment/BeforeCheckoutModal'
import ActionButton from './ActionButton'
import CardInfo from './CardInfo'
import CheckoutItemsModal from './CheckoutProductsModal'
import CheckoutSignatoryModal from './CheckoutSignatoryModal'
import DeleteItemsModal from '../../components/DeleteItemsModal'
import DeliveryAddresses from './Addresses'
import DeliveryAddressForm from './DeliveryAddressForm'
import DeliveryDetails from './DeliveryDetails'
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

  const addressDetails = selectedAddress?.address?.split(',') ?? []
  const addressStrings = addressDetails[0]?.split('-')
  const streetAddress = addressStrings[0]?.trim()
  const buildingOrComplex = addressStrings[1]?.trim()
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
        <Text fontSize={14}>{streetAddress} </Text>
        <Text fontSize={14}>{buildingOrComplex} </Text>
        <Text fontSize={14}>{addressDetails[1]} </Text>
        <Text fontSize={14}>{addressDetails[2]} </Text>
        <Text mt={3} fontSize={14}>
          {selectedAddress?.postalCode}{' '}
        </Text>
      </Flex>
    </Grid>
  )
}

type DeliveryInfoComponentProps = {
  timeSlots: TimeSlot[]
  nextClicked: boolean | undefined
  selectedDeliveryTimeslot: string | undefined
  selectedDeliveryDate: Date | Date[]
  setNextClicked: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setSelectedDeliveryDate: React.Dispatch<React.SetStateAction<Date | Date[]>>
  setSelectedDeliveryTimeslot: React.Dispatch<React.SetStateAction<string | undefined>>
}

const DeliveryInfoComponent: React.FC<DeliveryInfoComponentProps> = ({
  timeSlots,
  setSelectedDeliveryDate,
  setSelectedDeliveryTimeslot,
  selectedDeliveryTimeslot,
  setNextClicked,
  nextClicked,
  selectedDeliveryDate
}) => {
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })
  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })

  const containerWidth = isTinyPhone ? '100%' : isSmallPhone ? '105%' : '105%'
  const containerMarginLeft = isTinyPhone ? '-2.2rem' : isSmallPhone ? '-2rem' : '-1.2rem'
  return (
    <Flex
      p={3}
      pr={0}
      ml={containerMarginLeft}
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow={theme.boxShadowMedium}
      width={containerWidth}
    >
      <DeliveryDetails
        selectedDeliveryDate={selectedDeliveryDate}
        setNextClicked={setNextClicked}
        nextClicked={nextClicked}
        mobileFlow
        timeSlots={timeSlots}
        setSelectedDeliveryDate={setSelectedDeliveryDate}
        setSelectedDeliveryTimeslot={setSelectedDeliveryTimeslot}
        selectedDeliveryTimeslot={selectedDeliveryTimeslot}
      />
    </Flex>
  )
}

const CheckoutFlowMobile: React.FC<CheckoutProps> = ({
  active,
  cards,
  addresses,
  handlePay,
  timeSlots,
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
  showDeleteItemsModal,
  selectedDeliveryDate,
  confirmationTextCard,
  setShowDeleteCardModal,
  confirmationTextAddress,
  setSelectedDeliveryDate,
  setShowDeleteItemsModal,
  selectedDeliveryTimeslot,
  showCheckoutSignatoryModal,
  setSelectedDeliveryTimeslot,
  setShowCheckoutSignatoryModal
}) => {
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [showPaymentOptions, setShowPaymentOptions] = React.useState<boolean>()
  const [showCheckoutItemsModal, setShowCheckoutItemsModal] = React.useState<boolean>()
  const [nextClicked, setNextClicked] = React.useState<boolean | undefined>()

  const numberOfAddresses = addresses?.length
  const numberOfCards = cards?.length
  const firstStage = active === 0
  const addDeliveryAddressStage = active === 1
  const confirmOrderStage = active === 2
  const selectPaymentStage = active === 3
  const confirmPaymentStage = active === 4

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

  const deliveryDetailsIncluded = selectedAddress && selectedDeliveryTimeslot

  const handleNext = () => {
    setShowModal(true)
  }
  
  const stepsMap = [
    'Select Delivery Address',
    'Add Delivery Address',
    'Set Delivery Date and Time',
    'Confirm Order and Pay'
  ]

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
            confirmationText={beforeCheckoutText}
            handleCancelButtonClicked={() => setShowModal(false)}
            handleProceedButtonClicked={() => {}}
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
                    ) : confirmOrderStage ? (
                      <Flex flexDirection="column">
                        <DeliveryInfoComponent
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
                            if (deliveryDetailsIncluded) {
                              setActiveStep(3)
                            }
                          }}
                        >
                          NEXT
                        </NextButton>
                      </Flex>
                    ) : (
                      selectPaymentStage && (
                        <Flex flexDirection="column">
                          <OrderSummary
                            mobileFlow
                            cartProducts={cartProducts}
                            checkoutTotal={checkoutTotal}
                            selectedAddress={selectedAddress}
                            setActiveStep={setActiveStep}
                            selectedDeliveryDate={selectedDeliveryDate}
                            selectedDeliveryTimeslot={selectedDeliveryTimeslot}
                          />
                          <Button
                            mt={5}
                            width="100%"
                            type="button"
                            variantColor="brand"
                            variant="solid"
                            onClick={() => handleNext()}
                          >
                            {createOrderLoading && <Spinner />}
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
