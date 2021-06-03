import * as React from "react";

import { Grid, Flex, Tag } from "@chakra-ui/core";
import { Text } from "../../typography";
import { theme } from "../../theme";

import {
    Product, Maybe
} from "../../generated/graphql";

type ReceiptProductComponentProps = {
    product: Maybe<Product> | undefined
    quantity: Maybe<number> | undefined
    mobileFlow: boolean
};

const ReceiptProductComponent: React.FC<ReceiptProductComponentProps> = ({ product, quantity, mobileFlow }) => {

    return (
        <Grid borderBottom={`1px solid ${theme.colors.background}`} gridTemplateRows="30px 30px" height="90px">
            <Grid gridTemplateColumns="1fr 1fr">
                <Flex>
                    <Text fontWeight={600} fontSize={14}>{product?.name}</Text>
                    <Tag height="70%" justifySelf="start" fontSize={11} ml={2} size="sm" background="#B6DAF5" color="#004A81">{quantity}</Tag>
                </Flex>
                <Flex justifySelf="end">
                    <Text fontWeight={600} fontSize={14}>{`${product?.currency} ${product?.tradeFedCost ? product?.tradeFedCost * (quantity || 1) : product?.tradeFedCost}.00`}</Text>
                </Flex>
            </Grid>
        </Grid>
    );
};

export default ReceiptProductComponent;
