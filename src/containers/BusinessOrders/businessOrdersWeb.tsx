import * as React from 'react'
import dayjs from 'dayjs'

import { Flex, Grid, Tag, Spinner } from '@chakra-ui/core'

import OrderItemsSummary from '../Orders/OrderItems'
import OrderComponent from '../Orders/OrderComponent'
import NoData from '../Checkout/NoDataScreen'
import setOrderStatusAndColor from '../Orders/setOrderStatusAndColor'

import { BusinessOrdersProps } from '.'
import { theme, images } from '../../theme'
import { PageWrap } from '../../layouts'
import { Text } from '../../typography'
import { Order } from '../../generated/graphql'

const BusinessOrdersPageWeb: React.FC<BusinessOrdersProps> = ({ orders, ordersLoading }) => {
  const noOrders = !orders?.length

  const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>()

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

  const orderStatusAndColor = setOrderStatusAndColor(selectedOrder)

  return (
    <PageWrap title="My Business Orders" alignSelf="center" width="90%" mt={0} pt={0} p={0}>
      <Flex width="100%">
        <Flex width="100%" flexDirection="column">
          <Grid mt={5} gridTemplateColumns="400px 1fr">
            <Flex
              p={4}
              mr={5}
              borderRadius={5}
              background={theme.colors.accent[50]}
              boxShadow={theme.boxShadowMedium}
            >
              <Flex flexDirection="column">
                <Flex flexDirection="column" overflowY="scroll" height={'500px'}>
                  {ordersLoading && <Spinner margin="auto" />}
                  {noOrders ? (
                    <NoData
                      header={`${noOrderClickedHeader}`}
                      caption={`${noOrdersCaption}`}
                      image={`${images.emptyWishlist}`}
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
                        TradeFed Pickup Point
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
                      <Text fontSize={14}>{`${orderAddress[0]}`}</Text>
                      <Text fontSize={14}>{`${orderAddress[1]}`}</Text>
                      <Text fontSize={14}>{`${orderAddress[2]}`}</Text>
                      <Text fontSize={14}>{`${selectedOrder?.deliveryAddress?.postalCode}`}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              ) : (
                <NoData header={'no orders'} caption={`${noOrderClickedCaption}`} />
              )}
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default BusinessOrdersPageWeb
