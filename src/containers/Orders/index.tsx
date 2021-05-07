import * as React from "react";
import { useMediaQuery } from "react-responsive";

import OrdersWeb from "./OrdersWeb";
import OrdersMobile from "./OrdersMobile";
import PageWrap from "../../layouts/PageWrap";

export type Order = {
    id: string
    orderDate: string
    orderNumber: string
    orderTotal: number
    paidDate: string
    deliveryDate: string
    deliveryAddress: {
        id: string
        address: string
        postalCode: string
        type: string
        name: string
    },
    deliveryTotal: number
    itemsNumber: number
    itemsTotal: number
    cart: { quantity: number; product: { name: string; }; }[],
    owner: {
        username: string
    },
    signatory: {
        name: string
        relation: string
        isCustomer: boolean
    }
};


const OrdersPage = () => {
    const isWebView = useMediaQuery({ query: '(min-width: 40em)' });


    return (
        <PageWrap title="Orders" width="100%">
            {
                isWebView
                    ? <OrdersWeb />
                    : <OrdersMobile />
            }
        </PageWrap>
    )

};
export default OrdersPage;