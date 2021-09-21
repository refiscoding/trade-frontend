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
import { cards } from './dummyData'
import { useBrowserStorage } from '../../hooks'
import { useAuthContext } from '../../context/AuthProvider'
import { StrapiLoginPayload } from '../../utils/strapiHelpers'
import { ERROR_TOAST, STRAPI_USER_STORAGE_KEY } from '../../constants'
import {
  useFetchUsersCartQuery,
  ComponentCartCartProduct,
  ComponentLocationAddress,
  useCreateCheckoutOrderMutation,
  useFetchOneUserCheckoutOrderQuery
} from '../../generated/graphql'

type UserStorage = StrapiLoginPayload | null

export const DeliveryAddressValidation = Yup.object().shape({
  province: Yup.string().required('Province is required'),
  suburb: Yup.string().required('Suburb is required'),
  city: Yup.string().required('City / Town is required'),
  postalCode: Yup.string().required('Postal Code is required')
})

export type DeliveryAddressValues = {
  name: string
  province: string
  city: string
  suburb: string
  postalCode: string
}

export const initialDeliveryAddressValues = {
  name: '',
  province: '',
  city: '',
  suburb: '',
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
  showCheckoutSignatoryModal: boolean | undefined
  selectedAddress: ComponentLocationAddress | undefined
  setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowDeleteItemsModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowCheckoutSignatoryModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
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
    'Please note that the products in your cart come from different suppliers and might not arrive on the same day. Each product has its associated delivery fees.'

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

  const userStorageHooks = useBrowserStorage<UserStorage>(STRAPI_USER_STORAGE_KEY, 'local')
  const sessionStorageHooks = useBrowserStorage<UserStorage>(STRAPI_USER_STORAGE_KEY, 'session')

  const handlePay = async () => {
    const HOST = `https://${process.env.REACT_APP_STAGE}.tradefed.sovtech.org`
    if (products) {
      const orderInput = {
        deliveryAddress: {
          province: selectedAddress?.province,
          postalCode: selectedAddress?.postalCode,
          city: selectedAddress?.city,
          suburb: selectedAddress?.suburb,
          isDefaultAddress: selectedAddress?.isDefaultAddress,
          type: selectedAddress?.type,
          name: selectedAddress?.name
        },
        deliveryDate: selectedDeliveryDate,
        validationRedirect: `${HOST}/orders`,
        successURL: `${process.env.REACT_APP_CLIENT_HOST}/checkout-success`,
        failureURL: `${process.env.REACT_APP_CLIENT_HOST}/checkout`
      }
      if (!userStorageHooks[0]) {
        userStorageHooks[1](sessionStorageHooks[0])
        sessionStorageHooks[2]()
      }
      await createOrder({
        variables: {
          input: orderInput
        }
      })
    }
  }

  React.useEffect(() => {
    const failedOrderDate = userOrder?.fetchOneUserCheckoutOrder?.payload?.deliveryDate
    const date = failedOrderDate ? new Date(failedOrderDate) : new Date()
    if (failedPayment) {
      setSelectedDeliveryDate(date)
      if (isTabletOrMobile) {
        setActiveStep(3)
      } else {
        setActiveStep(2)
      }
      history.replace('/checkout')
    }
  }, [userOrder, failedPayment, history, isTabletOrMobile])

  return (
    <PageWrap title="Checkout">
      {isTabletOrMobile ? (
        <CheckoutMobileFlow
          cards={cards}
          active={active}
          addresses={addresses}
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
          setShowDeleteItemsModal={setShowDeleteItemsModal}
          showCheckoutSignatoryModal={showCheckoutSignatoryModal}
          setShowCheckoutSignatoryModal={setShowCheckoutSignatoryModal}
        />
      ) : (
        <CheckoutWebFlow
          cards={cards}
          active={active}
          addresses={addresses}
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
          setShowDeleteItemsModal={setShowDeleteItemsModal}
          showCheckoutSignatoryModal={showCheckoutSignatoryModal}
          setShowCheckoutSignatoryModal={setShowCheckoutSignatoryModal}
        />
      )}
    </PageWrap>
  )
}

export default CheckoutPage
