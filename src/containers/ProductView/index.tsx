import * as React from 'react'
import { get } from 'lodash'

import { PageWrap } from '../../layouts'
import { Flex, Image, Text, useToast } from '@chakra-ui/core'
import { useParams } from 'react-router-dom'
import { useFindProductQuery, Product } from '../../generated/graphql'
import { ERROR_TOAST } from '../../constants'
import Section from '../../components/Section'
import Footer from '../../components/Footer'

type ProductProps = {}

const ProductView: React.FC<ProductProps> = () => {
  const { id } = useParams()
  const toast = useToast()

  const { data } = useFindProductQuery({
    variables: { id: id.toString() },
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const product = (get(data, 'findProduct', []) as Product) || null

  return (
    <PageWrap alignItems="center" title="Product" bg="white">
      <Flex mt="-1rem" width="100vw" height="250px" position="relative">
        <Image
          mr={5}
          width="100%"
          height="100%"
          src={`${process.env.REACT_APP_API_HOST}${product?.coverImage?.url}`}
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
      <Flex ml="1rem" flexDirection="column">
        <Flex flexDirection="column">
          <Text my={2} fontSize="18px" fontWeight={600}>
            {product.name}
          </Text>
          <Text fontSize="10px" maxHeight="60%" overflow="hidden">
            {product.shortDescription}
          </Text>
          <Text mt={4} mb={1} fontSize="12px">
            Retail: {`${product?.price?.currency} ${product?.price?.retailPricePerUnit}`}
          </Text>
          <Text
            mb={2}
            fontSize="18px"
            fontWeight={600}
          >{`${product?.price?.currency} ${product?.price?.pricePerUnit}`}</Text>
        </Flex>
        <Section p="0 1rem" pb="0px" title="About This Product">
          <Text fontSize="12px">{product?.description}</Text>
        </Section>
        <Section title="Product Features" p="0 1rem" pb="0px">
          <Flex ml="1rem" width="100%" as="ul" flexDirection="column" alignSelf="flex-start">
            {product?.features?.map((feature: string, i: number) => (
              <li key={i}>
                <Text fontSize="12px">{feature}</Text>
              </li>
            ))}
          </Flex>
        </Section>
        <Section title="Product Specifications" p="0 1rem" pb="0px">
          <Flex ml="1rem" width="100%" as="ul" flexDirection="column" alignSelf="flex-start">
            {product?.features?.map((feature: string, i: number) => (
              <li key={i}>
                <Text fontSize="12px">{feature}</Text>
              </li>
            ))}
          </Flex>
        </Section>
        <Footer />
      </Flex>
    </PageWrap>
  )
}

export default ProductView
