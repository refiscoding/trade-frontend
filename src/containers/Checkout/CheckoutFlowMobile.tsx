import * as React from "react";

import { Form, Formik } from "formik";
import { Flex } from "@chakra-ui/core";
import { ChevronRight } from "react-feather";

import { H3 } from "../../typography";
import { Text } from "../../typography";
import { PageWrap } from "../../layouts";
import { Stepper } from "../../components";
import { DeliveryAddressValidation, initialDeliveryAddressValues, CheckoutProps } from ".";

import NextButton from "./Button";
import NoData from "./NoDataScreen";
import DeliveryAddresses from "./Addresses";
import ActionButton from "./ActionButton";
import DeliveryAddressForm from "./DeliveryAddressForm";

const CheckoutFlowMobile: React.FC<CheckoutProps> = ({
    active,
    addresses,
    setActiveStep,
    noAddressDataHeader,
    noAddressDataCaption,
}) => {
    const numberOfAddresses = addresses?.length;
    const addDeliveryAddressStage = active === 1;
    return(
        <React.Fragment>
            <PageWrap
                title="Checkout"
                alignSelf="center"
                width="100%"
            >
                <Flex width="100%" mb={4} flexDirection="column">
                    <H3 textAlign="left" fontSize={18} fontWeight={600}>
                        Select Delivery Address
                    </H3>
                </Flex>
                <Formik
                    validationSchema={DeliveryAddressValidation}
                    initialValues={initialDeliveryAddressValues}
                    onSubmit={() => {}}
                >
                    {() => {
                        return (
                            <Form style={{ width: "100%" }}>
                                <Stepper activeStep={active}>
                                    <ActionButton setActive={setActiveStep}>
                                        <Text fontSize={12}>Add a Delivery Address</Text>
                                        <ChevronRight />
                                    </ActionButton>
                                    <DeliveryAddressForm />
                                </Stepper>
                                <Flex>
                                    {
                                        !numberOfAddresses
                                            ? (
                                                <NoData
                                                    header={noAddressDataHeader}
                                                    caption={noAddressDataCaption}
                                                />
                                            )
                                            : addDeliveryAddressStage
                                                ? (
                                                    <NextButton
                                                        active={active}
                                                        setActive={setActiveStep}
                                                    >
                                                        NEXT
                                                    </NextButton>
                                                )
                                                : (
                                                    <DeliveryAddresses
                                                        mobileFlow
                                                        addresses={addresses}
                                                        setActive={setActiveStep}
                                                    />
                                                )
                                    }
                                </Flex>
                            </Form>
                        )
                    }}
                </Formik>
            </PageWrap>
        </React.Fragment>
    );
};

export default CheckoutFlowMobile;