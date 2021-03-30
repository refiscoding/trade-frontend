import * as React from 'react';
import { Flex, Image, Text, Button, Grid, Select, Tag } from '@chakra-ui/core';

import Section from '../../components/Section';
import ProductCard from '../../components/Card/ProductCard';

import { theme } from "../../theme";
import { Product } from "../../generated/graphql";
import { VerifiedBadge }from "../../components/Product";
import { ProductProps } from "./props";
import {useHistory} from "react-router-dom";

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
    // TODO: Replace line 103 this with ConnectedSelect component
  const history = useHistory()

  const navigateToProduct = (id: string) => {
    history.push(`/product/${id}`)
  }

  const coverImage = product?.coverImage?.url;
  return (
    <React.Fragment>
      <Flex mb={3} backgroundColor="white" borderRadius={3} width="80%">
        <Grid gridTemplateColumns="1fr 1fr">
          <Grid gridTemplateColumns="550px 150px" height={435} columnGap={3} >
            <Image
              m={5}
              width="100%"
              height="400px"
              src={coverImage}
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
                top="6.2rem"
                right="58%"
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
            <Grid gridTemplateRows="90px 90px 90px 90px" rowGap={3} ml={5} mt={6} overflowY="scroll">
              {
                productImages?.length
                ? (
                  productImages?.map((product: string | undefined) => (
                    <Image
                      key={product}
                      width="90%"
                      height="90px"
                      src={product}
                    />
                  ))
                )
                : (
                  [1,2,3,4]?.map((product: number) => (
                    <Image
                      key={product}
                      width="90%"
                      height="90px"
                      src={coverImage}
                    />
                  ))
                )
              }
            </Grid>
          </Grid>
          <Grid gridTemplateRows="40px 50px 35px 30px 50px 40px 80px 1fr" padding={5} pt={10}>
            <Text fontSize="20px" fontWeight={600}>
              { product?.name }
            </Text>
            <Text fontSize="12px" fontWeight={400} maxHeight="70px" overflow="hidden">
              { product?.shortDescription }
            </Text>
              <VerifiedBadge />
            <Text fontSize="18px">
              { `Retail: ${product?.price?.currency} ${product?.price?.retailPricePerUnit}.00` }
            </Text>
            <Text fontSize="30px" fontWeight={700}>
              { `${product?.price?.currency} ${product?.price?.pricePerUnit}.00` }
            </Text>
            <Text fontSize="14px" color="#355EC0" fontWeight={600}>
              {`This item is sold per ${productPackaging}`}
            </Text>
            <Flex flexDirection="column">
              <Text fontSize="14px" color="#4A4A4A" mb={2}>
                Select Quantity
              </Text>
              <Select placeholder="Select quantity" width="40%">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10+">10+</option>
              </Select>
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
          </Grid>
        </Grid>
      </Flex>
      <Grid gridTemplateRows="1fr 1fr" backgroundColor="white" borderRadius={3} padding={10} fontSize="12px" width="80%">
        <div>
          <Text fontSize="17px" fontWeight={600}>
            About This Product
          </Text>
          <Text fontSize="12px">
            { product?.description }
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
                        <Text fontSize="12px">{ feature }</Text>
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
              product?.features?.length
              ? (
                <ul style={{ marginLeft: 15 }}>
                  {
                    product?.features?.map((feature: string) => (
                      <li key={feature}>
                        <Text fontSize="12px">{ feature }</Text>
                      </li>
                    ))
                  }
                </ul>
              )
              : (<Text>No Specifications Set</Text>)
            }
          </div>
        <Flex width="414px" background="#ffffff" mt={5}>
            {
                product?.tags?.map((tag: string, index: number) => (
                <Tag fontSize={12} mr={1} size="sm" key={index} background="#B6DAF5" color="#004A81">{tag?.toUpperCase()}</Tag>
                ))
            }
        </Flex>
        </Grid>
      </Grid>
      {isPreview &&
        <Flex ml={5} mt={3} width="100%" flexDirection="column" alignItems="center">
          <Section title="Deals You Might Be Interested In">
            {deals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct}/>
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
