import * as Yup from 'yup'
import * as React from 'react'

import { get } from 'lodash'
import { useToast } from '@chakra-ui/core'
import { ApolloError } from 'apollo-client'
import { useMediaQuery } from 'react-responsive'

import CheckoutWebFlow from './CheckoutFlowWeb'
import CheckoutMobileFlow from './CheckoutFlowMobile'
import { TimeSlot } from './AddressComponent'

import { Card } from './CardComponent'
import { CartProduct } from '../Cart'
import { ERROR_TOAST, mapsScriptUrl } from '../../constants'
import { useFetchUsersCartQuery, ComponentLocationAddress } from '../../generated/graphql'
import { PageWrap } from '../../layouts'
import { timeSlots, cards } from './dummyData'
import { useAuthContext } from '../../context/AuthProvider'

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
}

export type CheckoutProps = {
  active: number
  deliveryFee: number
  cards: Card[]
  addresses?: ComponentLocationAddress[]
  timeSlots: TimeSlot[]
  checkoutTotal: number
  noCardDataHeader: string
  noCardDataCaption: string
  tradeFinanceMargin: number
  cartProducts: CartProduct[]
  noAddressDataHeader: string
  confirmationTextCard: string
  noAddressDataCaption: string
  confirmationTextAddress: string
  setActiveStep: (step: number) => void
  showDeleteItemsModal: boolean | undefined
  showDeleteCardModal: boolean | undefined
  selectedAddress: ComponentLocationAddress | undefined
  setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowDeleteItemsModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
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
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

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

  const products = get(userCart, 'findCart.payload.productsQuantities', null) as CartProduct[]

  const productPrices = products?.map((item: CartProduct) => {
    const { product, quantity } = item
    const price = get(product, 'price.pricePerUnit', null)
    const itemsCost = price * quantity
    return itemsCost
  })
  const productPricesTotal = productPrices?.reduce((a, b) => a + b, 0)
  // TODO: Fetch actual values from backend
  const deliveryFee = 1000
  const tradeFinanceMargin = 100

  const checkoutTotal = productPricesTotal + deliveryFee + tradeFinanceMargin

  const addresses = user?.address as ComponentLocationAddress[]

  return (
    <PageWrap title="" script={mapsScriptUrl}>
      {isTabletOrMobile ? (
        <CheckoutMobileFlow
          active={active}
          cards={cards}
          addresses={addresses}
          timeSlots={timeSlots}
          cartProducts={products}
          deliveryFee={deliveryFee}
          setActiveStep={setActiveStep}
          checkoutTotal={checkoutTotal}
          selectedAddress={selectedAddress}
          noCardDataHeader={noCardDataHeader}
          noCardDataCaption={noCardDataCaption}
          tradeFinanceMargin={tradeFinanceMargin}
          setSelectedAddress={setSelectedAddress}
          noAddressDataHeader={noAddressDataHeader}
          showDeleteCardModal={showDeleteCardModal}
          showDeleteItemsModal={showDeleteItemsModal}
          noAddressDataCaption={noAddressDataCaption}
          confirmationTextCard={confirmationTextCard}
          setShowDeleteCardModal={setShowDeleteCardModal}
          confirmationTextAddress={confirmationTextAddress}
          setShowDeleteItemsModal={setShowDeleteItemsModal}
        />
      ) : (
        <CheckoutWebFlow
          active={active}
          cards={cards}
          addresses={addresses}
          timeSlots={timeSlots}
          cartProducts={products}
          deliveryFee={deliveryFee}
          setActiveStep={setActiveStep}
          checkoutTotal={checkoutTotal}
          selectedAddress={selectedAddress}
          noCardDataHeader={noCardDataHeader}
          noCardDataCaption={noCardDataCaption}
          tradeFinanceMargin={tradeFinanceMargin}
          setSelectedAddress={setSelectedAddress}
          noAddressDataHeader={noAddressDataHeader}
          showDeleteCardModal={showDeleteCardModal}
          showDeleteItemsModal={showDeleteItemsModal}
          noAddressDataCaption={noAddressDataCaption}
          confirmationTextCard={confirmationTextCard}
          setShowDeleteCardModal={setShowDeleteCardModal}
          confirmationTextAddress={confirmationTextAddress}
          setShowDeleteItemsModal={setShowDeleteItemsModal}
        />
      )}
    </PageWrap>
  )
}

export default CheckoutPage
