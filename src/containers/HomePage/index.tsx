import * as React from 'react'
import { sortBy, reverse, slice, some } from 'lodash'
import { ApolloError } from 'apollo-client'
import { PageWrap } from '../../layouts'
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
import { Hits, InstantSearch, Stats } from 'react-instantsearch-dom'
import algoliasearch from 'algoliasearch/lite'
import { SearchBar } from '../../components'

type filterParams = {
  minPrice: string
  maxPrice: string
  category: string[]
}

const searchClient = algoliasearch('2N40VPJHPF', 'b8ae7ec3addb45676ff50ed2d56ca001')

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const filters = useLocation().search
  const [query, setQuery] = React.useState<filterParams>()
  const [isFiltered, setIsFiltered] = React.useState<boolean>(false)
  const [isSearching, setIsSearching] = React.useState<boolean>(false)

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

  const navigateToCategory = (id: string) => {
    history.push(`/category/${id}`)
  }

  const handleFilter = () => {
    history.push(`/product-filter`)
  }

  const handleSearch = (value: string) => {
    if (value.length > 0) {
      setIsSearching(true)
      return
    }
    setIsSearching(false)
  }

  const handleReset = () => {
    setIsSearching(false)
  }

  const ProductDisplay: React.FC = ({ hit }: any) => {
    return <ProductCard product={hit} handleClick={navigateToProduct} />
  }

  const index = `prod_TRADEFED`

  return (
    <PageWrap
      title="Dashboard"
      color="colors.white"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <InstantSearch indexName={index} searchClient={searchClient}>
        <Flex flexDirection="column" width="100%">
          <SearchBar
            handleFilter={handleFilter}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
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
          ) : isSearching ? (
            <Section title="">
              <Stats />
              <Hits hitComponent={ProductDisplay} />
            </Section>
          ) : (
            <React.Fragment>
              <Hero image={images.heroImg} header="HOLIDAY DASH" caption="Shop early deals" />
              <Section title="Product Categories" borderBottomWidth={10}>
                {categories?.map((category: Category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    handleClick={navigateToCategory}
                  />
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
      </InstantSearch>

      <Footer />
    </PageWrap>
  )
}

export default Home
