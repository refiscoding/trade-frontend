import * as React from 'react'
import dayjs from 'dayjs'
import { Button, Flex, Grid, Link, Tag, Spinner } from '@chakra-ui/core'

import { BusinessOrdersProps } from '.'
import { images, theme } from '../../theme'
import { Order } from '../../generated/graphql'
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography'

import BusinessOrderComponent from './BusinessOrderComponent'
import NoData from '../Checkout/NoDataScreen'
import OrderItemsSummary from '../Orders/OrderItems'
import PickupModal from './PickupModal'
import setOrderStatusAndColor from '../Orders/setOrderStatusAndColor'

const BusinessOrdersPageWeb: React.FC<BusinessOrdersProps> = ({ orders, ordersLoading }) => {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>()
  const [showModal, setShowModal] = React.useState<boolean>(false)

  const confirmationOrders = orders?.filter((order) => order.businessOrderStatus === 'PROCESSING')
  const noOrders = !confirmationOrders?.length

  const confirmationText = 'Before we pickup, just a gentle reminder that you need a label. '
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
  const orderStatusAndColor = setOrderStatusAndColor(selectedOrder)
  const handleSelectedLabelItem = () => {
    localStorage.setItem('generated_label', JSON.stringify(selectedOrder, null, 2))
  }
  const clearSelectedLabelItem = () => {
    localStorage.removeItem('generated_label')
  }

  return (
    <PageWrap title="Business Orders" alignSelf="center" width="90%" mt={0} pt={0} p={0}>
      <H3 textAlign="left" fontSize={14} fontWeight={700}>
        Orders In Process
      </H3>
      <Flex width="100%" mt={2}>
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
                <Flex flexDirection="column" overflow="hidden" height={'500px'}>
                  {ordersLoading && <Spinner margin="auto" />}
                  {noOrders ? (
                    <NoData
                      header={`${noOrderClickedHeader}`}
                      caption={`${noOrdersCaption}`}
                      image={`${images.emptyWishlist}`}
                    />
                  ) : (
                    confirmationOrders?.map((order, index) => (
                      <BusinessOrderComponent
                        key={`${index}_order_entry`}
                        setSelectedOrder={setSelectedOrder}
                        order={order}
                        confirmationText={confirmationText}
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
            >
              {selectedOrder ? (
                <Flex flexDirection="column" width="100%">
                  {showModal && (
                    <PickupModal
                      confirmationText={confirmationText}
                      handleSelectedLabelItem={handleSelectedLabelItem}
                      handleCancelButtonClicked={() => {
                        clearSelectedLabelItem()
                        setShowModal(false)
                      }}
                    />
                  )}
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
                      <Text fontSize={14}>{selectedOrder?.deliveryAddress?.name}</Text>
                      <Text fontSize={14}>{selectedOrder?.deliveryAddress?.province}</Text>
                      <Text fontSize={14}>{selectedOrder?.deliveryAddress?.city}</Text>
                      <Text fontSize={14}>{selectedOrder?.deliveryAddress?.suburb}</Text>
                      <Text fontSize={14}>{selectedOrder?.deliveryAddress?.postalCode}</Text>
                    </Flex>
                  </Flex>

                  <Flex justify="space-between" alignItems="center" flexDirection="column">
                    <Flex>
                      <Button
                        type="submit"
                        mt={4}
                        variantColor="brand"
                        onClick={() => setShowModal(true)}
                      >
                        <Text fontSize="12px">READY FOR PICKUP</Text>
                      </Button>
                    </Flex>
                    <Flex flexDirection="column" mt={3} mb={3} width="100%" alignItems="center">
                      <Text fontSize={12} fontWeight={700}>
                        Something not right?{' '}
                        <Link href="#" cursor="pointer">
                          Contact Support
                        </Link>
                      </Text>
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
    </PageWrap>
  )
}

export default BusinessOrdersPageWeb
