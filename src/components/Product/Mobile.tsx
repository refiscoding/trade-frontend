import * as React from 'react'

import { get } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { MapPin, Briefcase } from 'react-feather'
import { Flex, Image, Text, Button, Grid, Tag } from '@chakra-ui/core'

import Section from '../../components/Section'
import ProductCard from '../../components/Card/ProductCard'

import { ProductProps } from './props'
import { theme, images } from '../../theme'
import { Product } from '../../generated/graphql'
import { VerifiedBadge } from '../../components/Product'
import { useAuthContext } from '../../context/AuthProvider'
import { QuantitySelectComponent } from '../../containers/ProductView/AddToCartModal'

const ProductComponentMobile: React.FC<ProductProps> = ({
  deals,
  product,
  isPreview,
  productQuantity,
  productPackaging,
  setProductQuantity,
  handleAddToCartClicked,
  handleAddToWishlistClicked
}) => {
  const history = useHistory()
  const { isAuthenticated } = useAuthContext()

  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })

  const positionRight = isTinyPhone ? '6rem' : isSmallPhone ? '3rem' : '2rem'
  const marginLeft = isTinyPhone ? '6rem' : isSmallPhone ? '3rem' : '2'

  const navigateToProduct = (id: string | undefined) => {
    history.push(`/product/${id}`)
  }

  const maxSellCost = get(product, 'maxSellCost') as number
  const tradeFedCost = get(product, 'tradeFedCost') as number
  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  const addresses = get(product, 'business.address')
  const businessAddress = addresses ? addresses[0]?.address : ''

  const textColor = theme.colors.blueText

  return (
    <Flex flexDirection="column">
      <Flex mt="-1rem" height="250px" position="relative">
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
            right={positionRight}
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
      <Flex
        borderBottomRightRadius={5}
        borderBottomLeftRadius={5}
        flexDirection="column"
        p={5}
        pt={0}
        background={theme.colors.accent[50]}
        mb={2}
        boxShadow={theme.boxShadowMedium}
      >
        <Text ml={marginLeft} my={2} fontSize="18px" fontWeight={600}>
          {product?.name}
        </Text>
        <VerifiedBadge marginLeft={marginLeft} />
        <Text ml={marginLeft} fontSize="10px" maxHeight="60%" overflow="hidden" mt={3}>
          {product?.shortDescription}
        </Text>
        <Text ml={marginLeft} mt={2} mb={2} fontSize="18px" fontWeight={600}>
          {`${product?.currency} ${product?.tradeFedCost}.00`}
        </Text>
        <Text ml={marginLeft} mt={-1} mb={1} fontSize="12px">
          Retail: {`${product?.currency} ${product?.maxSellCost}.00`}
        </Text>
        <Text ml={marginLeft} fontSize="14px" color={textColor} fontWeight={600}>
          {`This item is sold per ${productPackaging}`}
        </Text>
        <Flex ml={marginLeft} mt={2}>
          <Briefcase />
          <Text ml={3} fontSize="14px">
            {`Supplied by ${product?.business?.name}`}
          </Text>
        </Flex>
        {businessAddress && (
          <Flex ml={marginLeft}>
            <MapPin style={{ marginTop: 3 }} />
            <Text mt={2} ml={3} fontSize="12px">
              {`Delivered from ${
                product?.business &&
                product?.business?.address &&
                product?.business?.address[0]?.address
              }`}
            </Text>
          </Flex>
        )}
        {product?.availableUnits ? (
          <Flex ml={marginLeft} mt={3}>
            <QuantitySelectComponent
              count={1}
              isCart={false}
              productId={product?.id}
              available={product?.availableUnits as number}
              setProductQuantity={setProductQuantity}
            />
            <Text
              mt={3}
              ml={3}
              color={textColor}
              fontSize={12}
              fontWeight={600}
            >{`${product?.availableUnits} units`}</Text>
            <Text mt={3} ml={1} fontSize={12}>{`available`}</Text>
          </Flex>
        ) : (
          <Flex ml={marginLeft} mt={4} fontSize={12} fontWeight={600} color={textColor}>
            No units available
          </Flex>
        )}
        <Grid ml={marginLeft} gridTemplateColumns="200px 200px">
          <Button
            justifySelf="start"
            mt={4}
            width={isSmallPhone ? '80%' : '90%'}
            onClick={() => {
              if (isAuthenticated) {
                handleAddToWishlistClicked(product?.id)
              } else {
                history.push('/login')
              }
            }}
            border={`1px solid ${theme.colors.brand[500]}`}
            background="white"
          >
            <Text fontSize="12px">ADD TO WISHLIST</Text>
          </Button>
          <Button
            mt={4}
            width={isSmallPhone ? '80%' : '90%'}
            variantColor="brand"
            isDisabled={Boolean(!product?.availableUnits)}
            onClick={() => {
              if (isAuthenticated) {
                handleAddToCartClicked(product?.id)
              } else {
                history.push('/login')
              }
            }}
          >
            <Text fontSize="12px">ADD TO CART</Text>
          </Button>
        </Grid>
      </Flex>
      <Flex
        borderRadius={5}
        flexDirection="column"
        background={theme.colors.accent[50]}
        boxShadow={theme.boxShadowMedium}
        mb={2}
        p={5}
        pt={0}
      >
        <Section ml={marginLeft} p="0 1rem" pb="0px" title="About This Product">
          <Flex width="100%" alignSelf="flex-start">
            <Text fontSize="12px">{product?.description}</Text>
          </Flex>
        </Section>
        <Section ml={marginLeft} title="Product Features" p="0 1rem" pb="0px">
          <Flex ml="1rem" width="100%" as="ul" flexDirection="column" alignSelf="flex-start">
            <ul style={{ marginLeft: 15 }}>
              {product?.features?.split(',')?.map((feature: string, index: number) => (
                <li key={`${feature}_${index}`}>
                  <Text fontSize="12px">{feature}</Text>
                </li>
              ))}
            </ul>
          </Flex>
        </Section>
        <Section ml={marginLeft} title="Product Specifications" p="0 1rem" pb="0px">
          <Flex ml="1rem" width="100%" as="ul" flexDirection="column" alignSelf="flex-start">
            <Flex mb={3} flexDirection="column">
              <Text fontSize="12px">
                Height : {`${product?.height} ${product?.dimensionsUnit}`}
              </Text>
              <Text fontSize="12px">Width : {`${product?.width} ${product?.dimensionsUnit}`}</Text>
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
                <Flex border={theme.colors.background} borderRadius={3}>
                  <Image src={images.pdfFile} height="30px" />
                  <Text ml={2} fontSize={12} mt={2}>
                    Additional Product Information
                  </Text>
                </Flex>
              </a>
            )}
          </Flex>
        </Section>
        <Flex ml={marginLeft} background={theme.colors.accent[50]}>
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
      </Flex>
      {isPreview && (
        <Flex ml={marginLeft} flexDirection="column" background="accent.50" p={5} pt={0}>
          <Section card title="Deals You Might Be Interested In" width="100%">
            {deals?.slice(0, 2)?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
          <Button justifySelf="center" width="100%" variantColor="brand">
            <Text fontSize="12px">VIEW MORE</Text>
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default ProductComponentMobile
