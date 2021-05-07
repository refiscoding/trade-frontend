import * as React from 'react';

import { Flex, Grid, Tag } from '@chakra-ui/core';
import { DateRangePicker } from "react-dates";

import OrderItemsSummary from "./OrderItems";
import OrderComponent from './OrderComponent';
import NoData from "../Checkout/NoDataScreen";

import { theme } from '../../theme';
import { PageWrap } from '../../layouts';
import { H3, Text } from '../../typography';
import { orders } from "../Checkout/dummyData";
import { mapsScriptUrl } from '../../constants';
import { Order } from '.';

const OrdersPageWeb = () => {
    const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>();

    const cancelStyles = {
        cursor: "pointer",
        textDecoration: "underline",
        color: theme.colors.blueText
    }

    const noOrderClickedHeader = 'Select an order to view details';
    const noOrderClickedCaption = `
       You haven't selected any order to view its details.
       Selecting an order will have it displayed here
   `
    console.log("TRUE", selectedOrder);
    return (
        <PageWrap
            title="Orders"
            alignSelf="center"
            width="75%"
            mt={20}
            pt={0}
            p={0}
            script={mapsScriptUrl}
        >
            <Flex flexDirection="column">
                <Grid
                    pt={3}
                    pl={5}
                    pr={3}
                    width="76vw"
                    borderRadius={5}
                    background={theme.colors.accent[50]}
                    boxShadow={theme.boxShadowMedium}
                >
                    <Grid gridTemplateRows="20px 20px">
                        <Flex justify="space-between">
                            <H3 textAlign="left" fontSize={18} fontWeight={600}>
                                My Order History
                            </H3>
                            <Text fontSize={12} style={cancelStyles}>Home</Text>
                        </Flex>
                    </Grid>
                </Grid>
                <Grid mt={5} gridTemplateColumns="400px 693px">
                    <Flex
                        p={4}
                        mr={5}
                        borderRadius={5}
                        background={theme.colors.accent[50]}
                        boxShadow={theme.boxShadowMedium}
                    >
                        <Flex flexDirection="column">
                            <Text>Select Date Range:</Text>
                            <Flex mb={2}>
                                <DateRangePicker
                                    startDate={null}
                                    endDate={null}
                                    startDateId="start"
                                    endDateId="end"
                                    onDatesChange={() => console.log("TODO: Add Handler")}
                                    focusedInput={null}
                                    onFocusChange={() => console.log("TODO: Add Handler")}
                                />
                            </Flex>
                            <Flex flexDirection="column" overflowY="scroll" height={'500px'}>
                                {
                                    orders?.map(order => (<OrderComponent setSelectedOrder={setSelectedOrder} order={order} />))
                                }
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex
                        p={4}
                        mr={5}
                        borderRadius={5}
                        background={theme.colors.accent[50]}
                        boxShadow={theme.boxShadowMedium}
                        width="100%"
                    >
                        {
                            selectedOrder
                                ? <Flex flexDirection="column" width="100%">
                                    <Grid gridTemplateColumns="1fr 1fr" mb={3} border={`1px solid ${theme.colors.background}`} p={4} borderRadius={5} >
                                        <Flex flexDirection="column">
                                            <Grid gridTemplateColumns="1fr 1fr">
                                                <Text fontSize={14} fontWeight={600}>Order:</Text>
                                                <Text fontSize={14} ml={3}>{`# ${selectedOrder?.orderNumber}`}</Text>
                                            </Grid>
                                            <Grid gridTemplateColumns="1fr 1fr">
                                                <Text fontSize={14} fontWeight={600}>Ordered:</Text>
                                                <Text fontSize={14} ml={3}>{`${selectedOrder?.orderDate}`}</Text>
                                            </Grid>
                                            <Grid gridTemplateColumns="1fr 1fr">
                                                <Text fontSize={14} fontWeight={600}>Paid:</Text>
                                                <Text fontSize={14} ml={3}>{`${selectedOrder?.paidDate}`}</Text>
                                            </Grid>
                                            <Grid gridTemplateColumns="1fr 1fr">
                                                <Text fontSize={14} fontWeight={600}>Payment Type:</Text>
                                                <Text fontSize={14} ml={3}>Credit & Debit</Text>
                                            </Grid>
                                        </Flex>
                                        <Flex flexDirection="column" justifySelf="end">
                                            <Tag
                                                fontSize={12}
                                                size="sm"
                                                background="#c9cfd4"
                                                width="40%"
                                            >
                                                BUSINESS
                                            </Tag>
                                            <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.name}`}</Text>
                                            <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.address}`}</Text>
                                            <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.postalCode}`}</Text>
                                        </Flex>
                                    </Grid>
                                    <Flex minHeight="435px">
                                        <OrderItemsSummary isMobile={false} items={selectedOrder?.cart} />
                                    </Flex>
                                </Flex>
                                : <NoData header={noOrderClickedHeader} caption={noOrderClickedCaption} />
                        }

                    </Flex>
                </Grid>
            </Flex>
        </PageWrap >
    )
}

export default OrdersPageWeb
