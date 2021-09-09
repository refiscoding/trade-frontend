import * as React from 'react'
import { Flex, FlexProps, Text, useToast } from '@chakra-ui/core'
import { ApolloError, ApolloQueryResult } from 'apollo-boost'
import { get } from 'lodash'
import { Search } from 'react-feather'

import { H3 } from '../../typography'
import { PageWrap } from '../../layouts'
import { theme } from '../../theme'
import { useMediaQuery } from 'react-responsive'
import NavigationHeader from './navigationHeader'
import {
  Order,
  FetchUserCheckoutOrdersQuery,
  useFetchUserCheckoutOrdersQuery,
  UsersPermissionsUser
} from '../../generated/graphql'
import BusinessOrdersWeb from './businessOrdersWeb'
import { ERROR_TOAST } from '../../constants'
import { Ranges } from '../Orders/DatePickerForm'
import { Form, Formik } from 'formik'
import { ConnectedFormGroup } from '../../components/FormElements'
import BusinessOrderConfirmation from './BusinessOrderConfirmation'
import ReadyForDispatch from './ReadyForDispatch'
import DispatchedBusinessOrder from './DispatchedBusinessOrder'
// import BusinessOrdersSearchBox from './BusinessOrdersSearchBox'

type BusinessOrdersPageProps = FlexProps & {
  isTabletOrMobile: boolean
}

type BusinessPageProps = {
  user?: UsersPermissionsUser
}

export type BusinessOrdersProps = {
  orders: Order[]
  ordersLoading: boolean
  refetchUserOrders: () => Promise<ApolloQueryResult<FetchUserCheckoutOrdersQuery>>
  setDateRange: React.Dispatch<React.SetStateAction<Ranges | undefined>>
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

const BusinessOrdersPage: React.FC<BusinessPageProps> = ({ user }) => {
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const [dateRange, setDateRange] = React.useState<Ranges>()
  const [activeTab, setActiveTab] = React.useState('all')

  const res = {
    input: {
      startDate: dateRange?.startDate ?? null,
      endDate: dateRange?.endDate ?? null
    }
  }

  const {
    data: userOrders,
    loading: userOrdersLoading,
    refetch: refetchUserOrders
  } = useFetchUserCheckoutOrdersQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    variables: { ...res }
  })
  const orders = get(userOrders, 'findCheckoutOrders.payload')

  React.useEffect(() => {
    refetchUserOrders()
    setDateRange({
      endDate: null,
      startDate: null
    })
  }, [refetchUserOrders, setDateRange])

  const renderTabContent = (activeTab: string) => {
    switch (activeTab) {
      case 'all':
        return (
          <Flex flexDirection="column" width="90%">
            <BusinessOrdersWeb
              orders={orders}
              refetchUserOrders={refetchUserOrders}
              setDateRange={setDateRange}
              ordersLoading={userOrdersLoading}
            />
            <BusinessOrderConfirmation />
            <ReadyForDispatch
              orders={orders}
              ordersLoading={userOrdersLoading}
              refetchUserOrders={refetchUserOrders}
              setDateRange={setDateRange}
              user={user}
            />
            <DispatchedBusinessOrder
              orders={orders}
              refetchUserOrders={refetchUserOrders}
              setDateRange={setDateRange}
              ordersLoading={userOrdersLoading}
            />
          </Flex>
        )
      case 'confirmation':
        return <BusinessOrderConfirmation />
      case 'processing':
        return (
          <BusinessOrdersWeb
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            setDateRange={setDateRange}
            ordersLoading={userOrdersLoading}
          />
        )
      case 'ready':
        return (
          <ReadyForDispatch
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            setDateRange={setDateRange}
            ordersLoading={userOrdersLoading}
          />
        )
      case 'dispatched':
        return (
          <DispatchedBusinessOrder
            orders={orders}
            refetchUserOrders={refetchUserOrders}
            setDateRange={setDateRange}
            ordersLoading={userOrdersLoading}
          />
        )
      default:
        return <BusinessOrderConfirmation />
    }
  }

  return (
    <PageWrap title="Business Orders" color="colors.white" justifyContent="space-between">
      <Flex alignSelf="center" width="80%" flexDirection="column" alignItems="center">
        <BusinessOrdersPageHeader isTabletOrMobile={isTabletOrMobile} />
        {/* To-Do: create usable search box */}
        {/* <BusinessOrdersSearchBox handleSearch={() => {}} handleReset={() => {}} /> */}
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
              onChange={() => {}}
              onReset={() => {}}
              value=""
              mb={0}
            />
          </Form>
        </Formik>
        <Flex justify="space-between" mb="0">
          <H3 textAlign="left" fontSize={18} fontWeight={600}>
            <NavigationHeader setActiveTab={setActiveTab} activeTab={activeTab} />
          </H3>
        </Flex>
        <Flex width="65%" mr={4}></Flex>
      </Flex>
      {renderTabContent(activeTab)}
    </PageWrap>
  )
}

export default BusinessOrdersPage
