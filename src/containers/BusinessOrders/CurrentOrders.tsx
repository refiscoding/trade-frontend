import * as React from 'react'
import dayjs from 'dayjs'

import { ApolloError, ApolloQueryResult } from 'apollo-boost'
import { ArrowLeft, Search } from 'react-feather'
import { Flex, Grid, Tag, IconButton, Spinner, useToast } from '@chakra-ui/core'
import { useHistory } from 'react-router-dom'

import {
  useFetchUserCheckoutOrdersQuery,
  Order,
  FetchUserCheckoutOrdersQuery
} from '../../generated/graphql'

import { ConnectedFormGroup } from '../../components/FormElements'
import { ERROR_TOAST } from '../../constants'
import { Form, Formik } from 'formik'
import { get } from 'lodash'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { Ranges } from '../Orders/DatePickerForm'

import CurrentOrderComponent from './CurrentOrderComponent'
import NoData from '../Checkout/NoDataScreen'
import OrderItemsSummary from '../Orders/OrderItems'
import setOrderStatusAndColor from '../Orders/setOrderStatusAndColor'

type CurrentOrdersProps = {
  orders: Order[]
  ordersLoading: boolean
  refetchUserOrders: () => Promise<ApolloQueryResult<FetchUserCheckoutOrdersQuery>>
  setDateRange: React.Dispatch<React.SetStateAction<Ranges | undefined>>
}

const CurrentOrdersPageWeb: React.FC<CurrentOrdersProps> = () => {
  const toast = useToast()
  const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>()
  const [dateRange, setDateRange] = React.useState<Ranges>()
  const history = useHistory()

  const noOrdersNoOrderClickedMessage =
    'If you had orders, you would select one on the left and view its details here. For now, shop for products'
  const noOrdersHeader = 'Shop for products'
  const noOrdersCaption =
    "You currently don't have an order history. Complete an order and it will show up here"

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

  React.useEffect(() => {
    refetchUserOrders()
    setDateRange({
      endDate: null,
      startDate: null
    })
  }, [refetchUserOrders, setDateRange])

  const orders = get(userOrders, 'findCheckoutOrders.payload')
  const noOrders = !orders?.length

  const noOrderClickedHeader = noOrders ? noOrdersHeader : 'Select an order to view details'
  const noOrderClickedCaption = noOrders
    ? noOrdersNoOrderClickedMessage
    : `
       You haven't selected any order to view its details.
       Selecting an order will have it displayed here
   `
  const orderStatusAndColor = setOrderStatusAndColor(selectedOrder)

  const navigateToProfile = () => {
    history.push('/profile')
  }

  return (
    <PageWrap title="Current Orders" color="colors.white" justifyContent="space-between">
      <Flex alignSelf="center" width="80%" flexDirection="column" alignItems="center" p={2}>
        <Flex alignSelf="flex-start" pt={4} pb={4}>
          <IconButton
            icon={ArrowLeft}
            aria-label="Go to Profile"
            backgroundColor="transparent"
            onClick={() => navigateToProfile()}
          />
          <H3
            textAlign="left"
            fontSize={14}
            fontWeight={700}
            pl={4}
            style={{ placeSelf: 'center' }}
          >
            Current Orders
          </H3>
        </Flex>
        <Formik initialValues={{ search: '' }} onSubmit={() => {}}>
          <Form style={{ width: '80%' }}>
            <ConnectedFormGroup
              icon={Search}
              name="search"
              placeholder="Search active orders"
              fontSize={12}
              paddingLeft="40px"
              borderColor="transparent"
              bg="accent.600"
              iconPosition="left"
              onChange={() => {}}
              onReset={() => {}}
              value=""
            />
          </Form>
        </Formik>
        <Flex width="100%" pt={4}>
          <Flex width="100%" flexDirection="column">
            <Grid gridTemplateColumns="400px 1fr">
              <Flex
                p={4}
                mr={5}
                borderRadius={5}
                background={theme.colors.accent[50]}
                boxShadow={theme.boxShadowMedium}
              >
                <Flex flexDirection="column">
                  <Flex flexDirection="column" overflow="hidden" minHeight="100vh">
                    {userOrdersLoading && <Spinner margin="auto" />}
                    {noOrders ? (
                      <NoData
                        header={`${noOrderClickedHeader}`}
                        caption={`${noOrdersCaption}`}
                        image={`${images.emptyWishlist}`}
                      />
                    ) : (
                      orders?.map((order: any, index: number) => (
                        <CurrentOrderComponent
                          key={`${index}_order_entry`}
                          setSelectedOrder={setSelectedOrder}
                          order={order}
                        />
                      ))
                    )}
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                p={4}
                borderRadius={5}
                background={theme.colors.accent[50]}
                boxShadow={theme.boxShadowMedium}
                width="100%"
                minHeight="100vh"
              >
                {selectedOrder ? (
                  <Flex flexDirection="column" width="100%">
                    <Grid
                      gridTemplateColumns="1fr 200px"
                      mb={3}
                      border={`1px solid ${theme.colors.background}`}
                      p={4}
                      borderRadius={5}
                    >
                      <Flex flexDirection="column">
                        <Grid gridTemplateColumns="100px 1fr">
                          <Text fontSize={14} fontWeight={600}>
                            Order:
                          </Text>
                          <Text fontSize={14} ml={3}>{`# ${selectedOrder?.orderNumber}`}</Text>
                        </Grid>
                        <Grid gridTemplateColumns="100px 250px">
                          <Text fontSize={14} fontWeight={600}>
                            Ordered:
                          </Text>
                          <Text fontSize={14} ml={3}>{`${dayjs(selectedOrder?.orderDate).format(
                            'LLLL'
                          )}`}</Text>
                        </Grid>
                        <Grid gridTemplateColumns="100px 250px">
                          <Text fontSize={14} fontWeight={600}>
                            Paid:
                          </Text>
                          <Text fontSize={14} ml={3}>{`${
                            selectedOrder?.paidDate
                              ? dayjs(selectedOrder?.paidDate).format('LLLL')
                              : 'Not Paid'
                          }`}</Text>
                        </Grid>
                        <Grid gridTemplateColumns="100px 250px">
                          <Text fontSize={14} fontWeight={600}>
                            Payment:
                          </Text>
                          <Text fontSize={14} ml={3}>
                            Credit & Debit
                          </Text>
                        </Grid>
                      </Flex>
                      <Flex justifySelf="end" width="100%">
                        <Text fontSize={14} fontWeight={600}>
                          Status:
                        </Text>
                        <Flex>
                          <Tag
                            fontSize={12}
                            ml={2}
                            alignSelf="start"
                            size="sm"
                            background={orderStatusAndColor?.colors?.background}
                            color={orderStatusAndColor?.colors?.color}
                          >
                            {orderStatusAndColor?.status?.toUpperCase()}
                          </Tag>
                        </Flex>
                      </Flex>
                    </Grid>
                    <Flex minHeight="435px" flexDirection="column">
                      <OrderItemsSummary
                        isMobile={false}
                        items={selectedOrder?.items}
                        total={selectedOrder?.orderTotal}
                      />
                      <Flex
                        mt={4}
                        flexDirection="column"
                        justifySelf="start"
                        width="100%"
                        p={3}
                        border={`1px solid ${theme.colors.background}`}
                        borderRadius={5}
                      >
                        <Text fontWeight={600} mb={3}>
                          tradeFed Pickup Point
                        </Text>
                        <Tag
                          fontSize={12}
                          size="sm"
                          background="#c9cfd4"
                          width="15%"
                          justifySelf="start"
                        >
                          BUSINESS
                        </Tag>
                        <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.name}`}</Text>
                        <Text fontSize={14}>{selectedOrder?.deliveryAddress?.province}</Text>
                        <Text fontSize={14}>{selectedOrder?.deliveryAddress?.city}</Text>
                        <Text fontSize={14}>{selectedOrder?.deliveryAddress?.suburb}</Text>
                        <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.postalCode}`}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ) : (
                  <NoData header={'No Orders'} caption={`${noOrderClickedCaption}`} />
                )}
              </Flex>
            </Grid>
          </Flex>
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default CurrentOrdersPageWeb
