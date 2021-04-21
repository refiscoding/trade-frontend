import * as React from 'react';
import styled from '@emotion/styled';

import { Flex, Grid } from '@chakra-ui/core';
import { ConnectedFormGroup } from '../../components/FormElements';

const Input = styled.input`
    align-self: center;
`;

type DeliveryAddressInfoProps = {
}

const DeliveryAddressInfo: React.FC<DeliveryAddressInfoProps> = () => {
    
  return (
    <Flex flexDirection="column" mb={20}>
        <ConnectedFormGroup label="Card Description*" name="cardDescription" type="text" />
        <ConnectedFormGroup label="Name on Card*" name="nameOnCard" type="text" />
        <ConnectedFormGroup label="Card Number*" name="cardNumber" type="text" />
        <Flex justifyContent="space-between">
            <ConnectedFormGroup mr={3} label="Expiry Month*" name="expiryMonth" type="text" />
            <ConnectedFormGroup label="Expiry Year*" name="expiryYear" type="text" />
        </Flex>
        <ConnectedFormGroup label="CVV Number*" name="CVV" type="text" />
        <Grid gridTemplateColumns="20px 1fr" alignContent="center">
            <Input type="checkbox" />
            <Flex justifySelf="start">
                Use as my default card
            </Flex>
        </Grid>
    </Flex>
  )
}

export default DeliveryAddressInfo
