import * as React from "react";

import { get } from 'lodash'
import { ApolloError } from "apollo-boost";
import { useToast } from "@chakra-ui/core";
import { useMediaQuery } from "react-responsive";

import OrdersWeb from "./OrdersWeb";
import OrdersMobile from "./OrdersMobile";
import PageWrap from "../../layouts/PageWrap";

import { ERROR_TOAST } from "../../constants";
import { useFetchUserCheckoutOrdersQuery, Order } from '../../generated/graphql'

export type OrdersPageProps = {
    orders: Order[]
    ordersLoading: boolean
}

const OrdersPage = () => {
    const toast = useToast();
    const isWebView = useMediaQuery({ query: '(min-width: 40em)' });
    const { data: userOrders, loading: userOrdersLoading, refetch: refetchUserOrders } = useFetchUserCheckoutOrdersQuery({
        onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
    });
    const orders = get(userOrders, 'findCheckoutOrders.payload')

    React.useEffect(() => {
        refetchUserOrders();
    }, [refetchUserOrders])

    return (
        <PageWrap title="Orders" width="100%">
            {
                isWebView
                    ? <OrdersWeb orders={orders} ordersLoading={userOrdersLoading} />
                    : <OrdersMobile orders={orders} ordersLoading={userOrdersLoading} />
            }
        </PageWrap>
    )

};
export default OrdersPage;