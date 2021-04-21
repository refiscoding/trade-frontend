import * as React from "react";

import { isEmpty } from "lodash";
import { Form, Formik } from "formik";
import { Flex, Grid } from "@chakra-ui/core";
import { ChevronRight } from "react-feather";

import { theme } from "../../theme";
import { PageWrap } from "../../layouts";
import { Stepper } from "../../components";
import { H3, Text } from "../../typography";
import { TimeSlot } from "./AddressComponent";
import { DeliveryAddressValidation, initialDeliveryAddressValues, CheckoutProps, SelectedAddress } from ".";

import NextButton from "./Button";
import NoData from "./NoDataScreen";
import ActionButton from "./ActionButton";
import DeliveryAddresses from "./Addresses";
import DeliveryDetails from "./DeliveryDetails";
import DeliveryAddressForm from "./DeliveryAddressForm";
import CheckoutItemsModal from "./CheckoutProductsModal";
import DeleteItemsModal from "../../components/DeleteItemsModal";

type DeliveryItemsComponentProps = {
    handleViewDeliveryItemsClicked: () => void
    selectedAddress: SelectedAddress | undefined
};

const DeliveryItemsComponent: React.FC<DeliveryItemsComponentProps> = ({ handleViewDeliveryItemsClicked, selectedAddress }) => {
    const actionTextStyle = { textDecoration: "underline", cursor:"pointer" };
    return (
        <Grid
            p={5}
            mb={5}
            width="100%"
            borderRadius="5px"
            gridTemplateRows="40px 1fr"
            boxShadow={theme.boxShadowLight}
            backgroundColor={theme.colors.accent[50]}
        >
            <Flex justify="space-between">
                <Text fontWeight={600}>Delivery Address</Text>
                <Text onClick={handleViewDeliveryItemsClicked} fontSize={12} style={actionTextStyle} color={theme.colors.blueText}>Show Delivery Items</Text>
            </Flex>
            <Flex 
                flexDirection="column"
            >
                <Text fontSize={14}>{ selectedAddress?.street } </Text>
                <Text fontSize={14}>{ selectedAddress?.buildingComplex } </Text>
                <Text fontSize={14}>{ selectedAddress?.surburb } </Text>
                <Text fontSize={14}>{ selectedAddress?.cityOrTown } </Text>
                <Text fontSize={14}>{ selectedAddress?.postalCode } </Text>
                <Text mt={3} fontSize={14}>{ selectedAddress?.contact } </Text>
            </Flex>
        </Grid>
    );
};

type DeliveryInfoComponentProps = {
    timeSlots: TimeSlot[]
};

const DeliveryInfoComponent: React.FC<DeliveryInfoComponentProps> = ({ timeSlots }) => {
    return (
        <Flex flexDirection="column">
            <Flex
                p={3}
                pr={0}
                borderRadius={5}
                background={theme.colors.accent[50]}
                boxShadow={theme.boxShadowMedium}
            >
                <DeliveryDetails
                    mobileFlow
                    timeSlots={timeSlots}
                />
            </Flex>
        </Flex>
    );
};

const CheckoutFlowMobile: React.FC<CheckoutProps> = ({
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
   const [showCheckoutItemsModal, setShowCheckoutItemsModal] = React.useState<boolean>();

    const numberOfAddresses = addresses?.length;
    const firstStage = active === 0;
    const addDeliveryAddressStage = active === 1;

    const handleViewDeliveryItemsClicked = () => {
        setShowCheckoutItemsModal(true);
    };

    return(
        <React.Fragment>
            <PageWrap
                title="Checkout"
                alignSelf="center"
                width="100%"
            >
                {
                    showDeleteItemsModal && (
                        <DeleteItemsModal
                            handleCancelButtonClicked={() => {}}
                            handleDeleteButtonClicked={() => {}}
                        />
                    )
                }
                {
                    showCheckoutItemsModal && (
                        <CheckoutItemsModal
                            products={cartProducts}
                            setShowCheckoutModal={setShowCheckoutItemsModal}
                        />
                    )
                }
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
                    {({ errors }) => {
                        return (
                            <Form style={{ width: "100%" }}>
                                <Stepper activeStep={active}>
                                    <ActionButton setActive={setActiveStep}>
                                        <Text fontSize={12}>Add a Delivery Address</Text>
                                        <ChevronRight />
                                    </ActionButton>
                                    <DeliveryAddressForm />
                                    <DeliveryItemsComponent
                                        selectedAddress={selectedAddress}
                                        handleViewDeliveryItemsClicked={handleViewDeliveryItemsClicked}
                                    />
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
                                            : firstStage
                                                ? (
                                                    <DeliveryAddresses
                                                        mobileFlow
                                                        addresses={addresses}
                                                        setActive={setActiveStep}
                                                        setShowDeleteItemsModal={setShowDeleteItemsModal}
                                                        setSelectedAddress={setSelectedAddress}
                                                    />
                                                )
                                                : addDeliveryAddressStage
                                                    ? (
                                                        <NextButton
                                                            type="submit"
                                                            active={active}
                                                            disabled={!isEmpty(errors)}
                                                            setActive={() => setActiveStep(0)}
                                                        >
                                                            NEXT
                                                        </NextButton>
                                                    )
                                                    : (
                                                        <DeliveryInfoComponent timeSlots={timeSlots} />
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
