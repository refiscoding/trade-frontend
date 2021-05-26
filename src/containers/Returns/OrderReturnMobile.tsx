import * as React from 'react'

import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";

import { Form, Formik } from 'formik'
import { ArrowLeft } from "react-feather";
import { useHistory } from 'react-router-dom';
import { Flex, Button, Grid, Spinner } from '@chakra-ui/core'

import { theme } from "../../theme";
import { OrderReturnsProps } from ".";
import { Text } from "../../typography";
import { Order } from '../../generated/graphql';
import { ConnectedFormGroup } from '../../components/FormElements';

dayjs.extend(RelativeTime);

const OrderReturns: React.FC<OrderReturnsProps> = ({ orders, fetchingOrders, pastOrders, activeOrders }) => {
    const history = useHistory();

    const handleBackArrow = () => {
        history.push("/orders");
    };

    return (
        <Flex width="100%" flexDirection="column">
            <Flex onClick={handleBackArrow} mb={4} cursor="pointer">
                <ArrowLeft />
                <Text ml={3} fontWeight={600} >{"Order History"}</Text>
            </Flex>
            <Flex margin="auto" width="100%" flexDirection="column">
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
                <Text mt={5} fontWeight={600} fontSize={14}>{`All Past Orders (${pastOrders ? pastOrders?.length : ''}`})</Text>
                <Flex flexDirection="column" height={"300px"} overflowY="scroll">
                    <Grid
                        mt={3}
                        p={4}
                        background={theme.colors.accent[50]}
                        borderRadius="5px"
                        boxShadow={theme.boxShadowMedium}
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
                                    <Text fontSize={12}>{order?.deliveryAddress?.name || "Home"}</Text>
                                </Flex>
                            ))
                        }
                    </Grid>
                </Flex>
                <Flex flexDirection="column" mt={5} height={"300px"} overflowY="scroll">
                    <Text fontWeight={600} fontSize={14}>{`All Active Orders (${activeOrders ? activeOrders?.length : ''}`})</Text>
                    <Grid
                        mt={3}
                        p={4}
                        background={theme.colors.accent[50]}
                        borderRadius="5px"
                        boxShadow={theme.boxShadowMedium}
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
            </Flex>
        </Flex>
    )
}

export default OrderReturns