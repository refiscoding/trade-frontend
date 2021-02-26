import * as React from 'react'
import { Flex, Image, Text, Checkbox } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'

import { Card } from '../../index'
import CardFooter from '../CardFooter'
import { Product } from '../../../generated/graphql'

import AddToWishlistButton from "./AddToWishlistButton";

type ProductCardProps = FlexProps & {
  product: Product
  handleClick: (id: string) => void
  isWishlist?: Boolean
  editing?: Boolean
};

const ProductCard: React.FC<ProductCardProps> = ({ product, handleClick, isWishlist, editing }) => {

  const handleRadioPressed = (newProduct: string) => {
    console.log("NEW PRODUCT", newProduct);
  };
  return (
      <Flex width="100%" justifyContent="space-between" alignItems="center">
          { isWishlist && editing && (
            <Checkbox 
              name={product?.id} 
              value={product?.id} 
              size="md" 
              onChange={(event) => handleRadioPressed(event?.target?.value)}
            />) 
          }
          <Card
            m={2}
            width="100%"
            height="150px"
            flexDirection="row"
            onClick={() => handleClick(product.id)}
            cursor="pointer"
          >
          <Flex width="50%" position="relative">
            <Image
              mr={5}
              width="90%"
              height="100%"
              src={`${process.env.REACT_APP_API_HOST}${product.coverImage?.url}`}
            />
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
          <CardFooter width="50%" bg="white" height="100%" justifyContent="center">
            <Text my={2} fontSize="14px" fontWeight={600}>
              {product.name}
            </Text>
            <Text fontSize="10px" maxHeight="60%" overflow="hidden">
              {product.shortDescription}
            </Text>
            <Text mt={4} mb={1} fontSize="10px">
              Retail: {`${product?.price?.currency} ${product?.price?.retailPricePerUnit}`}
            </Text>
            <Text
              mb={2}
              fontSize="14px"
              fontWeight={600}
            >
              {`${product?.price?.currency} ${product?.price?.pricePerUnit}`}
            </Text>
            {
              isWishlist && (<AddToWishlistButton addToWishlist={false} editing={editing}/>)
            }
          </CardFooter>
        </Card>
      </Flex>
  )
}

export default ProductCard
