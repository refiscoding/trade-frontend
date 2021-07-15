import * as React from 'react'

import { get } from 'lodash'
import { ApolloError, ApolloQueryResult } from 'apollo-boost'
import { useToast } from '@chakra-ui/core'
import { useMediaQuery } from 'react-responsive'

import OrdersWeb from './OrdersWeb'
import OrdersMobile from './OrdersMobile'
import PageWrap from '../../layouts/PageWrap'

import { Ranges } from './DatePickerForm'
import { ERROR_TOAST } from '../../constants'
import {
  useFetchUserCheckoutOrdersQuery,
  Order,
  FetchUserCheckoutOrdersQuery
} from '../../generated/graphql'

export type OrdersPageProps = {
  orders: Order[]
  ordersLoading: boolean
  refetchUserOrders: () => Promise<ApolloQueryResult<FetchUserCheckoutOrdersQuery>>
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean | undefined>>
  setDateRange: React.Dispatch<React.SetStateAction<Ranges | undefined>>
  isFiltering: boolean | undefined
}

const OrdersPage = () => {
  const toast = useToast()
  const [isFiltering, setIsFiltering] = React.useState<boolean>()
  const [dateRange, setDateRange] = React.useState<Ranges>()
  const isWebView = useMediaQuery({ query: '(min-width: 40em)' })
  const res = {
    input: {
      startDate: dateRange?.startDate ?? null,
      endDate: dateRange?.endDate ?? null
    }
  }

  const {
    data: userOrders,
    loading: userOrdersLoading,
    refetch: refetchUserOrders
  } = useFetchUserCheckoutOrdersQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    variables: { ...res }
  })
  const orders = get(userOrders, 'findCheckoutOrders.payload')

  React.useEffect(() => {
    refetchUserOrders()
    if (!isFiltering) {
      setDateRange({
        endDate: null,
        startDate: null
      })
    }
  }, [refetchUserOrders, isFiltering, setDateRange])

  return (
    <PageWrap title="Orders" width="100%">
      {isWebView ? (
        <OrdersWeb
          orders={orders}
          isFiltering={isFiltering}
          refetchUserOrders={refetchUserOrders}
          setDateRange={setDateRange}
          setIsFiltering={setIsFiltering}
          ordersLoading={userOrdersLoading}
        />
      ) : (
        <OrdersMobile
          orders={orders}
          isFiltering={isFiltering}
          setDateRange={setDateRange}
          refetchUserOrders={refetchUserOrders}
          setIsFiltering={setIsFiltering}
          ordersLoading={userOrdersLoading}
        />
      )}
    </PageWrap>
  )
}
export default OrdersPage
