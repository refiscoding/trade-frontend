import * as React from 'react'

import { isEmpty } from 'lodash'
import { Form, Formik } from 'formik'
import { Flex, Grid, Image, Button, Tag } from '@chakra-ui/core'
import { ChevronRight } from 'react-feather'
import { useHistory } from "react-router";

import { theme, images } from '../../theme'
import { PageWrap } from '../../layouts'
import { Stepper } from '../../components'
import { H3, Text } from '../../typography'
import { TimeSlot } from './AddressComponent'
import { DeliveryAddressValidation, initialDeliveryAddressValues, CheckoutProps } from '.'

import NextButton from './Button'
import CardInfo from './CardInfo'
import NoData from './NoDataScreen'
import CardsComponent from './Cards'
import ActionButton from './ActionButton'
import OrderSummary from './OrderSummary'
import DeliveryAddresses from './Addresses'
import SelectPayment from './SelectPayment'
import DeliveryDetails from './DeliveryDetails'
import StrapiHelpers from "../../utils/strapiHelpers"
import DeliveryAddressForm from './DeliveryAddressForm'
import CheckoutItemsModal from './CheckoutProductsModal'
import DeleteItemsModal from '../../components/DeleteItemsModal'

import { useAuthContext } from "../../context/AuthProvider";
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

  const addressDetails = selectedAddress?.address?.split(",") ?? [];
  const addressStrings = addressDetails[0]?.split("-");
  const streetAddress = addressStrings[0]?.trim();
  const buildingOrComplex = addressStrings[1]?.trim();
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
          <Text mb={3} fontSize={14}>{selectedAddress?.name} </Text>
          <Tag
            fontSize={10}
            size="sm"
            background={theme.colors.tag}
            color={theme.colors.tagText}
          >
            {selectedAddress?.type?.toUpperCase()}
          </Tag>
        </Flex>
        <Text fontSize={14}>{streetAddress} </Text>
        <Text fontSize={14}>{buildingOrComplex} </Text>
        <Text fontSize={14}>{addressDetails[1]} </Text>
        <Text fontSize={14}>{addressDetails[2]} </Text>
        <Text mt={3} fontSize={14}>{selectedAddress?.postalCode} </Text>
      </Flex>
    </Grid>
  )
}

type DeliveryInfoComponentProps = {
  timeSlots: TimeSlot[]
  selectedDeliveryTimeslot: string | undefined
  setSelectedDeliveryDate: React.Dispatch<React.SetStateAction<Date | Date[]>>
  setSelectedDeliveryTimeslot: React.Dispatch<React.SetStateAction<string | undefined>>
}

const DeliveryInfoComponent: React.FC<DeliveryInfoComponentProps> = ({ timeSlots, setSelectedDeliveryDate, setSelectedDeliveryTimeslot, selectedDeliveryTimeslot }) => {
  return (
    <Flex flexDirection="column">
      <Flex
        p={3}
        pr={0}
        borderRadius={5}
        background={theme.colors.accent[50]}
        boxShadow={theme.boxShadowMedium}
      >
        <DeliveryDetails mobileFlow timeSlots={timeSlots} setSelectedDeliveryDate={setSelectedDeliveryDate} setSelectedDeliveryTimeslot={setSelectedDeliveryTimeslot} selectedDeliveryTimeslot={selectedDeliveryTimeslot} />
      </Flex>
    </Flex>
  )
}

const CheckoutFlowMobile: React.FC<CheckoutProps> = ({
  active,
  cards,
  addresses,
  timeSlots,
  deliveryFee,
  cartProducts,
  setActiveStep,
  checkoutTotal,
  selectedAddress,
  noCardDataHeader,
  noCardDataCaption,
  tradeFinanceMargin,
  setSelectedAddress,
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
  setSelectedDeliveryTimeslot,
}) => {
  const history = useHistory()
  const { user } = useAuthContext();
  const [showPaymentOptions, setShowPaymentOptions] = React.useState<boolean>()
  const [showCheckoutItemsModal, setShowCheckoutItemsModal] = React.useState<boolean>()

  const numberOfAddresses = addresses?.length
  const numberOfCards = cards?.length
  const firstStage = active === 0
  const addDeliveryAddressStage = active === 1
  const confirmOrderStage = active === 2
  const selectPaymentStage = active === 3
  const confirmPaymentStage = active === 4
  const addPaymentCardStage = active === 5

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

  const handlePay = () => {
    if (cartProducts) {
      StrapiHelpers.sendOrderSummaryEmail(cartProducts, user, selectedAddress, selectedDeliveryDate);
      history.push('/checkout-success')
    }
  };

  return (
    <React.Fragment>
      <PageWrap title="Checkout" alignSelf="center" width="100%">
        {showDeleteCardModal && (
          <DeleteItemsModal

            confirmationText={confirmationTextCard}
            handleCancelButtonClicked={() => { }}
            handleDeleteButtonClicked={() => { }}
          />
        )}
        {showCheckoutItemsModal && (
          <CheckoutItemsModal
            products={cartProducts}
            setShowCheckoutModal={setShowCheckoutItemsModal}
          />
        )}
        <Flex width="100%" mb={4} flexDirection="column">
          <H3 textAlign="left" fontSize={18} fontWeight={600}>
            Select Delivery Address
          </H3>
        </Flex>
        <Formik
          validationSchema={DeliveryAddressValidation}
          initialValues={initialDeliveryAddressValues}
          onSubmit={() => { }}
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
                  {!showPaymentOptions && (
                    <ActionButton setActive={() => setActiveStep(5)}>
                      <Text fontSize={12}>Add a New Card</Text>
                      <ChevronRight />
                    </ActionButton>
                  )}
                  {!showPaymentOptions && <CardInfo />}
                </Stepper>
                <Flex>
                  {showPaymentOptions ? (
                    <SelectPayment mobileFlow setShowPaymentOptions={showPayments} />
                  ) : (
                    <React.Fragment>
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
                          <DeliveryInfoComponent timeSlots={timeSlots} setSelectedDeliveryDate={setSelectedDeliveryDate} setSelectedDeliveryTimeslot={setSelectedDeliveryTimeslot} selectedDeliveryTimeslot={selectedDeliveryTimeslot} />
                          <NextButton
                            active={active}
                            disabled={false}
                            setActive={() => setActiveStep(3)}
                          >
                            NEXT
                          </NextButton>
                        </Flex>
                      ) : selectPaymentStage ? (
                        <Flex flexDirection="column">
                          <OrderSummary
                            mobileFlow
                            cartProducts={cartProducts}
                            checkoutTotal={checkoutTotal}
                            deliveryFee={deliveryFee}
                            tradeFinanceMargin={tradeFinanceMargin}
                            selectedAddress={selectedAddress}
                            setActiveStep={setActiveStep}
                            selectedDeliveryDate={selectedDeliveryDate}
                            selectedDeliveryTimeslot={selectedDeliveryTimeslot}
                          />
                          <NextButton
                            active={active}
                            disabled={false}
                            setActive={() => setActiveStep(4)}
                          >
                            NEXT
                          </NextButton>
                        </Flex>
                      ) : confirmPaymentStage ? (
                        <Flex flexDirection="column" width="100%">
                          <CardsComponent
                            mobileFlow
                            cards={cards}
                            checkoutTotal={checkoutTotal}
                            selectedAddress={selectedAddress}
                            selectedDeliveryDate={selectedDeliveryDate}
                            setShowDeleteCardModal={setShowDeleteCardModal}
                          />
                          <Button
                            mt={5}
                            width="100%"
                            type={"button"}
                            variantColor="brand"
                            variant="solid"
                            isDisabled={false}
                            onClick={handlePay}
                          >
                            {`PAY R ${checkoutTotal}.00`}
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
                      ) : (
                        addPaymentCardStage && (
                          <NextButton
                            active={active}
                            disabled={false}
                            setActive={() => setActiveStep(4)}
                          >
                            ADD CARD
                          </NextButton>
                        )
                      )}
                    </React.Fragment>
                  )}
                </Flex>
              </Form>
            )
          }}
        </Formik>
      </PageWrap>
    </React.Fragment>
  )
}

export default CheckoutFlowMobile
