import * as React from 'react'

import { get } from 'lodash'
import { useHistory } from 'react-router-dom'
import { MapPin, Briefcase } from 'react-feather'
import { Flex, Image, Text, Button, Grid, Tag } from '@chakra-ui/core'

import Section from '../../components/Section'
import ProductCard from '../../components/Card/ProductCard'

import { ProductProps } from './props'
import { images, theme } from '../../theme'
import { Product } from '../../generated/graphql'
import { VerifiedBadge } from '../../components/Product'
import { useAppContext } from '../../context/AppProvider'
import { QuantitySelectComponent } from '../../containers/ProductView/AddToCartModal'

const ProductComponent: React.FC<ProductProps> = ({
  deals,
  product,
  isPreview,
  productImages,
  productQuantity,
  productPackaging,
  setProductQuantity,
  handleAddToCartClicked,
  handleAddToWishlistClicked
}) => {
  const history = useHistory()
  const { drawerOpen } = useAppContext()

  const navigateToProduct = (id: string | undefined) => {
    history.push(`/product/${id}`)
  }

  const coverImage = product?.coverImage?.url
  const hasProductImages = productImages?.length > 0

  const maxSellCost = get(product, 'maxSellCost') as number
  const tradeFedCost = get(product, 'tradeFedCost') as number
  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  const addresses = get(product, 'business.address')
  const businessAddress = addresses ? addresses[0]?.address : ''
  const textColor = theme.colors.blueText
  const coverImageWidth = drawerOpen ? '415px' : '450px'
  const coverImageHeight = drawerOpen ? '435px' : '435px'

  return (
    <React.Fragment>
      <Flex
        mb={3}
        backgroundColor="white"
        borderRadius={5}
        width="80%"
        boxShadow={theme.boxShadowMedium}
      >
        <Grid gridTemplateColumns="1fr 1fr">
          <Grid
            gridTemplateColumns={`${coverImageWidth} 150px`}
            height={coverImageHeight}
            columnGap={3}
          >
            <Flex m={5} width={`${coverImageWidth}`} height="450px" position="relative">
              <Image
                width={coverImageWidth}
                height={coverImageHeight}
                src={coverImage || ''}
                objectFit="cover"
              />
              {discount ? (
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
                    {`${discount}%`}
                  </Text>
                </Flex>
              ) : null}
            </Flex>
            {hasProductImages && (
              <Grid
                gridTemplateRows="90px 90px 90px 90px"
                rowGap={3}
                ml={5}
                mt={6}
                overflowY="scroll"
              >
                {productImages?.map((product: string | undefined) => (
                  <Image
                    key={product || `${Math.random()}`}
                    width="90%"
                    height="90px"
                    objectFit="cover"
                    src={product || ''}
                  />
                ))}
              </Grid>
            )}
          </Grid>
          <Grid
            gridTemplateRows="40px 50px 35px 35px 50px 40px 30px 30px 50px 60px"
            padding={5}
            pt={8}
          >
            <Text fontSize="20px" fontWeight={600}>
              {product?.name}
            </Text>
            <Text fontSize="12px" fontWeight={400} maxHeight="70px" overflow="hidden">
              {product?.shortDescription}
            </Text>
            <VerifiedBadge />
            <Text mt={3} fontSize="24px" fontWeight={600}>
              {`${product?.currency} ${product?.tradeFedCost}.00`}
            </Text>
            <Text mt={4} fontSize="16px">
              {`Retail: ${product?.currency} ${product?.maxSellCost}.00`}
            </Text>
            <Text mt={3} fontSize="14px" color={textColor} fontWeight={600}>
              {`This item is sold per ${productPackaging}`}
            </Text>
            <Flex mt={3}>
              <Briefcase />
              <Text ml={3} fontSize="14px">
                {`Supplied by ${product?.business?.name}`}
              </Text>
            </Flex>
            {businessAddress && (
              <Flex mt={3}>
                <MapPin />
                <Text ml={3} fontSize="14px">
                  {`Delivered from ${
                    product?.business &&
                    product?.business?.address &&
                    product?.business?.address[0]?.address
                  }`}
                </Text>
              </Flex>
            )}
            <Flex mt={3}>
              <QuantitySelectComponent
                count={1}
                isCart={false}
                productId={product?.id}
                available={product?.availableUnits as number}
                setProductQuantity={setProductQuantity}
              />
              <Text
                mt={2}
                ml={3}
                color={textColor}
                fontSize={12}
                fontWeight={600}
              >{`${product?.availableUnits} units`}</Text>
              <Text mt={2} ml={1} fontSize={12}>{`available`}</Text>
            </Flex>
            <Flex flexWrap="wrap">
              <Button
                justifySelf="start"
                width="150px"
                mt={4}
                mr={2}
                onClick={() => handleAddToWishlistClicked(product?.id)}
                border={`1px solid ${theme.colors.brand[500]}`}
                background="white"
              >
                <Text fontSize="12px">ADD TO WISHLIST</Text>
              </Button>
              <Button
                mt={4}
                variantColor="brand"
                width="150px"
                onClick={() => handleAddToCartClicked(product?.id)}
              >
                <Text fontSize="12px">ADD TO CART</Text>
              </Button>
            </Flex>
          </Grid>
        </Grid>
      </Flex>
      <Grid
        // gridTemplateRows="1fr 1fr"
        backgroundColor="white"
        borderRadius={3}
        padding={10}
        fontSize="12px"
        width="80%"
        boxShadow={theme.boxShadowMedium}
      >
        <div>
          <Text fontSize="17px" fontWeight={600}>
            About This Product
          </Text>
          <Text fontSize="12px" mb={3}>
            {product?.description}
          </Text>
        </div>
        <Grid gridTemplateColumns="1fr 1fr" columnGap="20px" mt={3}>
          <div
            style={{ border: `1px solid ${theme.colors.background}`, padding: 15, borderRadius: 3 }}
          >
            <Text fontSize="17px" fontWeight={600} mb={3}>
              Product Features
            </Text>
            <ul style={{ marginLeft: 15 }}>
              {product?.features?.split(',')?.map((feature: string, index: number) => (
                <li key={`${feature}_${index}`}>
                  <Text fontSize="12px">{feature}</Text>
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{ border: `1px solid ${theme.colors.background}`, padding: 15, borderRadius: 3 }}
          >
            <Text fontSize="17px" fontWeight={600} mb={3}>
              Product Specification
            </Text>
            <Flex justify="space-between">
              <Flex flexDirection="column">
                <Text fontSize="12px">
                  Height : {`${product?.height} ${product?.dimensionsUnit}`}
                </Text>
                <Text fontSize="12px">
                  Width : {`${product?.width} ${product?.dimensionsUnit}`}
                </Text>
                <Text fontSize="12px">
                  Length : {`${product?.lengths} ${product?.dimensionsUnit}`}
                </Text>
                <Text fontSize="12px">Weight : {`${product?.weight} ${product?.weightUnit}`}</Text>
              </Flex>
              {product?.additionalInfo && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={product?.additionalInfo[0]?.url || ''}
                >
                  <Flex
                    ml={5}
                    justify="space-between"
                    border={theme.colors.background}
                    borderRadius={3}
                  >
                    <Image src={images.pdfFile} height="40px" />
                    <Text ml={2} mt={2}>
                      Additional Product Information
                    </Text>
                  </Flex>
                </a>
              )}
            </Flex>
          </div>
          <Flex width="414px" background={theme.colors.accent[50]} mt={5}>
            {product?.tags?.split(',')?.map((tag: string, index: number) => (
              <Tag
                fontSize={12}
                mr={1}
                size="sm"
                key={index}
                background={theme.colors.tag}
                color={theme.colors.tagText}
              >
                {tag?.toUpperCase()}
              </Tag>
            ))}
          </Flex>
        </Grid>
      </Grid>
      {isPreview && (
        <Flex ml={5} mt={3} width="100%" flexDirection="column" alignItems="center">
          <Section card title="Deals You Might Be Interested In">
            {deals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
          <Button width="80%" variantColor="brand">
            <Text fontSize="12px">VIEW MORE</Text>
          </Button>
        </Flex>
      )}
    </React.Fragment>
  )
}

export default ProductComponent
