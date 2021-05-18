import * as React from "react";

import moment from "moment";

import { useHistory } from "react-router";
import { Flex, Grid, Spinner } from "@chakra-ui/core";
import { DateRangePicker } from "react-dates";
import { ArrowLeft, ChevronRight } from "react-feather";

import PageWrap from "../../layouts/PageWrap";
import OrderItemsSummary from "./OrderItems";
import OrderComponent from './OrderComponent';

import { OrdersPageProps } from ".";
import { theme } from "../../theme";
import { Text } from "../../typography";

import { Order } from '../../generated/graphql'

const OrdersPage: React.FC<OrdersPageProps> = ({ orders, ordersLoading }) => {
    const history = useHistory();
    const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>();

    const handleArrowClicked = () => {
        if (selectedOrder) {
            setSelectedOrder(undefined);
        } else {
            history.push("/profile");
        };
    };

    return (
        <PageWrap title="Orders" width="100%">
            <Grid gridTemplateRows="50px 30px 50px 1fr" width="100%">
                <Flex cursor="pointer" onClick={handleArrowClicked}>
                    <ArrowLeft />
                    <Text ml={3} fontSize={16} fontWeight={600}>{`${selectedOrder ? 'Order Details' : 'My Order History'}`}</Text>
                </Flex>
                {
                    selectedOrder
                        ? (
                            <Flex flexDirection="column" justify="space-between">
                                <Flex
                                    borderRadius={5}
                                    boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
                                    background={theme.colors.accent[50]}
                                    p={3}
                                    flexDirection="column"
                                >
                                    <Grid gridTemplateColumns="90px 1fr">
                                        <Text fontSize={12} fontWeight={600}>Order:</Text>
                                        <Text fontSize={12} ml={3}>{`# ${selectedOrder?.orderNumber}`}</Text>
                                    </Grid>
                                    <Grid gridTemplateColumns="90px 1fr">
                                        <Text fontSize={12} fontWeight={600}>Ordered:</Text>
                                        <Text fontSize={12} ml={3}>{`${moment(selectedOrder?.orderDate).format("LLLL")}`}</Text>
                                    </Grid>
                                    <Grid gridTemplateColumns="90px 1fr">
                                        <Text fontSize={12} fontWeight={600}>Paid:</Text>
                                        <Text fontSize={12} ml={3}>{`${moment(selectedOrder?.paidDate).format("LLLL")}`}</Text>
                                    </Grid>
                                    <Grid gridTemplateColumns="90px 1fr">
                                        <Text fontSize={12} fontWeight={600}>Payment:</Text>
                                        <Text fontSize={12} ml={3}>Credit & Debit</Text>
                                    </Grid>
                                </Flex>
                                <OrderComponent setSelectedOrder={setSelectedOrder} order={selectedOrder} />
                                <OrderItemsSummary isMobile items={selectedOrder?.cart?.productsQuantities} total={selectedOrder?.orderTotal} />
                            </Flex>
                        )
                        : (
                            <React.Fragment>
                                <Text>Select Date Range:</Text>
                                <Flex width="100%">

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
                                <Flex
                                    mt={5}
                                    pl={5}
                                    height="50px"
                                    borderRadius="10px"
                                    boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
                                    width="100%"
                                    justify="space-between"
                                    alignItems="center"
                                    onClick={() => console.log("TODO: Add Handler")}
                                    backgroundColor="white"
                                >
                                    <Flex width="80%">
                                        <Text fontSize={12}>Return an order?</Text>
                                    </Flex>
                                    <ChevronRight />
                                </Flex>
                                <Flex flexDirection="column">
                                    {ordersLoading && <Spinner marginTop="20px" marginX="auto" />}
                                    {
                                        orders?.map((order, index) => (
                                            <OrderComponent key={`${index}_order_entry_mobile`} setSelectedOrder={setSelectedOrder} order={order} />
                                        ))
                                    }
                                </Flex>
                            </React.Fragment>
                        )
                }
            </Grid>
        </PageWrap>
    )

};
export default OrdersPage;