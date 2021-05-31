import * as Yup from 'yup'
import * as React from 'react'

import { get } from 'lodash'
import { useToast } from '@chakra-ui/core'
import { ApolloError } from 'apollo-client'
import { useMediaQuery } from 'react-responsive'

import CheckoutWebFlow from './CheckoutFlowWeb'
import CheckoutMobileFlow from './CheckoutFlowMobile'

import { Card } from './CardComponent'
import { PageWrap } from '../../layouts'
import { TimeSlot } from './AddressComponent'
import { timeSlots, cards } from './dummyData'
import { useAuthContext } from '../../context/AuthProvider'
import { ERROR_TOAST, mapsScriptUrl } from '../../constants'
import { useFetchUsersCartQuery, ComponentLocationAddress, useCreateCheckoutOrderMutation, ComponentCartCartProduct } from '../../generated/graphql';

export const DeliveryAddressValidation = Yup.object().shape({
  street: Yup.string().required('Street Address is required'),
  buildingComplex: Yup.string(),
  surburb: Yup.string().required('Surburb is required'),
  cityOrTown: Yup.string().required('City/Town is required'),
  postalCode: Yup.string().required('Postal Code is required')
})

export type DeliveryAddressValues = {
  street: string
  buildingComplex: string
  surburb: string
  cityOrTown: string
  postalCode: string
}

export const initialDeliveryAddressValues = {
  street: '',
  buildingComplex: '',
  surburb: '',
  cityOrTown: '',
  postalCode: ''
}

export type SelectedAddress = DeliveryAddressValues & {
  name: string
  type: string
  contact: string
}

export type TimeSlotProps = {
  slot: TimeSlot
  slots?: TimeSlot[]
  selectedDeliveryTimeslot: string | undefined
  setSelectedDeliveryTimeslot: React.Dispatch<React.SetStateAction<string | undefined>>
}

export type CheckoutProps = {
  active: number
  cards: Card[]
  handlePay: () => void
  timeSlots: TimeSlot[]
  checkoutTotal: number
  noCardDataHeader: string
  noCardDataCaption: string
  createOrderLoading: boolean
  noAddressDataHeader: string
  confirmationTextCard: string
  noAddressDataCaption: string
  confirmationTextAddress: string
  selectedDeliveryDate: Date | Date[]
  setActiveStep: (step: number) => void
  addresses?: ComponentLocationAddress[]
  cartProducts: ComponentCartCartProduct[]
  showDeleteCardModal: boolean | undefined
  showDeleteItemsModal: boolean | undefined
  selectedDeliveryTimeslot: string | undefined
  showCheckoutSignatoryModal: boolean | undefined
  selectedAddress: ComponentLocationAddress | undefined
  setSelectedDeliveryDate: React.Dispatch<React.SetStateAction<Date | Date[]>>
  setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowDeleteItemsModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowCheckoutSignatoryModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setSelectedDeliveryTimeslot: React.Dispatch<React.SetStateAction<string | undefined>>
  setSelectedAddress: React.Dispatch<React.SetStateAction<ComponentLocationAddress | undefined>>
}

const CheckoutPage: React.FC = () => {
  const { user } = useAuthContext()
  const toast = useToast()
  const [active, setActive] = React.useState<number>(0)
  const [selectedAddress, setSelectedAddress] = React.useState<
    ComponentLocationAddress | undefined
  >()
  const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>()
  const [showDeleteCardModal, setShowDeleteCardModal] = React.useState<boolean | undefined>()
  const [showCheckoutSignatoryModal, setShowCheckoutSignatoryModal] = React.useState<boolean | undefined>()
  const [selectedDeliveryDate, setSelectedDeliveryDate] = React.useState<Date | Date[]>(new Date())
  const [selectedDeliveryTimeslot, setSelectedDeliveryTimeslot] = React.useState<string | undefined>()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const [createOrder, { loading: createOrderLoading }] = useCreateCheckoutOrderMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async ({ createCheckoutOrder }) => {
      const transactionPaymentUrl = createCheckoutOrder.payload?.fnbPaymentOptionsUrl;
      window.open(transactionPaymentUrl, "_blank", "noopener, noreferrer, resizable");
    }
  });

  const noAddressDataHeader = 'No Delivery Addresses Here...'
  const noCardDataHeader = 'No Payment Cards Here...'
  const noAddressDataCaption = `
       You don't seem to have any delivery addresses yet.
       Add a new address and have it displayed here.
   `
  const noCardDataCaption = `
       You don't seem to have any payment cards yet.
       Add a new card and have it displayed here.
   `
  const confirmationTextAddress =
    "You are about to remove one of your delivery address? Once you have removed it, you'll have to re-add it manually to your addresses"
  const confirmationTextCard =
    "You are about to remove one of your payment cards? Once you have removed it, you'll have to re-add it manually to your payment cards"

  const { data: userCart } = useFetchUsersCartQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const setActiveStep = (step: number) => {
    setActive(step)
  }

  const products = get(userCart, 'findCart.payload.products', null) as ComponentCartCartProduct[]

  const checkoutTotal = get(userCart, 'findCart.payload.total', null)

  const addresses = user?.address as ComponentLocationAddress[]

  const handlePay = async () => {
    if (products) {
      const orderInput = {
        deliveryAddress: {
          address: selectedAddress?.address,
          postalCode: selectedAddress?.postalCode,
          lat: selectedAddress?.lat,
          lng: selectedAddress?.lng,
          isDefaultAddress: selectedAddress?.isDefaultAddress,
          type: selectedAddress?.type,
          name: selectedAddress?.name
        },
        deliveryDate: selectedDeliveryDate
      }
      await createOrder({
        variables: {
          input: orderInput
        }
      })
    }
  };

  return (
    <PageWrap title="Checkout" script={mapsScriptUrl}>
      {isTabletOrMobile ? (
        <CheckoutMobileFlow
          active={active}
          cards={cards}
          addresses={addresses}
          timeSlots={timeSlots}
          handlePay={handlePay}
          cartProducts={products}
          setActiveStep={setActiveStep}
          checkoutTotal={checkoutTotal}
          selectedAddress={selectedAddress}
          noCardDataHeader={noCardDataHeader}
          noCardDataCaption={noCardDataCaption}
          setSelectedAddress={setSelectedAddress}
          createOrderLoading={createOrderLoading}
          noAddressDataHeader={noAddressDataHeader}
          showDeleteCardModal={showDeleteCardModal}
          showDeleteItemsModal={showDeleteItemsModal}
          noAddressDataCaption={noAddressDataCaption}
          confirmationTextCard={confirmationTextCard}
          selectedDeliveryDate={selectedDeliveryDate}
          setShowDeleteCardModal={setShowDeleteCardModal}
          confirmationTextAddress={confirmationTextAddress}
          setSelectedDeliveryDate={setSelectedDeliveryDate}
          selectedDeliveryTimeslot={selectedDeliveryTimeslot}
          setSelectedDeliveryTimeslot={setSelectedDeliveryTimeslot}
          setShowDeleteItemsModal={setShowDeleteItemsModal}
          showCheckoutSignatoryModal={showCheckoutSignatoryModal}
          setShowCheckoutSignatoryModal={setShowCheckoutSignatoryModal}
        />
      ) : (
        <CheckoutWebFlow
          active={active}
          cards={cards}
          addresses={addresses}
          timeSlots={timeSlots}
          handlePay={handlePay}
          cartProducts={products}
          setActiveStep={setActiveStep}
          checkoutTotal={checkoutTotal}
          selectedAddress={selectedAddress}
          noCardDataHeader={noCardDataHeader}
          noCardDataCaption={noCardDataCaption}
          setSelectedAddress={setSelectedAddress}
          createOrderLoading={createOrderLoading}
          noAddressDataHeader={noAddressDataHeader}
          showDeleteCardModal={showDeleteCardModal}
          showDeleteItemsModal={showDeleteItemsModal}
          noAddressDataCaption={noAddressDataCaption}
          confirmationTextCard={confirmationTextCard}
          selectedDeliveryDate={selectedDeliveryDate}
          setShowDeleteCardModal={setShowDeleteCardModal}
          confirmationTextAddress={confirmationTextAddress}
          setSelectedDeliveryDate={setSelectedDeliveryDate}
          selectedDeliveryTimeslot={selectedDeliveryTimeslot}
          setSelectedDeliveryTimeslot={setSelectedDeliveryTimeslot}
          setShowDeleteItemsModal={setShowDeleteItemsModal}
          showCheckoutSignatoryModal={showCheckoutSignatoryModal}
          setShowCheckoutSignatoryModal={setShowCheckoutSignatoryModal}
        />
      )}
    </PageWrap>
  )
}

export default CheckoutPage
