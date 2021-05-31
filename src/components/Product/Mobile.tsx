import * as React from 'react';

import { MapPin, Briefcase } from "react-feather";
import { Flex, Image, Text, Button, Grid, Tag, Checkbox } from '@chakra-ui/core';

import Section from '../../components/Section';
import ProductCard from '../../components/Card/ProductCard';

import { theme } from "../../theme";
import { ProductProps } from "./props";
import { Product } from "../../generated/graphql";
import { VerifiedBadge } from "../../components/Product";
import { useHistory } from "react-router-dom";

const ProductComponentMobile: React.FC<ProductProps> = (
  { product,
    handleAddToWishlistClicked,
    handleAddToCartClicked,
    deals,
    productPackaging,
    isPreview
  }) => {
  const history = useHistory()

  const navigateToProduct = (id: string | undefined) => {
    history.push(`/product/${id}`)
  }

  return (
    <React.Fragment>
      <Flex mt="-1rem" width="100vw" height="250px" position="relative">
        <Image
          width="100%"
          height="100%"
          src={product?.coverImage?.url}
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
            right="20px"
            borderBottomLeftRadius={2}
            borderBottomRightRadius={2}
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
      <Flex flexDirection="column" width="414px" p={5} pt={0} background="accent.50" mb={2}>
        <Text my={2} fontSize="18px" fontWeight={600}>
          {product?.name}
        </Text>
        <VerifiedBadge />
        <Text fontSize="10px" maxHeight="60%" overflow="hidden" mt={3}>
          {product?.shortDescription}
        </Text>
        <Text mt={4} mb={1} fontSize="12px">
          Retail: {`${product?.price?.currency} ${product?.price?.retailPricePerUnit}`}
        </Text>
        <Text
          mb={2}
          fontSize="18px"
          fontWeight={600}
        >
          {`${product?.price?.currency} ${product?.price?.pricePerUnit}.00`}
        </Text>
        <Text fontSize="14px" color="#355EC0" fontWeight={600}>
          {`This item is sold per ${productPackaging}`}
        </Text>
        <Flex mt={2}>
          <Briefcase />
          <Text ml={3} fontSize="14px" >
            {`Supplied by ${product?.business?.name}`}
          </Text>
        </Flex>
        <Flex>
          <MapPin style={{ marginTop: 3 }} />
          <Text mt={2} ml={3} fontSize="12px" >
            {`Delivered from ${product?.business?.address?.address}`}
          </Text>
        </Flex>
        <Flex flexDirection="column" mt={3}>
          <Checkbox
            name="quantity"
            placeholder="Enter quantity eg. 3"
            style={{
              padding: 3,
              border: `1px solid ${theme.colors.background}`,
              width: "48%"
            }}
          />
        </Flex>
        <Grid gridTemplateColumns="200px 200px">
          <Button justifySelf="start" mt={4} width="90%" onClick={() => handleAddToWishlistClicked(product?.id)} border={`1px solid ${theme.colors.brand[500]}`} background="white">
            <Text fontSize="12px">
              ADD TO WISHLIST
            </Text>
          </Button>
          <Button mt={4} width="90%" variantColor="brand" onClick={() => handleAddToCartClicked(product?.id)}>
            <Text fontSize="12px">
              ADD TO CART
            </Text>
          </Button>
        </Grid>
      </Flex>
      <Flex flexDirection="column" width="414px" background="#ffffff" mb={2} p={5} pt={0}>
        <Section p="0 1rem" pb="0px" title="About This Product">
          <Flex width="100%" alignSelf="flex-start">
            <Text fontSize="12px">{product?.description}</Text>
          </Flex>
        </Section>
        <Section title="Product Features" p="0 1rem" pb="0px">
          <Flex ml="1rem" width="100%" as="ul" flexDirection="column" alignSelf="flex-start">
            {
              product?.features?.length
                ? (
                  <ul style={{ marginLeft: 15 }}>
                    {
                      product?.features?.map((feature: string) => (
                        <li key={feature}>
                          <Text fontSize="12px">{feature}</Text>
                        </li>
                      ))
                    }
                  </ul>
                )
                : (<Text fontSize="12px" ml={"-1rem"}>No Features Set</Text>)
            }
          </Flex>
        </Section>
        <Section title="Product Specifications" p="0 1rem" pb="0px">
          <Flex ml="1rem" width="100%" as="ul" flexDirection="column" alignSelf="flex-start">
            {
              product?.size
                ? (
                  <Flex flexDirection="column">
                    <Text fontSize="12px">Height : {product.size?.height}</Text>
                    <Text fontSize="12px">Width : {product.size?.width}</Text>
                    <Text fontSize="12px">Length : {product.size?.productLength}</Text>
                    <Text fontSize="12px">Weight : {product.size?.weight}</Text>
                  </Flex>
                )
                : (<Text>No Specifications Set</Text>)
            }
          </Flex>
        </Section>
        <Flex width="414px" background="#ffffff">
          {
            product?.tags?.map((tag: string, index: number) => (
              <Tag fontSize={12} mr={1} size="sm" key={index} background={theme.colors.tag} color={theme.colors.tagText}>{tag?.toUpperCase()}</Tag>
            ))
          }
        </Flex>
      </Flex>
      {isPreview &&
        <Flex flexDirection="column" width="414px" background="accent.50" p={5} pt={0}>
          <Section title="Deals You Might Be Interested In" width="100%">
            {deals?.slice(0, 2)?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
          <Button width="100%" variantColor="brand">
            <Text fontSize="12px">
              VIEW MORE
            </Text>
          </Button>
        </Flex>
      }
    </React.Fragment>
  )
}

export default ProductComponentMobile;
