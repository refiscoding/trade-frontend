import * as React from 'react'

import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";

import { Form, Formik } from 'formik'

import { useHistory } from 'react-router-dom';
import { Flex, Grid, Button, Spinner } from '@chakra-ui/core'

import { theme } from '../../theme';
import { OrderReturnsProps } from ".";
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography';
import { Order } from '../../generated/graphql';
import { ConnectedFormGroup } from '../../components/FormElements';

dayjs.extend(RelativeTime);


const OrderReturns: React.FC<OrderReturnsProps> = ({ orders, fetchingOrders, pastOrders, activeOrders }) => {
    const history = useHistory();
    const [currentPage, setCurrentPage] = React.useState<string>("past");
    const cancelStyles = {
        cursor: "pointer",
        textDecoration: "underline",
        color: theme.colors.blueText
    }
    const pastOrderPage = currentPage === "past";
    const activeOrderPage = currentPage === "active";

    const handleOrderHistoryClicked = () => {
        history.push("/orders");
    };
    return (
        <PageWrap title="Order Returns" alignSelf="center">
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
                            Return an Order
                        </H3>
                        <Text onClick={handleOrderHistoryClicked} fontSize={12} style={cancelStyles}>Order History</Text>
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
                    height="300px"
                >
                    <Flex flexDirection="column" width="100%">
                        <Flex justify="space-between" mb={5}>
                            <Button
                                width="40%"
                                variantColor="brand"
                                fontSize={12}
                                height="25px"
                                userSelect="none"
                                onClick={() => setCurrentPage("past")}
                                border={!pastOrderPage ? `1px solid ${theme.colors.brand[500]}` : ''}
                                background={!pastOrderPage ? "white" : ""}
                                color={!pastOrderPage ? `${theme.colors.brand[500]}` : "white"}
                            >
                                PAST
                            </Button>
                            <Button
                                width="40%"
                                variantColor="brand"
                                fontSize={12}
                                height="25px"
                                userSelect="none"
                                onClick={() => setCurrentPage("active")}
                                border={pastOrderPage ? `1px solid ${theme.colors.brand[500]}` : ''}
                                background={pastOrderPage ? "white" : ""}
                                color={pastOrderPage ? `${theme.colors.brand[500]}` : "white"}
                            >
                                ACTIVE
                            </Button>
                        </Flex>
                        <Formik initialValues={{ signatoryName: '', signatoryRelation: '' }} onSubmit={() => { }}>
                            <Form style={{ width: '100%' }}>
                                <ConnectedFormGroup label="Order ID*" name="orderId" type="text" placeholder="Eg. TFSA-aw3erdfsd" />
                                <ConnectedFormGroup label="Delivery Address Name" name="addressName" type="text" placeholder="Eg. Mum's Place" />
                                <Button
                                    mt={4}
                                    width="100%"
                                    type="submit"
                                    variantColor="brand"
                                >
                                    RETURN
                                </Button>
                            </Form>
                        </Formik>
                    </Flex>
                </Flex>
                <Flex
                    p={4}
                    mr={5}
                    borderRadius={5}
                    background={theme.colors.accent[50]}
                    boxShadow={theme.boxShadowMedium}
                    width="100%"
                    justify="space-between"
                    flexDirection="column"
                >
                    {
                        pastOrderPage && (
                            <React.Fragment>
                                <Text fontWeight={600} fontSize={14}>{`All Past Orders (${pastOrders ? pastOrders?.length : ''}`})</Text>
                                <Flex flexDirection="column">
                                    <Grid
                                        mt={3}
                                        p={4}
                                    >
                                        <Flex justify="space-between" mb={3} borderBottom={`1px dashed ${theme.colors.background}`} pb={3}>
                                            <Text fontWeight={600}>Order#</Text>
                                            <Text fontWeight={600}>Delivery Date</Text>
                                            <Text fontWeight={600}>Delivered To</Text>
                                        </Flex>
                                        {
                                            fetchingOrders && <Spinner margin="auto" />
                                        }
                                        {
                                            pastOrders?.map((order: Order, index: number) => (
                                                <Flex borderBottom={`1px dashed ${theme.colors.background}`} textAlign="left" key={`${index}_order_item`} justify="space-between" py={4}>
                                                    <Text fontSize={12}>{order?.orderNumber}</Text>
                                                    <Text fontSize={12}>{dayjs(order?.deliveryDate).fromNow()}</Text>
                                                    <Text fontSize={12}>{order?.deliveryAddress?.name}</Text>
                                                </Flex>
                                            ))
                                        }
                                    </Grid>
                                </Flex>
                            </React.Fragment>

                        )
                    }
                    {
                        activeOrderPage && (
                            <React.Fragment>
                                <Text fontWeight={600} fontSize={14}>{`All Active Orders (${activeOrders ? activeOrders?.length : ''}`})</Text>
                                <Flex flexDirection="column">
                                    <Grid
                                        mt={3}
                                        p={4}
                                    >
                                        <Flex justify="space-between" mb={3} borderBottom={`1px dashed ${theme.colors.background}`} pb={3}>
                                            <Text fontWeight={600}>Order#</Text>
                                            <Text fontWeight={600}>Delivery Date</Text>
                                            <Text fontWeight={600}>Delivered To</Text>
                                        </Flex>
                                        {
                                            fetchingOrders && <Spinner margin="auto" />
                                        }
                                        {
                                            activeOrders?.map((order: Order, index: number) => (
                                                <Flex borderBottom={`1px dashed ${theme.colors.background}`} textAlign="left" key={`${index}_order_item`} justify="space-between" py={4}>
                                                    <Text fontSize={12}>{order?.orderNumber}</Text>
                                                    <Text fontSize={12}>{dayjs(order?.deliveryDate).fromNow()}</Text>
                                                    <Text fontSize={12}>{order?.deliveryAddress?.name || "Home"}</Text>
                                                </Flex>
                                            ))
                                        }
                                    </Grid>
                                </Flex>
                            </React.Fragment>
                        )
                    }
                </Flex>
            </Grid>
        </PageWrap>
    )
}

export default OrderReturns
