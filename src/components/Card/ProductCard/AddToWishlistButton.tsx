import * as React from 'react';

import { Flex, FlexProps } from '@chakra-ui/core';
import { Plus, Star, ShoppingCart } from "react-feather";

type WishlistButtonProps = FlexProps & {
  addToWishlist: Boolean
  editing: Boolean | undefined
  handleOnClick: () => void
}

const AddToWishlistButton: React.FC<WishlistButtonProps> = ({ addToWishlist, editing,handleOnClick }) => (
    <Flex
      position="absolute"
      alignItems="center"
      justifyContent="center"
      width="60px"
      height="35px"
      bg={`${ addToWishlist ? "#313130" : "#355EC0"}`}
      flexDirection="column"
      bottom="8px"
      right="8px"
      borderTopLeftRadius={10}
      borderBottomRightRadius={4}
      onClick={handleOnClick}
      zIndex={20}
    >
      <Flex width="100%" p={2} mb={4} mt={4} justifyContent="space-between" alignItems="center">
        <Plus color="white" />
        {
          addToWishlist 
          ? <Star color="white" /> 
          : <ShoppingCart color="white" />}
      </Flex>
    </Flex>
);
export default AddToWishlistButton;
  