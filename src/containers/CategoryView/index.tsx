/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'
import { get } from 'lodash'

import { ApolloError } from 'apollo-client'
import { Button, Flex, useToast } from '@chakra-ui/core'
import {
  Category,
  Maybe,
  Product,
  useCategoryQuery,
  useProductQuery
} from '../../generated/graphql'
import { ERROR_TOAST } from '../../constants'
import { images } from '../../theme'
import { PageWrap } from '../../layouts'
import { sortBy, reverse, slice } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'

import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import ProductCard from '../../components/Card/ProductCard'
import Section from '../../components/Section'

const Home: React.FC = () => {
  const { id } = useParams()
  const history = useHistory()
  const toast = useToast()

  const { data } = useCategoryQuery({
    variables: {
      where: {
        id_contains: id
      }
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const category = get(data, 'categories', null)?.[0] as Category

  const { data: productData } = useProductQuery({
    variables: {
      where: {
        categories_contains: id
      }
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const products = get(productData, 'products', null) as Product[]
  const deals: Product[] = slice(reverse(sortBy(products, [(product) => product?.discount])), 0, 3)

  const navigateToProduct = (id: Maybe<string> | undefined) => {
    const modifiedId = id?.toLowerCase()
    history.push(`/product/${modifiedId}`)
  }

  const bannerImage = () => {
    if (category?.name === 'Agriculture') {
      return images?.agricultureBanner
    } else if (category?.name === 'Automotive') {
      return images?.automotiveBanner
    } else if (category?.name === 'Electrical Equipment') {
      return images?.electricalBanner
    } else if (category?.name === 'Food Ingredients') {
      return images?.foodBanner
    } else if (category?.name === 'Heavy Machinery') {
      return images?.heavyBanner
    } else if (category?.name === 'Industrial') {
      // return images?.foodBanner || null
      return null
    } else if (category?.name === 'Lighting') {
      return images?.lightingBanner
    } else if (category?.name === 'Mining') {
      return images?.miningBanner
    }
  }

  return (
    <PageWrap
      title="Dashboard"
      color="colors.white"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Flex flexDirection="column" alignItems="center" width="100%">
        <React.Fragment>
          <Hero
            isCategory
            headerColor="white"
            headerMargin="4.5rem"
            image={bannerImage()}
            header={category?.name}
          />
          <Section card title="Today’s Best Deals">
            {deals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
          <Section card title="Deals For You">
            {products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
            <Button mt={4} width="100%" variantColor="brand">
              VIEW MORE
            </Button>
          </Section>
        </React.Fragment>
      </Flex>
      <Footer />
    </PageWrap>
  )
}

export default Home
