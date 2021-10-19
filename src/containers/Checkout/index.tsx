import * as Yup from 'yup'
import * as React from 'react'

import { get, toPairs, groupBy, flatten } from 'lodash'
import { useToast } from '@chakra-ui/core'
import { ApolloError } from 'apollo-client'
import { useMediaQuery } from 'react-responsive'
import { useLocation, useHistory } from 'react-router'

import CheckoutWebFlow from './CheckoutFlowWeb'
import CheckoutMobileFlow from './CheckoutFlowMobile'

import { Card } from './CardComponent'
import { ERROR_TOAST, STRAPI_USER_STORAGE_KEY, SUCCESS_TOAST } from '../../constants'
import { PageWrap } from '../../layouts'
import { TimeSlot } from './AddressComponent'
import { cards } from './dummyData'
import { useBrowserStorage } from '../../hooks'
import { useAuthContext } from '../../context/AuthProvider'
import { StrapiLoginPayload } from '../../utils/strapiHelpers'
import {
  useFetchUsersCartQuery,
  ComponentCartCartProduct,
  ComponentLocationAddress,
  useCreateCheckoutOrderMutation,
  useCreateQuotationMutation,
  useFetchOneUserCheckoutOrderQuery,
  Quotation
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
  hubCode: string
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
  addresses?: ComponentLocationAddress[]
  beforeCheckoutText: string
  cards: Card[]
  cartProducts: ComponentCartCartProduct[]
  checkoutTotal: number
  confirmationTextAddress: string
  confirmationTextCard: string
  createOrderLoading: boolean
  handleDeliveryQuotation: any
  handlePay: () => void
  noAddressDataCaption: string
  noAddressDataHeader: string
  noCardDataCaption: string
  noCardDataHeader: string
  selectedAddress: ComponentLocationAddress | undefined
  selectedDeliveryDate: Date | Date[]
  setActiveStep: (step: number) => void
  setSelectedAddress: React.Dispatch<React.SetStateAction<ComponentLocationAddress | undefined>>
  setShowCheckoutSignatoryModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setShowDeleteItemsModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
  showCheckoutSignatoryModal: boolean | undefined
  showDeleteCardModal: boolean | undefined
  showDeleteItemsModal: boolean | undefined
  deliveryQuotation?: Quotation[]
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
    'Please note that if the products in your cart come from different suppliers they might not arrive on the same day. Each product has its associated delivery fees.'

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

  const [createQuotation, { data: quotationData }] = useCreateQuotationMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Delivery quotation created!', ...SUCCESS_TOAST })
    }
  })

  const deliveryQuotation = quotationData?.createQuotation as Quotation[]

  const deliveryTotals = deliveryQuotation?.map((delivery: Quotation) => {
    const GrandTotal = get(delivery, 'ResultSets[0][0].GrandTotal', 0)
    return GrandTotal
  })

  const setActiveStep = (step: number) => {
    setActive(step)
  }

  const products = get(userCart, 'findCart.payload.products', null) as ComponentCartCartProduct[]

  const checkoutTotal =
    get(userCart, 'findCart.payload.total', 0) +
    deliveryTotals?.reduce((total, val) => total + val, 0)
  const cartId = get(userCart, 'findCart.payload.id', null)

  const addresses = user?.address as ComponentLocationAddress[]

  const userStorageHooks = useBrowserStorage<UserStorage>(STRAPI_USER_STORAGE_KEY, 'local')
  const sessionStorageHooks = useBrowserStorage<UserStorage>(STRAPI_USER_STORAGE_KEY, 'session')

  const handleDeliveryQuotation = async () => {
    // group products by originCode/hubCode
    const deliveries: any = groupBy(
      products,
      (product: ComponentCartCartProduct) =>
        product.product?.business?.dispatchAddress?.hubCode || 'NONE'
    )

    const createQuotationInput = toPairs(deliveries).map((delivery: any) => {
      const hubCode: string = delivery[0]
      const products: ComponentCartCartProduct[] = delivery[1]

      return {
        cart: cartId,
        origin: products[0]?.product?.business?.dispatchAddress?.city?.toUpperCase() || '',
        originCode: hubCode || '',
        destination: selectedAddress?.city?.toUpperCase() || '',
        destinationCode: selectedAddress?.hubCode || '',
        totalWeight: products.reduce(
          (totalWeight: number, product: ComponentCartCartProduct) =>
            // quantity and weight should never be possibly null/undefined
            // TODO: make quantity and weight required in the schema
            (product.quantity || 0) * (product.product?.weight || 0) + totalWeight,
          0
        ),
        pieces: products.reduce(
          (totalPieces: number, product: ComponentCartCartProduct) =>
            totalPieces + (product.quantity || 0),
          0
        ),
        items: products.map((product: ComponentCartCartProduct) => product.product?.id).toString(),
        length: flatten(
          products.map((product: ComponentCartCartProduct) => {
            const lengths: number[] = Array.from(Array(product.quantity || 0))
            lengths.fill(product.product?.packageLength as number)
            return lengths
          })
        ).toString(),
        height: flatten(
          products.map((product: ComponentCartCartProduct) => {
            const heights: number[] = Array.from(Array(product.quantity || 0))
            heights.fill(product.product?.packageHeight as number)
            return heights
          })
        ).toString(),
        width: flatten(
          products.map((product: ComponentCartCartProduct) => {
            const widths: number[] = Array.from(Array(product.quantity || 0))
            widths.fill(product.product?.packageWidth as number)
            return widths
          })
        ).toString(),
        weight: flatten(
          products.map((product: ComponentCartCartProduct) => {
            const widths: number[] = Array.from(Array(product.quantity || 0))
            widths.fill(product.product?.packageWeight as number)
            return widths
          })
        ).toString()
      }
    })

    await createQuotation({
      variables: {
        input: createQuotationInput
      }
    })
  }

  const handlePay = async () => {
    const HOST = `${process.env.REACT_FNB_URL}`
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
          active={active}
          addresses={addresses}
          beforeCheckoutText={beforeCheckoutText}
          cards={cards}
          cartProducts={products}
          checkoutTotal={checkoutTotal}
          confirmationTextAddress={confirmationTextAddress}
          confirmationTextCard={confirmationTextCard}
          createOrderLoading={createOrderLoading}
          handleDeliveryQuotation={handleDeliveryQuotation}
          handlePay={handlePay}
          noAddressDataCaption={noAddressDataCaption}
          noAddressDataHeader={noAddressDataHeader}
          noCardDataCaption={noCardDataCaption}
          noCardDataHeader={noCardDataHeader}
          selectedAddress={selectedAddress}
          selectedDeliveryDate={selectedDeliveryDate}
          setActiveStep={setActiveStep}
          setSelectedAddress={setSelectedAddress}
          setShowCheckoutSignatoryModal={setShowCheckoutSignatoryModal}
          setShowDeleteCardModal={setShowDeleteCardModal}
          setShowDeleteItemsModal={setShowDeleteItemsModal}
          showCheckoutSignatoryModal={showCheckoutSignatoryModal}
          showDeleteCardModal={showDeleteCardModal}
          showDeleteItemsModal={showDeleteItemsModal}
          deliveryQuotation={deliveryQuotation}
        />
      ) : (
        <CheckoutWebFlow
          active={active}
          addresses={addresses}
          beforeCheckoutText={beforeCheckoutText}
          cards={cards}
          cartProducts={products}
          checkoutTotal={checkoutTotal}
          confirmationTextAddress={confirmationTextAddress}
          confirmationTextCard={confirmationTextCard}
          createOrderLoading={createOrderLoading}
          handleDeliveryQuotation={handleDeliveryQuotation}
          handlePay={handlePay}
          noAddressDataCaption={noAddressDataCaption}
          noAddressDataHeader={noAddressDataHeader}
          noCardDataCaption={noCardDataCaption}
          noCardDataHeader={noCardDataHeader}
          selectedAddress={selectedAddress}
          selectedDeliveryDate={selectedDeliveryDate}
          setActiveStep={setActiveStep}
          setSelectedAddress={setSelectedAddress}
          setShowCheckoutSignatoryModal={setShowCheckoutSignatoryModal}
          setShowDeleteCardModal={setShowDeleteCardModal}
          setShowDeleteItemsModal={setShowDeleteItemsModal}
          showCheckoutSignatoryModal={showCheckoutSignatoryModal}
          showDeleteCardModal={showDeleteCardModal}
          showDeleteItemsModal={showDeleteItemsModal}
          deliveryQuotation={deliveryQuotation}
        />
      )}
    </PageWrap>
  )
}

export default CheckoutPage
