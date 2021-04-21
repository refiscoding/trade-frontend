import * as React from "react";
import styled from "@emotion/styled";

import { isEmpty } from "lodash";
import { Form, Formik } from "formik";
import { useHistory } from "react-router";
import { Flex, Grid, Tag } from "@chakra-ui/core";

import NextButton from "./Button";
import NoData from "./NoDataScreen";
import DeliveryAddresses from "./Addresses";
import DeliveryDetails from "./DeliveryDetails";
import DeliveryAddressForm from "./DeliveryAddressForm";
import ProductCard from "../../components/Card/ProductCard";
import DeleteItemsModal from "../../components/DeleteItemsModal";

import { theme } from "../../theme";
import { CartProduct } from "../Cart";
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
    timeSlots,
    cartProducts,
    setActiveStep,
    selectedAddress,
    setSelectedAddress,
    noAddressDataHeader,
    noAddressDataCaption,
    showDeleteItemsModal,
    setShowDeleteItemsModal,
}) => {
    const history = useHistory();
    const numberOfAddresses = addresses?.length;
    const cancelButtonStyles = { textDecoration: "underline", cursor: "pointer"};
    const handleCancelButtonClicked = () => {
        history.push("/cart");
    };
    const deliveryAddressInfoStage = active === 0;
    const confirmOrderStage = active === 1;
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
                {
                    showDeleteItemsModal && (
                        <DeleteItemsModal
                            handleCancelButtonClicked={() => {}}
                            handleDeleteButtonClicked={() => {}}
                        />
                    )
                }
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
                                {({ errors }) => {
                                    return (
                                        <Form style={{ width: "100%" }}>
                                            { deliveryAddressInfoStage && (
                                                <Flex flexDirection="column">
                                                    <DeliveryAddressForm />
                                                    <Flex mt={35}>
                                                        <NextButton
                                                            type="submit"
                                                            active={active}
                                                            disabled={!isEmpty(errors)}
                                                            setActive={() => {}}
                                                        >
                                                            ADD NEW ADDRESS
                                                        </NextButton>
                                                    </Flex>
                                                </Flex>
                                            )}
                                            {
                                                confirmOrderStage && (
                                                    <Flex flexDirection="column">
                                                        <DeliveryDetails
                                                            timeSlots={timeSlots}
                                                            mobileFlow={false}
                                                        />
                                                    </Flex>
                                                )
                                            }
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
                                        <Grid gridTemplateRows="1fr 40px" width="100%">
                                             {
                                                deliveryAddressInfoStage && (
                                                    <DeliveryAddresses
                                                        mobileFlow={false}
                                                        addresses={addresses}
                                                        setActive={setActiveStep}
                                                        setSelectedAddress={setSelectedAddress}
                                                        setShowDeleteItemsModal={setShowDeleteItemsModal}
                                                    />
                                                )
                                            }
                                            {
                                                confirmOrderStage && (
                                                    <Flex flexDirection="column">
                                                        <Grid
                                                            p={4}
                                                            borderRadius={5}
                                                            background={theme.colors.accent[50]}
                                                            boxShadow={theme.boxShadowMedium}
                                                            gridTemplateColumns="1fr 50px"
                                                        >
                                                           <Flex>
                                                                <Text fontSize={14}>{ selectedAddress?.street },</Text>
                                                                <Text ml={2} mr={2} fontSize={14}>{ selectedAddress?.cityOrTown } </Text>
                                                                <Text fontSize={14}>({ selectedAddress?.contact })</Text>
                                                           </Flex>
                                                            <Flex justifySelf="end">
                                                                <Tag fontSize={12} mr={1} size="sm" background={theme.colors.tag} color={theme.colors.tagText}>{ selectedAddress?.type?.toUpperCase() }</Tag>
                                                            </Flex>
                                                        </Grid>
                                                        <Flex mt={4} width="100%" flexDirection="column" overflowY="scroll" maxHeight="600px">
                                                            {
                                                                cartProducts?.map((product: CartProduct) => (
                                                                    <ProductCard
                                                                        key={`${product?.product?.id}_${Math.random()}`}
                                                                        width="100%"
                                                                        isCart={false}
                                                                        editing={false}
                                                                        isWishlist={false}
                                                                        product={product?.product}
                                                                        handleClick={() => {}}
                                                                        handleIconClick={() => {}}
                                                                    />
                                                                ))
                                                            }
                                                        </Flex>
                                                    </Flex>
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