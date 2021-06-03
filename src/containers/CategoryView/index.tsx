import * as React from 'react'
import { sortBy, reverse, slice } from 'lodash'
import { ApolloError } from 'apollo-client'
import { PageWrap } from '../../layouts'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Flex, useToast } from '@chakra-ui/core'
import Hero from '../../components/Hero'
import { Category, Product, useCategoryQuery, useProductQuery } from '../../generated/graphql'
import { get } from 'lodash'
import Footer from '../../components/Footer'
import { ERROR_TOAST } from '../../constants'
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
  const deals: Product[] = slice(
    reverse(sortBy(products, [(product) => product?.discount])),
    0,
    3
  )

  const navigateToProduct = (id: string | undefined) => {
    history.push(`/product/${id}`)
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
            image={category?.categoryImage?.url}
            header={category?.name}
          />
          <Section card title="Today’s Best Deals" >
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
