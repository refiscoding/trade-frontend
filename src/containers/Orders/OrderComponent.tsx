import * as React from "react";

import { ChevronRight } from "react-feather";
import { Flex, Grid, Image } from '@chakra-ui/core';

import { Text } from '../../typography';
import { theme, images } from '../../theme';
import { Order } from ".";


type OrderComponentProps = {
    setSelectedOrder: (val: Order) => void
    order: Order
};

const OrderComponent: React.FC<OrderComponentProps> = ({ setSelectedOrder, order }) => {
    const handleOrderClicked = () => {
        setSelectedOrder(order);
    };
    return (
        <Grid
            borderRadius="10px"
            boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
            backgroundColor="white"
            p={4}
            height="200px"
            width="350px"
            mt={5}
            cursor="pointer"
            onClick={handleOrderClicked}
        >
            <Flex justify="space-between" borderBottom={`1px solid ${theme.colors.background}`} ml={-8} mb={2} width="364px" pl={6} pb={3}>
                <Text fontWeight={600}>{`Delivered ${order?.deliveryDate}`}</Text>
                <ChevronRight />
            </Flex>
            <Flex mb={3}>
                <Text fontSize={12}>{`Signed by: ${order?.signatory?.name} (${order?.signatory?.relation})`}</Text>
            </Flex>
            <Flex>
                <Flex mt={3} ml={3}>
                    <Image height="50%" src={images.parcel} />
                </Flex>
                <Flex flexDirection="column" mt={3}>
                    <Text fontSize={14}>{`${order?.deliveryAddress?.name}`}</Text>
                    <Text fontSize={14}>{`${order?.deliveryAddress?.address}`}</Text>
                    <Text fontSize={14}>{`${order?.deliveryAddress?.postalCode}`}</Text>
                </Flex>
            </Flex>
        </Grid>

    );
};

export default OrderComponent