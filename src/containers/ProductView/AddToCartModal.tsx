import * as React from 'react';
import { Image, Grid, Button, Flex, Select, FlexProps } from '@chakra-ui/core';

import { ModalWrap } from '../../components';
import { Text } from "../../typography";

type AddToCartModalProps = FlexProps & {
    handleContinueShoppingButtonClicked: () => void
    handleGoToCartButtonClicked: () => void
    handleCancelButtonClicked: () => void
    product: any
};
type CartModalProductComponentProps = FlexProps & {
    product: any
};

const CartModalProductComponent: React.FC<CartModalProductComponentProps> = ({ product }) => {
    return (
        <Grid gridTemplateColumns="repeat(2, 1fr)" border="1px solid #ececec" borderRadius={3} mb={3}>
            <Image
                width="100%"
                height="100%"
                borderBottomLeftRadius={3}
                borderTopLeftRadius={3}
                src={product?.coverImage?.url}
            />
            <Grid gridTemplateRows="25px 1fr" padding={2}>
                <Text fontSize="14px" fontWeight="bold">{ product?.name }</Text>  
                <Text fontSize="12px">{ product?.shortDescription }</Text>  
                <Text fontSize="12px" fontWeight="bold">{`${product?.price?.currency} ${product?.price?.retailPricePerUnit}.00`}</Text>  
            </Grid>
        </Grid>
    );
};

const QuantitySelectComponent: React.FC<CartModalProductComponentProps> = ({ product }) => {
    const packaging = product?.packaging;
    const units = product?.availableUnits;
    const packagingType = packaging === "perPack" ? "pack" : packaging;

    const getOptions = (units: number) => {
        for(let i = 0; i < units; i++){
            return (
                <option key={`${i}${Math.random()}`}>{`${i + 1} ${packagingType}`}</option>
            );
        }
    };
    return(
        <Grid gridTemplateRows="30px 1fr">
            <Text>Quantity: </Text>
            <Select focusBorderColor="accent.500">
                { getOptions(units) }
            </Select>
        </Grid>
    );
};

const AddToCartModal: React.FC<AddToCartModalProps> = ({ handleContinueShoppingButtonClicked, handleGoToCartButtonClicked, handleCancelButtonClicked, product }) => {
    return(
      <ModalWrap
          title="Item added to cart"
          isOpen={true}
          onClose={handleCancelButtonClicked}
          isCentered
        >
            <Flex padding={5} pb={0}>
                <Grid gridTemplateRows="150px 1fr 1fr 1fr">
                    <CartModalProductComponent product={product} />
                    <QuantitySelectComponent product={product}/>
                    <Button width="100%" mt={4} variantColor="brand" onClick={handleContinueShoppingButtonClicked}>
                        CONTINUE SHOPPING
                    </Button>
                    <Button width="100%" variant="outline" onClick={handleGoToCartButtonClicked}>
                        GO TO CART
                    </Button>
                </Grid>
            </Flex>
      </ModalWrap>
    );
};    

export default AddToCartModal;
