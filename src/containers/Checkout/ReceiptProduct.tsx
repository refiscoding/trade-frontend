import * as React from "react";

import { Grid, Flex, Tag } from "@chakra-ui/core";
import { Text } from "../../typography";
import { theme } from "../../theme";

import {
    Product
} from "../../generated/graphql";

type ReceiptProductComponentProps = {
    product: Product
    quantity: number
    tradeFinanceMargin: number
    deliveryFee: number
    mobileFlow: boolean
};

const ReceiptProductComponent: React.FC<ReceiptProductComponentProps> = ({ product, quantity, tradeFinanceMargin, deliveryFee, mobileFlow }) => {
    const { price } = product;
    return(
        <Grid borderBottom={`1px solid ${theme.colors.background}`} gridTemplateRows="30px 30px 30px" height="90px">
            <Grid gridTemplateColumns="1fr 1fr">
                <Flex>
                    <Text fontWeight={600} fontSize={14}>{ product?.name }</Text>
                    <Tag height="70%" justifySelf="start" fontSize={11} ml={2} size="sm" background="#B6DAF5" color="#004A81">{ quantity }</Tag>
                </Flex>
                <Flex justifySelf="end">
                    <Text fontWeight={600} fontSize={14}>{ `${price?.currency} ${price?.pricePerUnit ? price?.pricePerUnit * quantity : price?.pricePerUnit}.00`}</Text>
                </Flex>
            </Grid>
            <Grid gridTemplateColumns="1fr 1fr">
                <Flex>
                    <Text fontSize={14}>Delivery</Text>
                </Flex>
                <Flex justifySelf="end">
                    <Text fontWeight={500} fontSize={12}>{`R ${deliveryFee}.00`}</Text>
                </Flex>
            </Grid>
            <Grid gridTemplateColumns={mobileFlow ? "1fr 150px" : "1fr 1fr"}>
                <Flex>
                    <Text fontSize={mobileFlow ? "11px" : ""}>Trade Finance Margin (10%)</Text>
                </Flex>
                <Flex justifySelf="end">
                    <Text fontWeight={500} fontSize={12}>{`R ${tradeFinanceMargin}.00`}</Text>
                </Flex>
            </Grid>
        </Grid>
    );
};

export default ReceiptProductComponent;
