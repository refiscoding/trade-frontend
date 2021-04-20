import * as React from "react";

import { Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";

import { PageWrap } from "../../layouts";
import { H3 } from "../../typography";
import { Stepper } from "../../components";

type CheckoutFlowMobileProps = {};

const CheckoutFlowMobile: React.FC<CheckoutFlowMobileProps> = () => {
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
                    initialValues={{}}
                    onSubmit={() => {}}
                >
                    {() => {
                        return (
                            <Form style={{ width: "100%" }}>
                                <Stepper activeStep={0}>
                                    Select Delivery Address
                                </Stepper>
                            </Form>
                        )
                    }}
                    
                </Formik>
            </PageWrap>
        </React.Fragment>
    );
};

export default CheckoutFlowMobile;