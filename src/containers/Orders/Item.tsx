import * as React from "react";

import { Grid, Flex, Tag } from "@chakra-ui/core";
import { Text } from "../../typography";
import { theme } from "../../theme";

import { Cart } from "./OrderItems";

type OrderItemComponentProps = {
    cart: Cart
};

const OrderItemComponent: React.FC<OrderItemComponentProps> = ({ cart }) => {
    return (
        <Grid borderBottom={`1px solid ${theme.colors.background}`} gridTemplateRows="30px 30px 30px" height="90px">
            <Grid gridTemplateColumns="1fr 1fr">
                <Flex>
                    <Text fontWeight={600} fontSize={12}>{cart?.product?.name}</Text>
                    <Tag height="70%" justifySelf="start" fontSize={11} ml={2} size="sm" background="#c9cfd4">{cart?.quantity}</Tag>
                </Flex>
                <Flex justifySelf="end">
                    <Text fontWeight={600} fontSize={14}>{`R ${200}.00`}</Text>
                </Flex>
            </Grid>
            <Grid gridTemplateColumns="1fr 1fr">
                <Flex>
                    <Text fontSize={14}>Delivery</Text>
                </Flex>
                <Flex justifySelf="end">
                    <Text fontWeight={500} fontSize={12}>{`R ${1000}.00`}</Text>
                </Flex>
            </Grid>
            <Grid gridTemplateColumns={"1fr 1fr"}>
                <Flex>
                    <Text fontSize={"11px"}>Trade Finance Margin (10%)</Text>
                </Flex>
                <Flex justifySelf="end">
                    <Text fontWeight={500} fontSize={12}>{`R ${200}.00`}</Text>
                </Flex>
            </Grid>
        </Grid>
    );
};

export default OrderItemComponent;
