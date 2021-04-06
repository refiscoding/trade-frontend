import * as React from 'react'
import { Flex, Image, Text, Checkbox } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { Card } from '../../index'
import CardFooter from '../CardFooter'
import { Product } from '../../../generated/graphql'

import AddToWishlistButton from './AddToWishlistButton'
import {QuantitySelectComponent} from "../../../containers/ProductView/AddToCartModal";

type ProductCardProps = FlexProps & {
  product: Product
  handleClick: (id: string) => void
  isWishlist?: boolean
  isCart?: boolean
  editing?: boolean
  handleIconClick?: (id: string) => void
}
type ProductRemovalValues = {
  id: string
  checked: boolean | undefined
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleClick,
  isWishlist,
  isCart,
  editing,
  handleIconClick,
  ...rest
}) => {
  const handleRadioPressed = (newProduct: string, checked: boolean) => {
    const productsToRemove: ProductRemovalValues[] = []
    const data = {
      id: newProduct,
      checked
    }
    const existingProducts = localStorage.getItem('remove_from_wishlist')
    if (!existingProducts) {
      productsToRemove.push(data)
      localStorage.setItem('remove_from_wishlist', JSON.stringify(productsToRemove, null, 2))
    } else {
      const existingProductsObj = JSON.parse(existingProducts)
      const existingProductsObjWithoutCurrent = existingProductsObj.filter(
        (product: ProductRemovalValues) => !(product.id === newProduct)
      )
      localStorage.removeItem('remove_from_wishlist')
      const updatedArray = [...existingProductsObjWithoutCurrent, { ...data }]
      localStorage.setItem('remove_from_wishlist', JSON.stringify(updatedArray, null, 2))
    }
  }
  return (
    <Flex width={rest.width || "320px"} justifyContent="space-between" alignItems="center" position="relative">
      {(isCart || isWishlist) && editing && (
        <Checkbox
          name={product?.id}
          value={product?.id}
          size="md"
          onChange={(event) => handleRadioPressed(event?.target?.value, event?.target?.checked)}
        />
      )}
      <Card
        m={2}
        width="100%"
        height="150px"
        flexDirection="row"
        cursor="pointer"
      >
        <Flex width="160px" position="relative" onClick={() => handleClick(product.id)}>
          <Image width="100%" height="100%" src={product.coverImage?.url} />
          {product?.discount?.discountPercentage && product?.discount?.discountPercentage > 0 ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              width="50px"
              height="50px"
              position="absolute"
              bg="accent.700"
              flexDirection="column"
              top={0}
              right={0}
            >
              <Text color="white" fontSize="14px">
                Save
              </Text>
              <Text color="white" fontSize="14px" fontWeight={600}>
                {`${product?.discount?.discountPercentage}%`}
              </Text>
            </Flex>
          ) : null}
        </Flex>
        <CardFooter paddingLeft={2} width={rest.width ? "60%" : "160px"} bg="white" height="100%" justifyContent="center">
          <Text onClick={() => handleClick(product.id)} my={2} fontSize="14px" fontWeight={600}>
            {product.name}
          </Text>
          <Text onClick={() => handleClick(product.id)} fontSize="10px" maxHeight="60%" overflow="hidden">
            {product.shortDescription}
          </Text>
          {isCart &&  (
            <Flex alignItems="center" height="25px">
              <Text fontSize={12} mr={2}>Quantity: </Text>
              <QuantitySelectComponent noTitle width="100px" height="25px" product={product}/>
            </Flex>
            )}
          <Text mt={4} mb={1} fontSize="10px">
            Retail: {`${product?.price?.currency} ${product?.price?.retailPricePerUnit}`}
          </Text>
          <Text mb={2} fontSize="14px" fontWeight={600}>
            {`${product?.price?.currency} ${product?.price?.pricePerUnit}`}
          </Text>
            {isWishlist && <AddToWishlistButton addToWishlist={false} editing={editing} handleOnClick={() => handleIconClick && handleIconClick(product.id)} />}
            {isCart && <AddToWishlistButton addToWishlist editing={editing} handleOnClick={() => handleIconClick && handleIconClick(product.id)} />}
        </CardFooter>
      </Card>
    </Flex>
  )
}

export default ProductCard
