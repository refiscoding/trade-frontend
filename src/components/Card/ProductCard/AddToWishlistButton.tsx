import * as React from 'react';

import { Flex, FlexProps } from '@chakra-ui/core';
import { Plus, Star, ShoppingCart } from "react-feather";

type WishlistButtonProps = FlexProps & {
  addToWishlist: Boolean
  editing: Boolean | undefined
}

const AddToWishlistButton: React.FC<WishlistButtonProps> = ({ addToWishlist, editing }) => (
    <Flex
      position="relative"
      alignItems="center"
      justifyContent="center"
      width="60px"
      height="35px"
      padding="5px"
      bg={`${ addToWishlist ? "#313130" : "#355EC0"}`}
      flexDirection="column"
      top="0px"
      left={`${editing ? "116px" : "123px"}`}
      borderTopLeftRadius={10}
    >
      <Flex width="100%" mb={4} mt={4} justifyContent="space-between" alignItems="center">
        <Plus color="white" />
        {
          addToWishlist 
          ? <Star color="white" /> 
          : <ShoppingCart color="white" />}
      </Flex>
    </Flex>
);
export default AddToWishlistButton;
  