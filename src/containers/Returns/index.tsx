import * as React from 'react'

import dayjs from 'dayjs'

import { get } from 'lodash'
import { ApolloError } from 'apollo-boost'
import { useToast } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

import ReturnsWeb from './OrderReturnWeb'
import ReturnsMobile from './OrderReturnMobile'

import { PageWrap } from '../../layouts'
import { ERROR_TOAST } from '../../constants'
import { OptionType } from '../../components/FormElements/ConnectedSelect'
import {
  Order,
  OrderReturnAction,
  OrderReturnReason,
  useFetchReturnActionsQuery,
  useFetchReturnReasonsQuery,
  useFetchUserCheckoutOrdersQuery
} from '../../generated/graphql'

export type OrderReturnsProps = {
  orders: Order[]
  pastOrders: Order[]
  activeOrders: Order[]
  actions: OptionType[]
  reasons: OptionType[]
  fetchingOrders: boolean
  noPastOrdersHeader: string
  noPastOrdersCaption: string
  noActiveOrdersHeader: string
  noActiveOrdersCaption: string
}

const OrderReturns = () => {
  const toast = useToast()
  const isWebView = useMediaQuery({ query: '(min-width: 40em)' })

  const { data: userOrders, loading: userOrdersLoading } = useFetchUserCheckoutOrdersQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const { data: returnReasons } = useFetchReturnReasonsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const { data: returnActions } = useFetchReturnActionsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const orders = get(userOrders, 'findCheckoutOrders.payload')
  const actions = get(returnActions, 'orderReturnActions') as OrderReturnAction[]
  const reasons = get(returnReasons, 'orderReturnReasons') as OrderReturnReason[]

  const pastOrders = orders?.filter((order: Order) => {
    const today = dayjs(new Date())
    const delivery = dayjs(order?.deliveryDate)
    if (delivery.isBefore(today)) {
      return order
    }
  })
  const activeOrders = orders?.filter((order: Order) => {
    const today = dayjs(new Date())
    const delivery = dayjs(order?.deliveryDate)
    if (delivery.isAfter(today)) {
      return order
    }
  })

  const noPastOrdersHeader = 'No Past Orders'
  const noPastOrdersCaption =
    "You currently don't have any orders that have been delivered to you in the past"
  const noActiveOrdersHeader = 'No Active Orders'
  const noActiveOrdersCaption = "You currently haven't placed any orders that are active"

  const actns = actions?.map((action: OrderReturnAction) => ({
    label: action?.Action as string,
    value: action?.Action as string
  }))
  const reasns = reasons?.map((reason: OrderReturnReason) => ({
    label: reason?.Reason as string,
    value: reason?.Reason as string
  }))

  return (
    <PageWrap title="Order Returns">
      {isWebView ? (
        <ReturnsWeb
          orders={orders}
          actions={actns}
          reasons={reasns}
          pastOrders={pastOrders}
          activeOrders={activeOrders}
          fetchingOrders={userOrdersLoading}
          noPastOrdersHeader={noPastOrdersHeader}
          noPastOrdersCaption={noPastOrdersCaption}
          noActiveOrdersHeader={noActiveOrdersHeader}
          noActiveOrdersCaption={noActiveOrdersCaption}
        />
      ) : (
        <ReturnsMobile
          orders={orders}
          actions={actns}
          reasons={reasns}
          pastOrders={pastOrders}
          activeOrders={activeOrders}
          fetchingOrders={userOrdersLoading}
          noPastOrdersHeader={noPastOrdersHeader}
          noPastOrdersCaption={noPastOrdersCaption}
          noActiveOrdersHeader={noActiveOrdersHeader}
          noActiveOrdersCaption={noActiveOrdersCaption}
        />
      )}
    </PageWrap>
  )
}

export default OrderReturns
