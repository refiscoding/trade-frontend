import { Form, Formik } from 'formik'
import * as React from 'react'
import { Filter, Search } from 'react-feather'
import { sortBy, reverse, slice } from 'lodash'

import { ConnectedFormGroup } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { formatError } from '../../utils'
import { useAuthContext } from '../../context/AuthProvider'
import { useHistory } from 'react-router-dom'
import { Flex, useToast } from '@chakra-ui/core'
import { images } from '../../theme'
import Hero from '../../components/Hero'
import { useCategoryQuery, useProductQuery } from '../../generated/graphql'
import { get } from 'lodash'
import Footer from '../../components/Footer'
import { ERROR_TOAST } from '../../constants'
import ProductCard from '../../components/Card/ProductCard'
import CategoryCard from '../../components/Card/CategoryCard'
import Section from '../../components/Section'

type InitialValues = {
  search: string
}

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext()
  const history = useHistory()
  const toast = useToast()

  const { data } = useCategoryQuery({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const { data: productData } = useProductQuery({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const categories: any = get(data, 'categories', [])
  const products: any = get(productData, 'products', [])
  const deals: any = slice(
    reverse(
      sortBy(products, [
        function (product) {
          return product?.discount?.discountPercentage
        }
      ])
    ),
    0,
    3
  )

  React.useEffect(() => {
    if (isAuthenticated && !user?.profileCompleted) {
      history.push('/user-onboarding-intro')
    }
    // eslint-disable-next-line
  }, [user, isAuthenticated])

  return (
    <PageWrap title="Dashboard" color="colors.white">
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
        >
          <Filter fontSize={10} />
        </Flex>
      </Flex>
      <Hero image={images.heroImg} header="HOLIDAY DASH" caption="Shop early deals" />
      <Section title="Product Categories" borderBottomWidth={10}>
        {categories &&
          categories.map((category: any) => <CategoryCard key={category.id} category={category} />)}
      </Section>
      <Section title="Today’s Best Deals" borderBottomWidth={10}>
        {deals && deals.map((product: any) => <ProductCard key={product.id} product={product} />)}
      </Section>
      <Section title="Deals For You">
        {products &&
          products.map((product: any) => <ProductCard key={product.id} product={product} />)}
      </Section>
      <Footer />
    </PageWrap>
  )
}

export default Home
