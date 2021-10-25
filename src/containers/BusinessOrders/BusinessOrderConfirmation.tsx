import * as React from 'react'

import dayjs from 'dayjs'
import { Button, Flex, Grid, Image, Link, Spinner, useToast } from '@chakra-ui/core'

import { BusinessOrdersProps } from '.'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'
import { Order } from '../../generated/graphql'
import { PageWrap } from '../../layouts'
import { SUCCESS_TOAST } from '../../constants/index'
import { toSentenceCase } from '../../utils/toSentenceCase'
import { useAuthContext } from '../../context/AuthProvider'

import BusinessOrderConfirmationComponent from './BusinessOrderConfirmationComponent'
import NoData from '../Checkout/NoDataScreen'
import strapiHelpers from '../../utils/strapiHelpers'

const BusinessOrderConfirmation: React.FC<BusinessOrdersProps> = ({
  orders,
  ordersLoading,
  refetchUserOrders
}) => {
  const toast = useToast()
  const { user } = useAuthContext()
  const [selectedOrder, setSelectedOrder] = React.useState<Order | undefined>()

  const confirmationOrders = orders?.filter((order) => order.businessOrderStatus === 'CONFIRMATION')
  const businessUserOrders = confirmationOrders?.filter(
    (order) => order?.items && order?.items?.length > 0
  )
  const noOrders = !businessUserOrders?.length
  const ordersLength = businessUserOrders?.length

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

  React.useEffect(() => {
    refetchUserOrders()
  }, [ordersLength, refetchUserOrders])

  return (
    <PageWrap title="Order Confirmation" alignSelf="center" width="90%" mt={0} pt={0} p={0}>
      <H3 textAlign="left" fontSize={14} fontWeight={700}>
        Order Confirmation
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
                    businessUserOrders?.map((order, index) => (
                      <BusinessOrderConfirmationComponent
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
            >
              {selectedOrder ? (
                <Flex
                  p={4}
                  mr={5}
                  mt={2}
                  borderRadius={5}
                  background={theme.colors.accent[50]}
                  boxShadow={theme.boxShadowMedium}
                  width="100%"
                  flexDirection="column"
                >
                  <Flex borderBottom={`1px solid ${theme.colors.background}`} mb={2} pb={3}>
                    <Text fontSize={16} fontWeight={600}>
                      Order #{selectedOrder?.orderNumber} has been placed
                    </Text>
                  </Flex>
                  <Flex
                    justify="space-between"
                    pt={2}
                    pb={3}
                    flexDirection="column"
                    color={theme.colors.bodyText}
                  >
                    <Flex pb={3}>
                      <Text fontSize={14} fontWeight={700}>
                        Order Number: {selectedOrder?.orderNumber}
                      </Text>
                    </Flex>
                    <Flex width="100%" pb={4}>
                      <Text fontSize={12} fontWeight={700}>
                        Origin:
                      </Text>
                      <Text fontSize={12} pl={2}>
                        {user?.business?.companyName}
                      </Text>
                    </Flex>
                    <Flex width="100%" pb={4}>
                      <Text fontSize={12} fontWeight={700}>
                        Date ordered:
                      </Text>
                      <Text fontSize={12} pl={2}>
                        {dayjs(selectedOrder?.orderDate).format('LLLL')}
                      </Text>
                    </Flex>
                    <Flex width="100%" pb={4}>
                      <Text fontSize={12} fontWeight={700}>
                        Destination:
                      </Text>
                      <Text fontSize={12} pl={2}>
                        {`${
                          selectedOrder?.deliveryAddress?.name &&
                          toSentenceCase(selectedOrder?.deliveryAddress?.name || '')
                        }, ${
                          selectedOrder?.deliveryAddress?.province &&
                          toSentenceCase(selectedOrder?.deliveryAddress?.province || '')
                        }, ${
                          selectedOrder?.deliveryAddress?.city &&
                          toSentenceCase(selectedOrder?.deliveryAddress?.city || '')
                        }, ${
                          selectedOrder?.deliveryAddress?.suburb &&
                          toSentenceCase(selectedOrder?.deliveryAddress?.suburb || '')
                        }`}
                      </Text>
                    </Flex>
                    <Flex width="100%" pb={4}>
                      <Text fontSize={12} fontWeight={700}>
                        Recipient Details:
                      </Text>
                      <Text fontSize={12} pl={2}>
                        <b>Name:</b> {selectedOrder.owner?.firstName}{' '}
                        {selectedOrder.owner?.lastName}
                      </Text>
                      <Text fontSize={12} pl={2}>
                        <b>Contact Number:</b>
                        {selectedOrder.owner?.phoneNumber}
                      </Text>
                    </Flex>
                    {selectedOrder?.items?.map((orderItem, index) => (
                      <Flex key={index} borderBottom={`1px solid ${theme.colors.background}`}>
                        <Flex width="50%" pt={4} pb={4}>
                          <Flex width="100%" flexDirection="row">
                            <Flex width="100%">
                              <Text fontSize={12} fontWeight={700}>
                                Item:
                              </Text>
                              <Text fontSize={12} pl={2}>
                                {orderItem?.product?.name}
                              </Text>
                            </Flex>
                            <Flex width="100%">
                              <Image
                                width="50%"
                                objectFit="cover"
                                src={orderItem?.product?.coverImage?.url}
                              />
                            </Flex>
                            <Flex width="100%" flexDirection="column" pl={2}>
                              <Flex width="100%">
                                <Text fontSize={12} fontWeight={700}>
                                  Product SKU:
                                </Text>
                                <Text fontSize={12} pl={2}>
                                  {orderItem?.product?.sku}
                                </Text>
                              </Flex>
                              <Flex width="100%">
                                <Text fontSize={12} fontWeight={700}>
                                  Quantity:
                                </Text>
                                <Text fontSize={12} pl={2}>
                                  {orderItem?.quantity}
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Flex width="50%" pt={4} pb={4} flexDirection="row">
                          <Text fontSize={12} fontWeight={700}>
                            Dimensions:
                          </Text>
                          <Flex pl={2} flexDirection="column">
                            <Flex flexDirection="row">
                              <Text fontSize={12} fontWeight={700}>
                                Height:
                              </Text>
                              <Text fontSize={12} pl={2}>
                                {orderItem?.product?.height} cm
                              </Text>
                            </Flex>
                            <Flex flexDirection="row">
                              <Text fontSize={12} fontWeight={700}>
                                Width:
                              </Text>
                              <Text fontSize={12} pl={2}>
                                {orderItem?.product?.width} cm
                              </Text>
                            </Flex>
                            <Flex flexDirection="row">
                              <Text fontSize={12} fontWeight={700}>
                                Length:
                              </Text>
                              <Text fontSize={12} pl={2}>
                                {orderItem?.product?.lengths} cm
                              </Text>
                            </Flex>
                            <Flex flexDirection="row">
                              <Text fontSize={12} fontWeight={700}>
                                Weight:
                              </Text>
                              <Text fontSize={12} pl={2}>
                                {orderItem?.product?.weight} kg
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                  <Flex justify="space-between" flexDirection="column" alignItems="center">
                    <Flex>
                      <Button
                        type="submit"
                        mt={4}
                        variantColor="brand"
                        onClick={() => {
                          toast({
                            description: 'Order Confirmation Email Successfully Sent',
                            ...SUCCESS_TOAST
                          })
                          return strapiHelpers.sendOrderConfirmationEmail(selectedOrder)
                        }}
                      >
                        <Text fontSize="12px">CONFIRM AVAILABILITY</Text>
                      </Button>
                    </Flex>
                    <Flex flexDirection="column" mt={3} width="100%" alignItems="center">
                      <Text fontSize={12} fontWeight={700}>
                        <Link
                          href="#"
                          cursor="pointer"
                          borderBottom={`1px solid ${theme.colors.brand[500]}`}
                        >
                          Unfortunately not available
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

export default BusinessOrderConfirmation
