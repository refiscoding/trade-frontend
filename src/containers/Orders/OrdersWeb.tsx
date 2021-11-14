import * as React from 'react'
import dayjs from 'dayjs'

import { useHistory } from 'react-router-dom'
import { Flex, Grid, Tag, Spinner, Button } from '@chakra-ui/core'

import OrderItemsSummary from './OrderItems'
import OrderComponent from './OrderComponent'
import NoData from '../Checkout/NoDataScreen'
import setOrderStatusAndColor from './setOrderStatusAndColor'

import { OrdersPageProps } from '.'
import { theme, images } from '../../theme'
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography'
import { Order } from '../../generated/graphql'

import SelectDateRangeForm from './DatePickerForm'

const OrdersPageWeb: React.FC<OrdersPageProps> = ({
  orders,
  isFiltering,
  setDateRange,
  refetchUserOrders,
  ordersLoading,
  setIsFiltering
}) => {
  const history = useHistory()
  const noOrders = !orders?.length
  const fileIcon = images.filesIcon

  const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>()

  const cancelStyles = {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.colors.blueText
  }

  const noOrdersNoOrderClickedMessage = `If you had orders, you would select one on the left and view its details here. For now, ${
    isFiltering ? 'change the date filters' : 'shop for products'
  }`
  const noOrdersHeader = 'Shop for products'
  const noFilterHeader = 'No results found'
  const noFilterCaption = 'There were no orders in your history in the date range provided'
  const noOrdersCaption =
    "You currently don't have an order history. Complete an order and it will show up here"

  const noOrderClickedHeader = noOrders ? noOrdersHeader : 'Select an order to view details'
  const noOrderClickedCaption = noOrders
    ? noOrdersNoOrderClickedMessage
    : `
       You haven't selected any order to view its details.
       Selecting an order will have it displayed here
   `
   const handleReturnOrderClicked = () => {
    history.push('/returns')
  }

  const orderStatusAndColor = setOrderStatusAndColor(selectedOrder)

  const ordersLength = orders?.length

  const cancelFilters = () => {
    setIsFiltering(false)
    setDateRange({
      endDate: null,
      startDate: null
    })
    refetchUserOrders()
  }

  React.useEffect(() => {
    if (isFiltering) {
      setSelectedOrder(undefined)
    }
  }, [isFiltering, setSelectedOrder])

  return (
    <PageWrap title="Orders" alignSelf="center" width="90%" mt={20} pt={0} p={0}>
      <Flex width="100%">
        <Flex width="100%" flexDirection="column">
          <Grid
            pt={3}
            pl={5}
            pr={3}
            width="100%"
            borderRadius={5}
            background={theme.colors.accent[50]}
            boxShadow={theme.boxShadowMedium}
          >
            <Grid gridTemplateRows="20px 20px">
              <Flex justify="space-between">
                <H3 textAlign="left" fontSize={18} fontWeight={600}>
                  My Order History
                </H3>
                {noOrders && !isFiltering ? (
                  <Button
                    mb={4}
                    width="100px"
                    variantColor="brand"
                    size="sm"
                    onClick={() => history.push('/')}
                  >
                    SHOP
                  </Button>
                ) : (
                  <Text onClick={handleReturnOrderClicked} fontSize={14} style={cancelStyles}>
                    Return an Order
                  </Text>
                )}
              </Flex>
            </Grid>
          </Grid>
          <Grid mt={5} gridTemplateColumns="400px 1fr">
            <Flex
              p={4}
              mr={5}
              borderRadius={5}
              background={theme.colors.accent[50]}
              boxShadow={theme.boxShadowMedium}
            >
              <Flex flexDirection="column">
                <Flex mb={2}>
                  {!noOrders && (
                    <SelectDateRangeForm
                      isFiltering={isFiltering}
                      setIsFiltering={setIsFiltering}
                      setDateRange={setDateRange}
                      refetchUserOrders={refetchUserOrders}
                    />
                  )}
                  {noOrders && (
                    <Text onClick={cancelFilters} mr={3} fontSize={14} style={cancelStyles}>
                      Clear
                    </Text>
                  )}
                </Flex>
                {isFiltering && (
                  <Flex>{`${
                    ordersLength
                      ? `${ordersLength} ${ordersLength > 1 ? 'results' : 'result'} found`
                      : ''
                  }`}</Flex>
                )}
                <Flex flexDirection="column" overflowY="scroll" height={'500px'}>
                  {ordersLoading && <Spinner margin="auto" />}
                  {noOrders ? (
                    <NoData
                      header={`${isFiltering ? noFilterHeader : noOrderClickedHeader}`}
                      caption={`${isFiltering ? noFilterCaption : noOrdersCaption}`}
                      image={`${isFiltering ? fileIcon : images.emptyWishlist}`}
                    />
                  ) : (
                    orders?.map((order, index) => (
                      <OrderComponent
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
              mr={5}
              borderRadius={5}
              background={theme.colors.accent[50]}
              boxShadow={theme.boxShadowMedium}
              width="100%"
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
                <NoData
                  header={`${
                    isFiltering && noOrders
                      ? noFilterHeader
                      : isFiltering && !noOrders
                      ? `${orders?.length} ${orders?.length > 1 ? 'results' : 'result'} found`
                      : noOrderClickedHeader
                  }`}
                  caption={`${noOrderClickedCaption}`}
                />
              )}
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default OrdersPageWeb
