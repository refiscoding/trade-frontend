// CardComponent
import * as React from "react";
import { Grid, Flex } from "@chakra-ui/core";

import { AddressInput } from "./Input";

import { Text } from "../../typography";
import { theme } from "../../theme";

type CardComponentProps = {
    card: Card
    mobileFlow: boolean
    setShowDeleteCardModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
};

export type Card = {
    type: string
    cardDescription: string
    nameOnCard: string
    cardNumber: string
    expiryMonth: string,
    expiryYear: string,
    CVV: string
};

const CardComponent: React.FC<CardComponentProps> = ({ card, mobileFlow, setShowDeleteCardModal }) => {
    const numberOfColumns = mobileFlow ? "1fr" : "10px 1fr";
    const height = mobileFlow ? "220px": "170px";

    const handleEditAddressClicked = () => {
        console.log("TODO: WEB->Prepouate form");
        console.log("TODO: MOBILE->Set Step + Prepouate form");
    };
    const handleDeleteAddressClicked = () => {
        setShowDeleteCardModal(true);
    };

    const ctaTextStyles = { textDecoration: "underline", cursor:"pointer" };

    return (
        <Grid gridTemplateColumns={numberOfColumns} width="100%" height={height} >
            { !mobileFlow && (<AddressInput type="checkbox" />)}

            <Grid gridTemplateRows="30px 25px 25px 40px 25px" background={theme.colors.accent[50]} borderRadius="10px" boxShadow={theme.boxShadowLight} width="95%" mb={5} ml={3} p={5} >
                <Text fontWeight={600}>{ card?.cardDescription }</Text>

                <Grid gridTemplateColumns="1fr 1fr">
                    <Text fontWeight={600}>{ card?.type }</Text>
                    <Flex justifySelf="end" alignSelf="start">
                        { `**** ${card?.cardNumber}` }
                    </Flex>
                </Grid>
               
                <Flex>{`Expires ${card?.expiryMonth}/${card?.expiryYear}`}</Flex>
                <input style={{ outline: `1px solid ${theme.colors.background}`, marginTop: 10, marginBottom: 20, padding: 10 }} placeholder="Enter CVV" />

                <Grid gridTemplateColumns="30px 30px">
                    <Text
                        onClick={handleEditAddressClicked}
                        color="accent.500"
                        style={ctaTextStyles}
                        fontSize="12px"
                        fontWeight={600}
                    >Edit</Text>
                    <Text
                        onClick={handleDeleteAddressClicked}
                        color="accent.500"
                        style={ctaTextStyles}
                        fontSize="12px"
                        fontWeight={600}
                    >Delete</Text>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default CardComponent;
