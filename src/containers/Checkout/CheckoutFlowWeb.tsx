import * as React from "react";
import styled from "@emotion/styled";

import { Form, Formik } from "formik";
import { useHistory } from "react-router";
import { Flex, Grid } from "@chakra-ui/core";

import NextButton from "./Button";
import NoData from "./NoDataScreen";
import DeliveryAddresses from "./Addresses";
import DeliveryAddressForm from "./DeliveryAddressForm";

import { theme } from "../../theme";
import { PageWrap } from "../../layouts";
import { Stepper } from "../../components";
import { H3, Text } from "../../typography";
import { CheckoutProps, initialDeliveryAddressValues, DeliveryAddressValidation } from ".";

const StepperContainer = styled.div`
    margin-top: 15px;
`;
const Step = styled.div``;

const CheckoutFlowWeb: React.FC<CheckoutProps> = ({
    active,
    addresses,
    setActiveStep,
    noAddressDataHeader,
    noAddressDataCaption,
}) => {
    const history = useHistory();
    const numberOfAddresses = addresses?.length;
    const cancelButtonStyles = { textDecoration: "underline", cursor: "pointer"};
    const handleCancelButtonClicked = () => {
        history.push("/cart");
    };
    const firstStage = active === 0;
    const deliveryAddressInfoStage = active === 0;
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
                        boxShadow={theme.boxShadowMedium}
                    >
                        <Grid gridTemplateRows="20px 45px">
                            <Flex justify="space-between">
                                <H3 textAlign="left" fontSize={18} fontWeight={600}>Select Delivery Address</H3>
                                <Text fontSize="12px" color={theme.colors.blueText} style={cancelButtonStyles} onClick={handleCancelButtonClicked}>Cancel</Text>
                            </Flex>
                            <StepperContainer style={{ marginTop: 15 }}>
                                <Stepper activeStep={active}>
                                    <Step />
                                    <Step />
                                    <Step />
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
                            boxShadow={theme.boxShadowMedium}
                        
                        >
                            <Formik
                                validationSchema={DeliveryAddressValidation}
                                initialValues={initialDeliveryAddressValues}
                                onSubmit={() => {}}
                            >
                                {() => {
                                    return (
                                        <Form style={{ width: "100%" }}>
                                            { deliveryAddressInfoStage && <DeliveryAddressForm />}

                                            <Flex>
                                                { deliveryAddressInfoStage && (
                                                    <NextButton
                                                        active={active}
                                                        setActive={setActiveStep}
                                                    >
                                                        ADD NEW ADDRESS
                                                    </NextButton>
                                                )}
                                            </Flex>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </Flex>
                        <Flex>
                            {
                                !numberOfAddresses
                                    ? (
                                        <NoData
                                            header={noAddressDataHeader}
                                            caption={noAddressDataCaption}
                                        />
                                    )
                                    : (
                                        <Grid gridTemplateRows="1fr 30px" width="100%">
                                             {
                                                firstStage && numberOfAddresses && (
                                                    <DeliveryAddresses
                                                        mobileFlow={false}
                                                        addresses={addresses}
                                                        setActive={setActiveStep}
                                                    />
                                                )
                                            }
                                        </Grid>
                                    )
                            }
                        </Flex>
                    </Grid>
                </Grid>
            </PageWrap>
        </React.Fragment>
    );
};

export default CheckoutFlowWeb;