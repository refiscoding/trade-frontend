import * as React from 'react';

import { MapPin, Briefcase } from "react-feather";
import { Flex, Image, Text, Button, Grid, Tag } from '@chakra-ui/core';

import Section from '../../components/Section';
import ProductCard from '../../components/Card/ProductCard';
import Input from '../../components/Input';

import { theme } from "../../theme";
import { Product } from "../../generated/graphql";
import { VerifiedBadge } from "../../components/Product";
import { ProductProps } from "./props";
import { useHistory } from "react-router-dom";

const ProductComponent: React.FC<ProductProps> = (
  {
    product,
    handleAddToWishlistClicked,
    handleAddToCartClicked,
    deals,
    productPackaging,
    productImages,
    isPreview
  }) => {
  const history = useHistory()

  const navigateToProduct = (id: string | undefined) => {
    history.push(`/product/${id}`)
  }

  const coverImage = product?.coverImage?.url;
  const hasProductImages = productImages?.length > 0;

  return (
    <React.Fragment>
      <Flex mb={3} backgroundColor="white" borderRadius={3} width="80%">
        <Grid gridTemplateColumns="1fr 1fr">
          <Grid gridTemplateColumns="550px 150px" height={435} columnGap={3} >
            <Flex
              m={5}
              width="550px"
              height="400px"
              position="relative"
            >
              <Image
                width="100%"
                height="100%"
                src={coverImage}
                objectFit="contain"
              />
              {product?.discount?.discountPercentage && product?.discount?.discountPercentage > 0 ? (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  width="70px"
                  height="70px"
                  position="absolute"
                  bg="accent.700"
                  flexDirection="column"
                  top="0px"
                  right="30px"
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
            {hasProductImages
              && (
                <Grid gridTemplateRows="90px 90px 90px 90px" rowGap={3} ml={5} mt={6} overflowY="scroll">
                  {
                    productImages?.map((product: string | undefined) => (
                      <Image
                        key={product}
                        width="90%"
                        height="90px"
                        src={product}
                      />
                    ))
                }
              </Grid>)
            }
          </Grid>
          <Grid gridTemplateRows="40px 50px 35px 30px 50px 40px 30px 30px 50px 60px" padding={5} pt={10}>
            <Text fontSize="20px" fontWeight={600}>
              {product?.name}
            </Text>
            <Text fontSize="12px" fontWeight={400} maxHeight="70px" overflow="hidden">
              {product?.shortDescription}
            </Text>
            <VerifiedBadge />
            <Text fontSize="18px">
              {`Retail: ${product?.price?.currency} ${product?.price?.retailPricePerUnit}.00`}
            </Text>
            <Text fontSize="30px" fontWeight={700}>
              {`${product?.price?.currency} ${product?.price?.pricePerUnit}.00`}
            </Text>
            <Text fontSize="14px" color="#355EC0" fontWeight={600}>
              {`This item is sold per ${productPackaging}`}
            </Text>
            <Flex>
              <Briefcase />
              <Text ml={3} fontSize="14px" >
                {`Supplied by ${product?.business?.name}`}
              </Text>
            </Flex>
            <Flex>
              <MapPin />
              <Text ml={3} fontSize="14px" >
                {`Delivered from ${product?.business?.address?.address}`}
              </Text>
            </Flex>
            <Flex mt={3} flexDirection="column">
              <Input
                name="quantity"
                type="text"
                placeholder="Enter quantity eg. 3"
                style={{
                  padding: 3,
                  border: `1px solid ${theme.colors.background}`,
                  width: "50%"
                }}
              />
            </Flex>
            <Flex flexWrap="wrap" >
              <Button justifySelf="start" width="150px" mt={4} mr={2} onClick={() => handleAddToWishlistClicked(product?.id)} border={`1px solid ${theme.colors.brand[500]}`} background="white">
                <Text fontSize="12px">
                  ADD TO WISHLIST
                </Text>
              </Button>
              <Button mt={4} variantColor="brand" width="150px" onClick={() => handleAddToCartClicked(product?.id)}>
                <Text fontSize="12px">
                  ADD TO CART
                </Text>
              </Button>
            </Flex>
          </Grid>
        </Grid>
      </Flex>
      <Grid gridTemplateRows="1fr 1fr" backgroundColor="white" borderRadius={3} padding={10} fontSize="12px" width="80%">
        <div>
          <Text fontSize="17px" fontWeight={600}>
            About This Product
          </Text>
          <Text fontSize="12px">
            {product?.description}
          </Text>
        </div>
        <Grid gridTemplateColumns="1fr 1fr">
          <div>
            <Text fontSize="17px" fontWeight={600} mb={3}>
              Product Features
            </Text>
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
                : (<Text>No Features Set</Text>)
            }
          </div>
          <div>
            <Text fontSize="17px" fontWeight={600} mb={3}>
              Product Specification
            </Text>
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
          </div>
          <Flex width="414px" background={theme.colors.accent[50]} mt={5}>
            {
              product?.tags?.map((tag: string, index: number) => (
                <Tag fontSize={12} mr={1} size="sm" key={index} background={theme.colors.tag} color={theme.colors.tagText}>{tag?.toUpperCase()}</Tag>
              ))
            }
          </Flex>
        </Grid>
      </Grid>
      {isPreview &&
        <Flex ml={5} mt={3} width="100%" flexDirection="column" alignItems="center">
          <Section title="Deals You Might Be Interested In">
            {deals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
          <Button width="80%" variantColor="brand">
            <Text fontSize="12px">
              VIEW MORE
            </Text>
          </Button>
      </Flex>
      }
    </React.Fragment>
  )
}

export default ProductComponent
