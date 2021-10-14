import * as React from 'react'

import { Flex, FlexProps } from '@chakra-ui/core'
import { Plus, Star, ShoppingCart } from 'react-feather'

import { theme } from '../../../theme'

type WishlistButtonProps = FlexProps & {
  addToWishlist: boolean
  editing: boolean | undefined
  handleOnClick: () => void
}

const AddToWishlistButton: React.FC<WishlistButtonProps> = ({
  addToWishlist,
  editing,
  handleOnClick
}) => (
  <Flex
    position="absolute"
    alignItems="center"
    justifyContent="center"
    width="60px"
    height="35px"
    bg={`${addToWishlist ? '#5C88DA' : theme.colors.blueText}`}
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
      {addToWishlist ? <Star color="white" /> : <ShoppingCart color="white" />}
    </Flex>
  </Flex>
)
export default AddToWishlistButton
