import * as React from "react";

import { Grid, Flex } from "@chakra-ui/core";

import OrderItem from "./Item";

import { Text } from "../../typography";
import { theme } from "../../theme";
import { Maybe, ComponentCartProductCartProduct } from "../../generated/graphql";


type OrderItemsSummaryComponentProps = {
    items: Maybe<Maybe<ComponentCartProductCartProduct>[]> | undefined
    isMobile: boolean
    total: Maybe<number> | undefined
};
const OrderSummaryComponent: React.FC<OrderItemsSummaryComponentProps> = ({
    total,
    items,
    isMobile
}) => {
    const rows = isMobile ? "30px 200px 1fr" : "30px 340px 1fr";
    return (
        <Grid
            border={`1px solid ${theme.colors.background}`}
            borderRadius={5}
            p={4}
            flexDirection="column"
            width="100%"
            gridTemplateRows={rows}
            background={isMobile ? theme.colors.accent[50] : ""}
            boxShadow={isMobile ? "0 2px 4px 0 rgba(0,0,0,0.25)" : ""}
            mt={isMobile ? 5 : 0}
            mb={isMobile ? 5 : 0}
        >
            <Text fontWeight={600}>Order Summary</Text>
            <Grid p={2} rowGap="10px" overflowY="scroll" cursor="pointer">
                {
                    items?.map((item: Maybe<ComponentCartProductCartProduct>, index: number) => {
                        return <OrderItem
                            key={`${index}_order_item`}
                            cartItem={item}
                        />
                    })
                }
            </Grid>
            <Grid alignSelf="end" gridTemplateColumns="1fr 1fr">
                <Text fontWeight={600}>Order Total</Text>
                <Flex justifySelf="end">
                    <Text fontWeight={600}>{`R ${total}.00`}</Text>
                </Flex>
            </Grid>

        </Grid>
    )
};
export default OrderSummaryComponent;
