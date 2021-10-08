import * as React from 'react'
import { Flex, FlexProps, Text, useToast } from '@chakra-ui/core'
import { ApolloError, ApolloQueryResult } from 'apollo-boost'
import { connectSearchBox, Hits, InstantSearch, Stats } from 'react-instantsearch-dom'
import { get } from 'lodash'
import { Search } from 'react-feather'

import { ConnectedFormGroup } from '../../components/FormElements'
import { ERROR_TOAST, SEARCH_INDEX, searchClient } from '../../constants'
import {
  FetchUserCheckoutOrdersQuery,
  Order,
  useFetchOrderByBusinessQuery,
  UsersPermissionsUser
} from '../../generated/graphql'
import { Form, Formik } from 'formik'
import { H3 } from '../../typography'
import { PageWrap } from '../../layouts'
import { theme } from '../../theme'
import { useMediaQuery } from 'react-responsive'
import BusinessOrderConfirmation from './BusinessOrderConfirmation'
import BusinessOrdersWeb from './businessOrdersWeb'
import DispatchedBusinessOrder from './DispatchedBusinessOrder'
import NavigationHeader from './navigationHeader'
import ReadyForDispatch from './ReadyForDispatch'
import Section from '../../components/Section'

type BusinessOrdersPageProps = FlexProps & {
  isTabletOrMobile: boolean
}

type BusinessPageProps = {}

export type BusinessOrdersProps = {
  orders: Order[]
  ordersLoading: boolean
  refetchUserOrders: () => Promise<ApolloQueryResult<FetchUserCheckoutOrdersQuery>>
  user?: UsersPermissionsUser
}

const BusinessOrdersPageHeader: React.FC<BusinessOrdersPageProps> = ({ isTabletOrMobile }) => {
  return (
    <Flex
      width="100%"
      ml={isTabletOrMobile ? 0 : 5}
      mb={4}
      justifyContent="space-between"
      flexDirection="column"
    >
      <H3 textAlign="left" fontSize={18} fontWeight={600}>
        Business Orders
      </H3>
      <Text color={theme.colors.dimText} textAlign="center" fontSize={14}>
        These are all of your order requests and their statuses.
      </Text>
    </Flex>
  )
}

const BusinessOrdersPage: React.FC<BusinessPageProps> = () => {
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const [activeTab, setActiveTab] = React.useState('confirmation')
  const [isSearching, setIsSearching] = React.useState<boolean>(false)

  const {
    data: userOrders,
    loading: userOrdersLoading,
    refetch: refetchUserOrders
  } = useFetchOrderByBusinessQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })
  const orders = get(userOrders, 'fetchOrderByBusiness.payload')

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

  const OrderDisplay: React.FC = ({ hit }: any) => {
    //TO-DO
    return <> order cards here </>
  }

  React.useEffect(() => {
    refetchUserOrders()
  }, [refetchUserOrders])

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case 'confirmation':
        return (
          <BusinessOrderConfirmation
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            ordersLoading={userOrdersLoading}
          />
        )
      case 'processing':
        return (
          <BusinessOrdersWeb
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            ordersLoading={userOrdersLoading}
          />
        )
      case 'ready':
        return (
          <ReadyForDispatch
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            ordersLoading={userOrdersLoading}
          />
        )
      case 'dispatched':
        return (
          <DispatchedBusinessOrder
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            ordersLoading={userOrdersLoading}
          />
        )
      default:
        return (
          <BusinessOrderConfirmation
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            ordersLoading={userOrdersLoading}
          />
        )
    }
  }

  const SearchBox = connectSearchBox(({ refine, currentRefinement }) => (
    <Formik initialValues={{ search: '' }} onSubmit={() => {}}>
      <Form style={{ width: '80%' }}>
        <ConnectedFormGroup
          icon={Search}
          name="search"
          placeholder="Search Orders"
          fontSize={12}
          paddingLeft="40px"
          borderColor="transparent"
          bg="accent.600"
          iconPosition="left"
          onChange={(e: any) => {
            handleSearch(e.target.value)
            refine(e.target.value)
          }}
          onReset={handleReset}
          value={currentRefinement}
          mb={0}
        />
      </Form>
    </Formik>
  ))
  return (
    <PageWrap mt={10} title="Business Orders" color="colors.white" justifyContent="space-between">
      <InstantSearch indexName={SEARCH_INDEX} searchClient={searchClient}>
        <Flex alignSelf="center" width="80%" flexDirection="column" alignItems="center">
          <BusinessOrdersPageHeader isTabletOrMobile={isTabletOrMobile} />
          <SearchBox />
          {isSearching ? (
            <Section title="" maxWidth={'1100px'}>
              <Stats />
              <Hits hitComponent={OrderDisplay} />
            </Section>
          ) : (
            <Flex justify="space-between" mb="0">
              <H3 textAlign="left" fontSize={18} fontWeight={600}>
                <NavigationHeader setActiveTab={setActiveTab} activeTab={activeTab} />
              </H3>
            </Flex>
          )}
          <Flex width="65%" mr={4}></Flex>
        </Flex>
        {renderTabContent(activeTab)}
      </InstantSearch>
    </PageWrap>
  )
}

export default BusinessOrdersPage
