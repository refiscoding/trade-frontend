import * as React from "react";

import { ChevronRight } from 'react-feather'
import { Grid, GridProps, Flex, Tag } from '@chakra-ui/core';

import { AddressInput } from "./Input";
import { Text } from "../../typography";

export type Address = {
    name: string
    type: string
    street: string
    buildingComplex: string
    surburb: string
    cityOrTown: string
    postalCode: string
    contact: string
};
export type TimeSlot = {
    date: string
    startTime: string
    endTime: string
};

export type AddressComponentProps = GridProps & {
    mobileFlow: boolean
    address: Address
    setActiveStep: (step: number) => void 
    
};

type AddressDetailsComponent = {
    address: Address
};

const AddressDetailsCmponent: React.FC<AddressDetailsComponent> = ({ address }) => (
    <React.Fragment>
        <Text fontSize={14}>{ address?.street } </Text>
        <Text fontSize={14}>{ address?.buildingComplex } </Text>
        <Text fontSize={14}>{ address?.surburb } </Text>
        <Text fontSize={14}>{ address?.cityOrTown } </Text>
        <Text fontSize={14}>{ address?.postalCode } </Text>
        <Text mt={3} fontSize={14}>{ address?.contact } </Text>
    </React.Fragment>
);

const AddressComponent: React.FC<AddressComponentProps> = ({ address, mobileFlow, setActiveStep }) => {
    const numberOfColumns = mobileFlow ? "1fr" : "10px 1fr";
    const height = mobileFlow ? "220px": "170px";

    const clickHandler = mobileFlow ? () => setActiveStep(1) : undefined;

    return(
        <Grid gridTemplateColumns={numberOfColumns} width="100%" height={height} onClick={clickHandler}>
            { !mobileFlow && (<AddressInput type="checkbox" />)}
            <Grid gridTemplateRows={`30px 1fr 25px`} background="#fff" borderRadius="10px" boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)" width="95%" mb={5} ml={3} p={5} >
                <Grid gridTemplateColumns="1fr 1fr">
                    <Text fontSize={16} fontWeight={600}>{ address?.name }</Text>
                    <Flex justifySelf="end" alignSelf="start">
                        <Tag fontSize={12} mr={1} size="sm" background="#B6DAF5" color="#004A81">{ address?.type?.toUpperCase() }</Tag>
                    </Flex>
                </Grid>
                {
                    mobileFlow
                    ? (
                        <Grid gridTemplateColumns="1fr 20px">
                            <Flex flexDirection="column">
                                <AddressDetailsCmponent address={address} />
                            </Flex>
                            <Flex alignSelf="center">
                                <ChevronRight />
                            </Flex>
                        </Grid>
                    )
                    : ( <AddressDetailsCmponent address={address} /> )
                }
                <Grid gridTemplateColumns="30px 30px" mt={3}>
                    <Text
                        onClick={() => {}}
                        color="accent.500"
                        style={{ textDecoration: "underline", cursor:"pointer" }}
                        fontSize="12px"
                        fontWeight={600}
                    >Edit</Text>
                    <Text
                        onClick={() => {}}
                        color="accent.500"
                        style={{ textDecoration: "underline", cursor:"pointer" }}
                        fontSize="12px"
                        fontWeight={600}
                    >Delete</Text>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AddressComponent;
