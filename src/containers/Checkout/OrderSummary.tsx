import * as React from "react";

import { Grid, Flex } from "@chakra-ui/core";
import { Text } from "../../typography";
import { CartProduct } from "../Cart";
import ReceiptProduct from "./ReceiptProduct";

import { theme } from "../../theme";

import { timeSlots } from "./dummyData";
import { TimeSlot } from "./AddressComponent";
import { ComponentLocationAddress } from '../../generated/graphql'


type OrderSummaryComponentProps = {
    cartProducts: CartProduct[]
    tradeFinanceMargin: number
    deliveryFee: number
    checkoutTotal: number
    mobileFlow: boolean
    selectedDeliveryTimeslot: string | undefined
    selectedDeliveryDate: Date | Date[]
    selectedAddress: ComponentLocationAddress | undefined
    setActiveStep: (step: number) => void
}

const OrderSummaryComponent: React.FC<OrderSummaryComponentProps> = ({ 
    cartProducts, 
    deliveryFee, 
    tradeFinanceMargin,
    checkoutTotal,
    mobileFlow,
    selectedDeliveryDate,
    selectedDeliveryTimeslot,
    selectedAddress,
    setActiveStep
    }) => {
        const selectedTimeSlot = timeSlots?.filter((slot: TimeSlot) => slot?.id === selectedDeliveryTimeslot);
        const selectedDate = selectedDeliveryDate?.toString()?.split("00:00:00")?.join("");

        const addressDetails = selectedAddress?.address?.split(",") ?? [];
        const addressStrings = addressDetails[0]?.split("-");
        const streetAddress = addressStrings[0]?.trim();
        const buildingOrComplex = addressStrings[1]?.trim();

        const CTAStyles = { textDecoration: "underline", cursor: "pointer" };

        const handleChangeDeliveryDateTime = () => {
            if(mobileFlow){
                setActiveStep(2);
            } else {
                setActiveStep(1);
            }
        }
        const handleChangeDeliveryAddress = () => {
            setActiveStep(0);
        }
    return (
        <Flex
            borderRadius={5}
            background={theme.colors.accent[50]}
            boxShadow="0 1px 2px 0 rgba(0,0,0,0.17)"
            p={4}
            flexDirection="column"
        >
            <Text mb={5} fontWeight={600}>Order Summary</Text>
            <Grid p={2} rowGap="10px" height="300px" overflowY="scroll" cursor="pointer">
                {
                    cartProducts?.map((item: CartProduct, index: number) => {
                        const { product, quantity } = item;
                        return <ReceiptProduct 
                                    key={`${index}_checkout_product`} 
                                    mobileFlow={mobileFlow}
                                    product={product} 
                                    quantity={quantity}
                                    tradeFinanceMargin={tradeFinanceMargin}
                                    deliveryFee={deliveryFee}
                                />
                    })
                }
            </Grid>
            <Grid my={6} gridTemplateColumns="1fr 1fr">
                <Text color={theme.colors.blueText} fontWeight={600}>Order Total</Text>
                <Flex justifySelf="end">
                    <Text color={theme.colors.blueText} fontWeight={600}>{`R ${checkoutTotal}.00`}</Text>
                </Flex>
            </Grid>
            <Grid mb={5} borderTop={`1px dashed #acacac}`}>
                <Text mt={5} fontWeight={600}>{`Delivery Method`}</Text>
                <Text mt={3}>{`Standard Delivery`}</Text>
                <Text fontSize={mobileFlow ? "14px" : ""}>{selectedDate}</Text>
                <Text fontSize={mobileFlow ? "14px" : ""}>{`${selectedTimeSlot[0]?.startTime} - ${selectedTimeSlot[0]?.endTime}`}</Text>
                <Text onClick={handleChangeDeliveryDateTime} mt={3} style={CTAStyles} color={theme.colors.blueText} fontSize={12} fontWeight={600}>{`Change`}</Text>
            </Grid>
            <Grid mb={5} borderTop={`1px dashed #acacac}`}>
                <Text mt={5} fontWeight={600}>{`Delivery Point`}</Text>
                <Text mt={3}>{selectedAddress?.name}</Text>
                <Text mt={3}>{streetAddress}</Text>
                <Text>{buildingOrComplex}</Text>
                <Text>{addressDetails[1]}</Text>
                <Text>{addressDetails[2]}</Text>
                <Text mt={3}>{selectedAddress?.postalCode}</Text>
                <Text onClick={handleChangeDeliveryAddress} mt={3} style={CTAStyles} color={theme.colors.blueText} fontSize={12} fontWeight={600}>{`Change`}</Text>
            </Grid>
        </Flex>
    )
};
export default OrderSummaryComponent;
