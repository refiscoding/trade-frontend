import * as Yup from 'yup'
import * as React from 'react'

import { get } from 'lodash'
import { useToast } from '@chakra-ui/core'
import { ApolloError } from 'apollo-client'
import { useMediaQuery } from 'react-responsive'
import { useLocation, useHistory } from 'react-router'

import CheckoutWebFlow from './CheckoutFlowWeb'
import CheckoutMobileFlow from './CheckoutFlowMobile'

import { Card } from './CardComponent'
import { PageWrap } from '../../layouts'
import { TimeSlot } from './AddressComponent'
import { timeSlots, cards } from './dummyData'
import { useAuthContext } from '../../context/AuthProvider'
import { ERROR_TOAST } from '../../constants'
import {
  useFetchUsersCartQuery,
  ComponentCartCartProduct,
  ComponentLocationAddress,
  useCreateCheckoutOrderMutation,
  useFetchOneUserCheckoutOrderQuery
} from '../../generated/graphql'

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
  beforeCheckoutText: string
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
  const location = useLocation()
  const history = useHistory()
  const [active, setActive] = React.useState<number>(0)
  const [selectedAddress, setSelectedAddress] = React.useState<
    ComponentLocationAddress | undefined
  >()
  const [showDeleteItemsModal, setShowDeleteItemsModal] = React.useState<boolean | undefined>()
  const [showDeleteCardModal, setShowDeleteCardModal] = React.useState<boolean | undefined>()
  const [showCheckoutSignatoryModal, setShowCheckoutSignatoryModal] = React.useState<
    boolean | undefined
  >()
  const [selectedDeliveryDate, setSelectedDeliveryDate] = React.useState<Date | Date[]>(new Date())
  const [selectedDeliveryTimeslot, setSelectedDeliveryTimeslot] = React.useState<
    string | undefined
  >()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const [createOrder, { loading: createOrderLoading }] = useCreateCheckoutOrderMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async ({ createCheckoutOrder }) => {
      const transactionPaymentUrl = createCheckoutOrder.payload?.fnbPaymentOptionsUrl
      window.open(transactionPaymentUrl, '_blank', 'noopener, noreferrer, resizable')
    }
  })

  const failedPayment = (new URLSearchParams(location.search).get('status') as string) === 'failed'
  const failedPaymentOrder = new URLSearchParams(location.search).get('order') as string

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
  const beforeCheckoutText = 
    "Pleace note that the products in your cart come from different suppliers and might arrive not arrive on the same day. Each product has it’s own delivery fees associated."
  
    const { data: userCart } = useFetchUsersCartQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const { data: userOrder } = useFetchOneUserCheckoutOrderQuery({
    variables: {
      input: {
        id: failedPaymentOrder
      }
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const setActiveStep = (step: number) => {
    setActive(step)
  }

  const products = get(userCart, 'findCart.payload.products', null) as ComponentCartCartProduct[]

  const checkoutTotal = get(userCart, 'findCart.payload.total', null)

  const addresses = user?.address as ComponentLocationAddress[]

  const orderAddress = userOrder?.fetchOneUserCheckoutOrder?.payload?.deliveryAddress

  const failedOrderAddress = addresses.filter((address: ComponentLocationAddress) => {
    if (orderAddress) {
      const lat = address.lat === orderAddress?.lat
      const lng = address.lng === orderAddress?.lng
      if (lat && lng) {
        return address
      }
    }
    return {}
  })

  const handlePay = async () => {
    const HOST = `https://${process.env.REACT_APP_STAGE}.tradefed.sovtech.org`
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
        deliveryDate: selectedDeliveryDate,
        validationRedirect: `${HOST}/orders`,
        successURL: `${process.env.REACT_APP_CLIENT_HOST}/checkout-success`,
        failureURL: `${process.env.REACT_APP_CLIENT_HOST}/checkout`
      }
      await createOrder({
        variables: {
          input: orderInput
        }
      })
    }
  }

  React.useEffect(() => {
    // TODO: 'Need to check auth status, if available, proceed else authenticate user'
    const orderAddress = failedOrderAddress[0]
    const failedOrderDate = userOrder?.fetchOneUserCheckoutOrder?.payload?.deliveryDate
    if (failedPayment) {
      setSelectedAddress(orderAddress)
      setSelectedDeliveryDate(new Date(failedOrderDate))
      setSelectedDeliveryTimeslot('1')
      if (isTabletOrMobile) {
        setActiveStep(3)
      } else {
        setActiveStep(2)
      }
      history.replace('/checkout')
    }
  }, [userOrder, failedOrderAddress, failedPayment, history, isTabletOrMobile])

  return (
    <PageWrap title="Checkout">
      {isTabletOrMobile ? (
        <CheckoutMobileFlow
          cards={cards}
          active={active}
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
          beforeCheckoutText={beforeCheckoutText}
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
          cards={cards}
          active={active}
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
          beforeCheckoutText={beforeCheckoutText}
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
