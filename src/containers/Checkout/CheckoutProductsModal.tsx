import * as React from 'react';
import { Grid, Button, Flex, FlexProps } from '@chakra-ui/core';

import ProductCard from "../../components/Card/ProductCard";

import { CartProduct } from '../Cart';
import { ModalWrap } from '../../components';

type CheckoutModalProps = FlexProps & {
    products: CartProduct[]
    setShowCheckoutModal: React.Dispatch<React.SetStateAction<boolean | undefined>>
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ setShowCheckoutModal, products }) => {
    return(
      <ModalWrap
          title="Items To Be Delivered"
          isOpen={true}
          onClose={() => setShowCheckoutModal(false)}
          isCentered
        >
            <Flex padding={5} pb={0}>
                <Grid gridTemplateRows="150px 1fr 1fr 1fr">
                    {
                        products?.map((product: CartProduct, index: number) => {
                            return(
                                <ProductCard
                                    isCart={false}
                                    editing={false}
                                    isWishlist={false}
                                    width={"100%"}
                                    product={product?.product}
                                    key={`${product?.product?.id}-${index}`}
                                    handleClick={() => {}}
                                    handleIconClick={() => {}}
                                />
                            );
                        })
                    }
                    <Button width="100%" mt={4} mb={4} variantColor="brand" onClick={() => setShowCheckoutModal(false)}>
                        CONTINUE CHECKOUT
                    </Button>
                </Grid>
            </Flex>
      </ModalWrap>
    );
};    

export default CheckoutModal;
