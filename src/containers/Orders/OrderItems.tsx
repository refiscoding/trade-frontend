import * as React from "react";

import { Grid, Flex } from "@chakra-ui/core";

import OrderItem from "./Item";

import { Text } from "../../typography";
import { theme } from "../../theme";

export type Cart = { quantity: number; product: { name: string; }; }
type OrderItemsSummaryComponentProps = {
    items: Cart[]
    isMobile: boolean
};

const OrderSummaryComponent: React.FC<OrderItemsSummaryComponentProps> = ({
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
                    items?.map((item: Cart) => {
                        return <OrderItem
                            cart={item}
                        />
                    })
                }
            </Grid>
            <Grid alignSelf="end" gridTemplateColumns="1fr 1fr">
                <Text fontWeight={600}>Order Total</Text>
                <Flex justifySelf="end">
                    <Text fontWeight={600}>{`R 100.00`}</Text>
                </Flex>
            </Grid>

        </Grid>
    )
};
export default OrderSummaryComponent;
