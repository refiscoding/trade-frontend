import * as React from "react";

import { Grid, Flex } from "@chakra-ui/core";
import { Text } from "../../typography";
import { CartProduct } from "../Cart";
import ReceiptProduct from "./ReceiptProduct";

import { theme } from "../../theme";

type OrderSummaryComponentProps = {
    cartProducts: CartProduct[]
    tradeFinanceMargin: number
    deliveryFee: number
    checkoutTotal: number
    mobileFlow: boolean
}

const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({ 
    cartProducts, 
    deliveryFee, 
    tradeFinanceMargin,
    checkoutTotal,
    mobileFlow
    }) => {
    return (
        <Flex
            borderRadius={5}
            background={theme.colors.accent[50]}
            boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
            p={4}
            flexDirection="column"
        >
            <Text mb={5} fontWeight={600}>Order Summary</Text>
            <Grid p={2} rowGap="10px" height="300px" overflowY="scroll" cursor="pointer">
                {
                    cartProducts?.map((item: CartProduct, index: number) => {
                        const { product, quantity } = item;
                        return <ReceiptProduct 
                                    key={`${index}_checkout_product`} 
                                    mobileFlow={mobileFlow}
                                    product={product} 
                                    quantity={quantity}
                                    tradeFinanceMargin={tradeFinanceMargin}
                                    deliveryFee={deliveryFee}
                                />
                    })
                }
            </Grid>
            <Grid my={6} gridTemplateColumns="1fr 1fr">
                <Text color={theme.colors.blueText} fontWeight={600}>Order Total</Text>
                <Flex justifySelf="end">
                    <Text color={theme.colors.blueText} fontWeight={600}>{`R ${checkoutTotal}.00`}</Text>
                </Flex>
            </Grid>
            <Grid mb={5} borderTop={`1px dashed #acacac}`}>
                <Text mt={5} fontWeight={600}>{`Delivery Method`}</Text>
                <Text mt={3}>{`Standard Delivery`}</Text>
                <Text>{`Thursday, 17 October 2021 (8:30 - 9:00)`}</Text>
                <Text mt={3} style={{ textDecoration: "underline" }} color={theme.colors.blueText} fontSize={12} fontWeight={600}>{`Change`}</Text>
            </Grid>
            <Grid mb={5} borderTop={`1px dashed #acacac}`}>
                <Text mt={5} fontWeight={600}>{`TradeFed Delivery Point`}</Text>
                <Text mt={3}>{`39 La Quinta, Hatfield Pretoria`}</Text>
                <Text>{`Hatfield`}</Text>
                <Text>{`Pretoria`}</Text>
                <Text>{`1991`}</Text>
                <Text mt={3} style={{ textDecoration: "underline" }} color={theme.colors.blueText} fontSize={12} fontWeight={600}>{`Change`}</Text>
            </Grid>
        </Flex>
    )
};
export default OrderSummaryComponent;
