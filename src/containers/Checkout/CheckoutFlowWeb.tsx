import * as React from "react";

import styled from "@emotion/styled";

import { Flex, Grid } from "@chakra-ui/core";
import { Form, Formik } from "formik";

import { PageWrap } from "../../layouts";
import { H3, Text } from "../../typography";
import { Stepper } from "../../components";

import { theme } from "../../theme";

const StepperContainer = styled.div`
    margin-top: 15px;
`;
const StepOne = styled.div``;

type CheckoutFlowWebProps = {};

const CheckoutFlowWeb: React.FC<CheckoutFlowWebProps> = () => {
    return(
        <React.Fragment>
            <PageWrap
                title="Checkout"
                alignSelf="center"
                width="75%"
                mt={20}
                pt={0}
                p={0}
            >
                <Grid gridTemplateRows="130px 1fr">
                    <Grid
                        p={5}
                        mt={5}
                        width="76vw"
                        borderRadius={5}
                        background={theme.colors.accent[50]}
                        boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.17)"
                    >
                        <Grid gridTemplateRows="20px 45px">
                            <Flex justify="space-between">
                                <H3 textAlign="left" fontSize={18} fontWeight={600}>Select Delivery Address</H3>
                                <Text fontSize="12px" color={theme.colors.blueText} style={{ textDecoration: "underline", cursor: "pointer"}}>Cancel</Text>
                            </Flex>
                            <StepperContainer style={{ marginTop: 15 }}>
                                <Stepper activeStep={0}>
                                    <StepOne />
                                </Stepper>
                            </StepperContainer>
                        </Grid>
                    </Grid>
                    <Grid mt={5} gridTemplateColumns="400px 693px">
                        <Flex
                            p={4}
                            mr={5}
                            borderRadius={5}
                            background={theme.colors.accent[50]}
                            boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.17)"
                        
                        >
                            <Formik
                                initialValues={{}}
                                onSubmit={() => {}}
                            >
                                {() => {
                                    return (
                                        <Form style={{ width: "100%" }}>
                                            Select Delivery Address
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </Flex>
                    </Grid>
                </Grid>
            </PageWrap>
        </React.Fragment>
    );
};

export default CheckoutFlowWeb;