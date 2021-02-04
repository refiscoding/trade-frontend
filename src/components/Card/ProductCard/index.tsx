import { Flex, Image, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import * as React from 'react'
import CardFooter from '../CardFooter'
import { Card } from '../../index'
import { Product } from '../../../generated/graphql'

type ProductCardProps = FlexProps & {
  product: Product
  handleClick: (id: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleClick }) => {
  return (
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
          width="100%"
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
      <CardFooter pl={2} width="50%" bg="white" height="100%" justifyContent="center">
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
        >{`${product?.price?.currency} ${product?.price?.pricePerUnit}`}</Text>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
