import * as React from 'react';

import { useLocation } from "react-router";
import { Image, Grid, Button } from '@chakra-ui/core';
import { FlexProps } from '@chakra-ui/core/dist/Flex';

import { images } from '../../theme';
import ModalWrap from '../ModalWrap';
import { Text } from "../../typography";

type DeleteItemsModalProps = FlexProps & {
    handleCancelButtonClicked: () => void
    handleDeleteButtonClicked: () => void
    isCart?: boolean
};

const DeleteItemsModal: React.FC<DeleteItemsModalProps> = ({ handleCancelButtonClicked, handleDeleteButtonClicked, isCart }) => {
    const location = (((useLocation()).pathname)?.split("/"))[1];

    const cartAndWishlisText = `You are about to delete these items in your ${isCart ? 'cart' : 'wish list'}? Once they are removed, you’ll have to re-add them to your ${isCart ? 'cart' : 'wish list'} manually.`
    const confirmationText = location === "cart" || location === "wishlist" ? cartAndWishlisText : "You are about to remove one of your delivery addresses? Once you have removed it, you'll have to re-add it manually to your addresses"

    return(
      <ModalWrap
          title="Delete Items"
          isOpen={true}
          onClose={handleCancelButtonClicked}
          isCentered
        >
            <Grid gridTemplateRows="repeat(1fr, 2)" justifyItems="center" padding={5}>
                <Image src={images?.deleteItems} />
                <Text mt={4} fontSize="14px" textAlign="center">
                    { confirmationText }
                </Text>  
            </Grid>
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap="10px" padding={5}>
                <Button width="100%" onClick={handleCancelButtonClicked} mt={4}  variantColor="gray" variant="outline">
                    Cancel
                </Button>
                <Button width="100%" onClick={handleDeleteButtonClicked} mt={4} variantColor="brand">
                    Delete
                </Button>
            </Grid>
      </ModalWrap>
    );
};    

export default DeleteItemsModal;
