import * as React from 'react'

import { get } from "lodash";
import { ApolloError } from 'apollo-boost';
import { useToast } from '@chakra-ui/core';
import { useMediaQuery } from "react-responsive";

import ReturnsWeb from "./OrderReturnWeb";
import ReturnsMobile from "./OrderReturnMobile";

import { PageWrap } from '../../layouts'
import { ERROR_TOAST } from "../../constants";
import { useFetchUserCheckoutOrdersQuery, Order } from '../../generated/graphql';
import dayjs from 'dayjs';

export type OrderReturnsProps = {
    orders: Order[]
    pastOrders: Order[]
    activeOrders: Order[]
    fetchingOrders: boolean
}

const OrderReturns = () => {
    const toast = useToast();
    const isWebView = useMediaQuery({ query: '(min-width: 40em)' });

    const { data: userOrders, loading: userOrdersLoading } = useFetchUserCheckoutOrdersQuery({
        onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
    });

    const orders = get(userOrders, 'findCheckoutOrders.payload');

    const pastOrders = orders?.filter((order: Order) => {
        const today = dayjs(new Date())
        const delivery = dayjs(order?.deliveryDate);
        if (delivery.isBefore(today)) {
            return order
        }
    });
    const activeOrders = orders?.filter((order: Order) => {
        const today = dayjs(new Date())
        const delivery = dayjs(order?.deliveryDate);
        if (delivery.isAfter(today)) {
            return order
        }
    });

    return (
        <PageWrap title="Order Returns">
            {
                isWebView
                    ? <ReturnsWeb orders={orders} fetchingOrders={userOrdersLoading} pastOrders={pastOrders} activeOrders={activeOrders} />
                    : <ReturnsMobile orders={orders} fetchingOrders={userOrdersLoading} pastOrders={pastOrders} activeOrders={activeOrders} />
            }
        </PageWrap>
    )
}

export default OrderReturns
