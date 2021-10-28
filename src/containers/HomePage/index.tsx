/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'

import { ApolloError } from 'apollo-client'
import { useMediaQuery } from 'react-responsive'
import { sortBy, reverse, slice, some, get } from 'lodash'
import { useHistory, useLocation } from 'react-router-dom'
import { Flex, useToast, Text, Button } from '@chakra-ui/core'
import { Hits, InstantSearch, Stats } from 'react-instantsearch-dom'

import HomeBanner from '../../components/HomeBanner'
import Footer from '../../components/Footer'
import Section from '../../components/Section'
import ProductCard from '../../components/Card/ProductCard'
import CategoryCard from '../../components/Card/CategoryCard'

import { PageWrap } from '../../layouts'
import { SearchBar } from '../../components'
import { useAuthContext } from '../../context/AuthProvider'
import { ERROR_TOAST, SEARCH_INDEX, searchClient } from '../../constants'
import {
  Maybe,
  Product,
  useProductQuery,
  Category,
  useCategoryQuery
} from '../../generated/graphql'
import InfoBanner from '../../components/InfoBanner'

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
  const [isSearching, setIsSearching] = React.useState<boolean>(false)
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

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
        tradeFedCost_gt: parseInt(query?.minPrice || '0'),
        tradeFedCost_lt: parseInt(query?.maxPrice || '10000'),
        categories_contains: query?.category
      }
    },
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })
  const categories = get(data, 'categories', null) as Category[]
  const products = get(productData, 'products', null) as Product[]
  const deals: Product[] = slice(reverse(sortBy(products, [(product) => product?.discount])), 0, 3)

  React.useEffect(() => {
    if (isAuthenticated && !user?.profileCompleted) {
      history.push('/user-onboarding-intro')
    }
    // eslint-disable-next-line
  }, [user, isAuthenticated])

  const navigateToProduct = (id: Maybe<string> | undefined) => {
    const modifiedId = id?.toLowerCase()
    history.push(`/product/${modifiedId}`)
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

  return (
    <PageWrap
      title="Dashboard"
      color="colors.white"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <InstantSearch indexName={SEARCH_INDEX} searchClient={searchClient}>
        <Flex flexDirection="column" width="100%" alignItems="center">
          {isTabletOrMobile && (
            <SearchBar
              handleFilter={handleFilter}
              handleSearch={handleSearch}
              handleReset={handleReset}
            />
          )}
          {isFiltered ? (
            <Section title="All filtered items" borderBottomWidth={10} maxWidth={'1100px'}>
              {products?.length > 0 ? (
                products?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
                ))
              ) : (
                <Text> No products matching the selected filters </Text>
              )}
            </Section>
          ) : isSearching ? (
            <Section title="" maxWidth={'1100px'}>
              <Stats />
              <Hits hitComponent={ProductDisplay} />
            </Section>
          ) : (
            <React.Fragment>
              <InfoBanner />
              <HomeBanner
                image={isTabletOrMobile ? images.heroImg : images.homeBanner2}
                header=""
                caption=""
              />
              <Section card title="Product Categories" borderBottomWidth={10} maxWidth={'1100px'}>
                {categories?.map((category: Category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    handleClick={navigateToCategory}
                  />
                ))}
              </Section>
              <Section card title="Today’s Best Deals" borderBottomWidth={10} maxWidth={'1100px'}>
                {deals?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
                ))}
              </Section>
              <Section card title="Deals For You" maxWidth={'1100px'}>
                {products?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} handleClick={navigateToProduct} />
                ))}
                <Button mt={4} width="100%" variantColor="brand">
                  VIEW MORE
                </Button>
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
