import * as React from 'react';
import { Image, Grid, Button, Flex, Select, FlexProps } from '@chakra-ui/core';

import { Text } from "../../typography";
import { theme } from "../../theme";
import { ModalWrap } from '../../components';

type AddToCartModalProps = FlexProps & {
    handleContinueShoppingButtonClicked: () => void
    handleGoToCartButtonClicked: () => void
    handleCancelButtonClicked: () => void
    product: any
};
type CartModalProductComponentProps = FlexProps & {
    product: any
    noTitle?: boolean
};

const CartModalProductComponent: React.FC<CartModalProductComponentProps> = ({ product }) => {
    return (
        <Flex border={`1px solid ${theme.colors.background}`} borderRadius={5}>
            <Image
                width="50%"
                height="100%"
                objectFit="contain"
                borderBottomLeftRadius={3}
                borderTopLeftRadius={3}
                src={product?.coverImage?.url}
            />
            <Flex flexDirection="column" ml={3}>
                <Flex mt={2}>
                    <Text fontSize="14px" fontWeight="bold">{product?.name}</Text>
                </Flex>
                <Flex mb={2}>
                    <Text fontSize="12px">{product?.shortDescription}</Text>
                </Flex>
                <Flex width="100%">
                    <Text fontSize="12px" fontWeight="bold">{`${product?.currency} ${product?.tradeFedCost}.00`}</Text>
                </Flex>
            </Flex>

        </Flex>
    );
};

export const QuantitySelectComponent: React.FC<CartModalProductComponentProps> = ({ product, noTitle }) => {
    const packaging = product?.packaging;
    const units = product?.availableUnits;
    const packagingType = packaging === "perPack" ? "pack" : packaging;

    const getOptions = (units: number) => {
        for (let i = 0; i < units; i++) {
            return (
                <option key={`${i}${Math.random()}`}>{`${i + 1} ${packagingType}`}</option>
            );
        }
    };
    return (
        <Grid gridTemplateRows="30px 1fr">
            {!noTitle && <Text>Quantity: </Text>}
            <Select focusBorderColor="accent.500">
                {getOptions(units)}
            </Select>
        </Grid>
    );
};

const AddToCartModal: React.FC<AddToCartModalProps> = ({ handleContinueShoppingButtonClicked, handleGoToCartButtonClicked, handleCancelButtonClicked, product }) => {
    return (
        <ModalWrap
            title="Item added to cart"
            isOpen={true}
            onClose={handleCancelButtonClicked}
            isCentered
        >
            <Flex padding={5} pb={0}>
                <Grid gridTemplateRows="150px 1fr 1fr 1fr">
                    <CartModalProductComponent product={product} />
                    <QuantitySelectComponent product={product} />
                    <Button width="100%" mt={4} variantColor="brand" onClick={handleContinueShoppingButtonClicked}>
                        CONTINUE SHOPPING
                    </Button>
                    <Button justifySelf="start" mt={4} width="100%" onClick={handleGoToCartButtonClicked} border={`1px solid ${theme.colors.brand[500]}`} background="white">
                        <Text>
                            GO TO CART
                        </Text>
                    </Button>
                </Grid>
            </Flex>
        </ModalWrap>
    );
};

export default AddToCartModal;
