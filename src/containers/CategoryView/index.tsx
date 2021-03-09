import { Form, Formik } from 'formik'
import * as React from 'react'
import { Filter, Search } from 'react-feather'
import { sortBy, reverse, slice } from 'lodash'
import { ApolloError } from 'apollo-client'
import { ConnectedFormGroup } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { useHistory, useParams } from 'react-router-dom'
import { Flex, useToast } from '@chakra-ui/core'
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
    reverse(sortBy(products, [(product) => product?.discount?.discountPercentage])),
    0,
    3
  )

  const navigateToProduct = (id: string) => {
    history.push(`/product/${id}`)
  }

  const handleFilter = () => {
    history.push(`/product-filter`)
  }

  return (
    <PageWrap
      title="Dashboard"
      color="colors.white"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Flex flexDirection="column" width="100%">
        <Flex width="100%" height="40px" justifyContent="space-between">
          <Formik
            initialValues={{
              search: ''
            }}
            onSubmit={async ({ search }, { setSubmitting, setStatus }) => {
              setStatus(null)
              try {
                setSubmitting(true)
                const search = () => {
                  return
                }
                search()
                setSubmitting(false)
              } catch (error) {
                setStatus(formatError(error))
              }
            }}
          >
            <Form style={{ width: '80%' }}>
              <ConnectedFormGroup
                icon={Search}
                name="search"
                placeholder="Search for products, brands..."
                fontSize={12}
                paddingLeft="40px"
                borderColor="transparent"
                bg="accent.600"
                iconPosition="left"
              />
            </Form>
          </Formik>
          <Flex
            borderRadius={4}
            bg="accent.600"
            alignItems="center"
            justifyContent="center"
            width="15%"
            onClick={() => handleFilter()}
          >
            <Filter fontSize={10} />
          </Flex>
        </Flex>
        <React.Fragment>
          <Hero
            headerColor="white"
            headerMargin="4.5rem"
            imageUrl
            image={category?.categoryImage?.url}
            header={category?.name}
          />
          <Section title="Today’s Best Deals" borderBottomWidth={10}>
            {deals?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
          <Section title="Deals For You">
            {products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
            ))}
          </Section>
        </React.Fragment>
      </Flex>
      <Footer />
    </PageWrap>
  )
}

export default Home
