import * as React from 'react'

import { Flex, Image, Text, FlexProps, Spinner } from '@chakra-ui/core'
import { get } from 'lodash'

import { Card } from '../../index'
import { CartProduct } from '../../../containers/Cart'
import { Product, Maybe } from '../../../generated/graphql'
import { QuantitySelectComponent } from '../../../containers/ProductView/AddToCartModal'

import AddToWishlistButton from './AddToWishlistButton'
import CardFooter from '../CardFooter'
import Input from '../../Input'

type ProductCardProps = FlexProps & {
  product: Maybe<Product> | undefined
  products?: CartProduct[]
  handleClick: (id: Maybe<string> | undefined) => void
  isWishlist?: boolean
  isCart?: boolean
  editing?: boolean
  isLoading?: boolean
  handleIconClick?: (id: Maybe<string> | undefined) => void
}
type ProductRemovalValues = {
  id: string
  checked: boolean | undefined
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  products,
  handleClick,
  isWishlist,
  isCart,
  isLoading,
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

  const maxSellCost = get(product, 'maxSellCost') as number
  const tradeFedCost = get(product, 'tradeFedCost') as number
  const productsOnly = products?.filter(
    (entry: CartProduct) => entry?.product?.uniqueIdentifier === product?.uniqueIdentifier
  )

  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  return (
    <Flex
      width={rest.width || '320px'}
      justifyContent="space-between"
      alignItems="center"
      position="relative"
    >
      {isLoading && <Spinner color="brand.300" />}
      {(isCart || isWishlist) && editing && (
        <Input
          name={product?.uniqueIdentifier || ''}
          value={product?.uniqueIdentifier || ''}
          type="checkbox"
          onChange={(event) => handleRadioPressed(event?.target?.value, event?.target?.checked)}
        />
      )}
      <Card m={2} width="100%" height="150px" flexDirection="row" cursor="pointer">
        <Flex
          width="160px"
          position="relative"
          onClick={() => {
            if (product) {
              handleClick(product?.uniqueIdentifier)
            }
          }}
        >
          <Image width="100%" height="100%" src={product?.coverImage?.url || ''} />
          {discount ? (
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
              <Text color="black" fontWeight={600} fontSize="14px">
                Save
              </Text>
              <Text color="black" fontSize="14px" fontWeight={600}>
                {`${discount}%`}
              </Text>
            </Flex>
          ) : null}
        </Flex>
        <CardFooter
          paddingLeft={2}
          width={rest.width ? '60%' : '160px'}
          bg="white"
          height="100%"
          justifyContent="center"
        >
          <Text
            onClick={() => {
              if (product) {
                handleClick(product?.uniqueIdentifier)
              }
            }}
            my={2}
            fontSize="14px"
            fontWeight={600}
          >
            {product?.name}
          </Text>
          <Text
            onClick={() => {
              if (product) {
                handleClick(product?.uniqueIdentifier)
              }
            }}
            fontSize="10px"
            maxHeight="60%"
            overflow="hidden"
          >
            {product?.shortDescription}
          </Text>
          {isCart && (
            <Flex mt={2} alignItems="center" height="20px">
              <Flex>
                <QuantitySelectComponent
                  isCart
                  productId={product?.uniqueIdentifier || ''}
                  count={productsOnly && productsOnly[0]?.quantity}
                  available={product?.availableUnits as number}
                  setProductQuantity={() => {
                    return
                  }}
                />
              </Flex>
            </Flex>
          )}
          <Text mt={3} mb={1} fontSize="10px">
            Retail:{' '}
            {`${product?.currency} ${(
              (product?.maxSellCost || 0) * (productsOnly ? productsOnly[0]?.quantity : 1)
            ).toFixed(2)}`}
          </Text>
          <Text mb={2} fontSize="14px" fontWeight={600}>
            {`${product?.currency} ${(
              (product?.tradeFedCost || 0) * (productsOnly ? productsOnly[0]?.quantity : 1)
            ).toFixed(2)}`}
          </Text>
          {isWishlist && (
            <AddToWishlistButton
              addToWishlist={false}
              editing={editing}
              handleOnClick={() => {
                if (product && handleIconClick) {
                  handleIconClick(product?.uniqueIdentifier)
                }
              }}
            />
          )}
          {isCart && (
            <AddToWishlistButton
              addToWishlist
              editing={editing}
              handleOnClick={() => {
                if (product && handleIconClick) {
                  handleIconClick(product?.uniqueIdentifier)
                }
              }}
            />
          )}
        </CardFooter>
      </Card>
    </Flex>
  )
}

export default ProductCard
