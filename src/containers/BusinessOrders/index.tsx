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
  useFetchUserCheckoutOrdersQuery,
  Order,
  FetchUserCheckoutOrdersQuery
} from '../../generated/graphql'
import BusinessOrdersWeb from './businessOrdersWeb'
import { ERROR_TOAST } from '../../constants'
import { Ranges } from '../Orders/DatePickerForm'
import { Form, Formik } from 'formik'
import { ConnectedFormGroup } from '../../components/FormElements'
// import BusinessOrdersSearchBox from './BusinessOrdersSearchBox'

type BusinessOrdersPageProps = FlexProps & {
  isTabletOrMobile: boolean
}

export type BusinessOrdersProps = {
  orders: Order[]
  ordersLoading: boolean
  refetchUserOrders: () => Promise<ApolloQueryResult<FetchUserCheckoutOrdersQuery>>
  setDateRange: React.Dispatch<React.SetStateAction<Ranges | undefined>>
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

const BusinessOrdersPage: React.FC = () => {
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const [dateRange, setDateRange] = React.useState<Ranges>()

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

  return (
    <PageWrap
      title="Business Orders"
      color="colors.white"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Flex
        ml={isTabletOrMobile ? 0 : 5}
        mt={3}
        alignSelf="center"
        width={isTabletOrMobile ? '100%' : '80%'}
        flexDirection="column"
        alignItems="center"
      >
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
            <NavigationHeader />
          </H3>
        </Flex>
        <Flex width="65%" mr={4}></Flex>
      </Flex>
      <BusinessOrdersWeb
        orders={orders}
        refetchUserOrders={refetchUserOrders}
        setDateRange={setDateRange}
        ordersLoading={userOrdersLoading}
      />
    </PageWrap>
  )
}

export default BusinessOrdersPage
