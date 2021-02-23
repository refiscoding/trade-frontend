import { Form, Formik } from 'formik'
import * as React from 'react'
import { Filter, Search } from 'react-feather'
import { sortBy, reverse, slice, some } from 'lodash'
import { ApolloError } from 'apollo-client'
import { ConnectedFormGroup } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { useAuthContext } from '../../context/AuthProvider'
import { useHistory, useLocation } from 'react-router-dom'
import { Flex, useToast, Text } from '@chakra-ui/core'
import { images } from '../../theme'
import Hero from '../../components/Hero'
import { Category, Product, useCategoryQuery, useProductQuery } from '../../generated/graphql'
import { get } from 'lodash'
import Footer from '../../components/Footer'
import { ERROR_TOAST } from '../../constants'
import ProductCard from '../../components/Card/ProductCard'
import CategoryCard from '../../components/Card/CategoryCard'
import Section from '../../components/Section'

type InitialValues = {
  search: string
}

type filterParams = {
  minPrice: string
  maxPrice: string
  category: string[]
}

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const filters = useLocation().search
  const [query, setQuery] = React.useState<filterParams>()
  const [isFiltered, setIsFiltered] = React.useState<boolean>(false)

  React.useEffect(() => {
    const params = new URLSearchParams(filters)
    const productFilters = {
      minPrice: params.get('minPrice'),
      maxPrice: params.get('maxPrice'),
      category: params.get('category')?.split(',')
    } as filterParams
    if (some(productFilters)) {
      setQuery(productFilters)
      setIsFiltered(true)
      return
    }
    setIsFiltered(false)
  }, [filters])

  const { data } = useCategoryQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const { data: productData } = useProductQuery({
    variables: {
      where: isFiltered && {
        productPrice_gt: parseInt(query?.minPrice || '0'),
        productPrice_lt: parseInt(query?.maxPrice || '10000'),
        categories_contains: query?.category
      }
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const categories = get(data, 'categories', null) as Category[]
  const products = get(productData, 'products', null) as Product[]
  const deals: Product[] = slice(
    reverse(sortBy(products, [(product) => product?.discount?.discountPercentage])),
    0,
    3
  )

  React.useEffect(() => {
    if (isAuthenticated && !user?.profileCompleted) {
      history.push('/user-onboarding-intro')
    }
    // eslint-disable-next-line
  }, [user, isAuthenticated])

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
        {isFiltered ? (
          <Section title="All filtered items" borderBottomWidth={10}>
            {products?.length > 0 ? (
              products?.map((product: Product) => (
                <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
              ))
            ) : (
              <Text> No products matching the selected filters </Text>
            )}
          </Section>
        ) : (
          <React.Fragment>
            <Hero image={images.heroImg} header="HOLIDAY DASH" caption="Shop early deals" />
            <Section title="Product Categories" borderBottomWidth={10}>
              {categories?.map((category: Category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </Section>
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
        )}
      </Flex>
      <Footer />
    </PageWrap>
  )
}

export default Home
