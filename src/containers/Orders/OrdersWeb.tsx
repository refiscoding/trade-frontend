import * as React from 'react'
import dayjs from 'dayjs'

import { useHistory } from 'react-router-dom'
import { DateRangePicker } from 'react-dates'
import { Flex, Grid, Tag, Spinner, Button } from '@chakra-ui/core'

import OrderItemsSummary from './OrderItems'
import OrderComponent from './OrderComponent'
import NoData from '../Checkout/NoDataScreen'

import { OrdersPageProps } from '.'
import { theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography'
import { mapsScriptUrl } from '../../constants'
import { Order } from '../../generated/graphql'

const OrdersPageWeb: React.FC<OrdersPageProps> = ({ orders, ordersLoading }) => {
  const history = useHistory()
  const noOrders = !orders?.length

  const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>()

  const cancelStyles = {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.colors.blueText
  }

  const noOrdersNoOrderClickedMessage =
    'If you had orders, you would select one on the left and view its details here. For now, shop for products'
  const noOrdersHeader = 'Shop for products'
  const noOrdersCaption =
    "You currently don't have an order history. Complete an order and it will show up here"

  const noOrderClickedHeader = noOrders ? noOrdersHeader : 'Select an order to view details'
  const noOrderClickedCaption = noOrders
    ? noOrdersNoOrderClickedMessage
    : `
       You haven't selected any order to view its details.
       Selecting an order will have it displayed here
   `
  const orderAddress = selectedOrder?.deliveryAddress?.address?.split(',') ?? []
  const handleReturnOrderClicked = () => {
    history.push('/returns')
  }
  return (
    <PageWrap
      title="Orders"
      alignSelf="center"
      width="90%"
      mt={20}
      pt={0}
      p={0}
      script={mapsScriptUrl}
    >
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
                {noOrders ? (
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
                  <Text onClick={handleReturnOrderClicked} fontSize={12} style={cancelStyles}>
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
                    <Flex flexDirection="column">
                      <Text>Select Date Range:</Text>
                      <DateRangePicker
                        startDate={null}
                        endDate={null}
                        startDateId="start"
                        endDateId="end"
                        onDatesChange={() => console.log('TODO: Add Handler')}
                        focusedInput={null}
                        onFocusChange={() => console.log('TODO: Add Handler')}
                      />
                    </Flex>
                  )}
                </Flex>
                <Flex flexDirection="column" overflowY="scroll" height={'500px'}>
                  {ordersLoading && <Spinner margin="auto" />}
                  {noOrders ? (
                    <NoData header={noOrdersHeader} caption={noOrdersCaption} />
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
                        <Text fontSize={14} ml={3}>{`${dayjs(selectedOrder?.paidDate).format(
                          'LLLL'
                        )}`}</Text>
                      </Grid>
                      <Grid gridTemplateColumns="100px 250px">
                        <Text fontSize={14} fontWeight={600}>
                          Payment
                        </Text>
                        <Text fontSize={14} ml={3}>
                          Credit & Debit
                        </Text>
                      </Grid>
                    </Flex>
                    <Flex flexDirection="column" justifySelf="end" width="100%">
                      <Tag
                        fontSize={12}
                        size="sm"
                        background="#c9cfd4"
                        width="50%"
                        display="inline-block"
                      >
                        BUSINESS
                      </Tag>
                      <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.name}`}</Text>
                      <Text fontSize={14}>{`${orderAddress[0]}`}</Text>
                      <Text fontSize={14}>{`${orderAddress[1]}`}</Text>
                      <Text fontSize={14}>{`${orderAddress[2]}`}</Text>
                      <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.postalCode}`}</Text>
                    </Flex>
                  </Grid>
                  <Flex minHeight="435px">
                    <OrderItemsSummary
                      isMobile={false}
                      items={selectedOrder?.items}
                      total={selectedOrder?.orderTotal}
                    />
                  </Flex>
                </Flex>
              ) : (
                <NoData header={noOrderClickedHeader} caption={noOrderClickedCaption} />
              )}
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default OrdersPageWeb
