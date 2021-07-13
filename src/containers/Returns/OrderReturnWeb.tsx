import * as React from 'react'

import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'

import { get } from 'lodash'
import { Form, Formik } from 'formik'
import { ArrowLeft } from 'react-feather'
import { ApolloError } from 'apollo-boost'
import { useHistory } from 'react-router-dom'
import { Flex, Grid, Button, Spinner, Tag, Image, useToast } from '@chakra-ui/core'

import NoData from '../Checkout/NoDataScreen'

import { theme } from '../../theme'
import { OrderReturnsProps } from '.'
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography'
import { Order, Maybe, Product, useRequestForReturnMutation } from '../../generated/graphql'
import {
  ConnectedFormGroup,
  ConnectedTextArea,
  ConnectedSelect
} from '../../components/FormElements'
import { formatError } from '../../utils'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'

dayjs.extend(RelativeTime)

type Values = {
  returnOrderId: Maybe<string> | undefined
  returnProductName?: string
  returnReason?: string
  returnAction?: string
}

type OrderReturnProductProps = {
  refundable: boolean
  orderDate: string
  product: Maybe<Product> | undefined
  productToReturn?: string
  setProductToReturn?: React.Dispatch<React.SetStateAction<Maybe<Product> | undefined>>
}

const OrderReturnProduct: React.FC<OrderReturnProductProps> = ({
  product,
  orderDate,
  refundable,
  productToReturn,
  setProductToReturn
}) => {
  const maxSellCost = get(product, 'maxSellCost') as number
  const tradeFedCost = get(product, 'tradeFedCost') as number

  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  const handleProductClicked = () => {
    if (setProductToReturn) {
      setProductToReturn(product)
    }
  }
  return (
    <Flex
      mt={3}
      width={'100%'}
      alignItems="center"
      position="relative"
      onClick={handleProductClicked}
      justifyContent="space-between"
      cursor={refundable ? 'pointer' : 'not-allowed'}
      background={`${productToReturn === product?.id ? theme.colors.background : ''}`}
    >
      <Flex
        width="100%"
        borderRadius={3}
        height="100px"
        flexDirection="row"
        border={`1px solid ${theme.colors.background}`}
      >
        <Flex width="50%" position="relative">
          <Image
            width="75%"
            height="100%"
            borderTopLeftRadius={3}
            borderBottomLeftRadius={3}
            src={product?.coverImage?.url || ''}
            style={{ filter: refundable ? '' : 'grayscale(100%)' }}
          />
          {discount ? (
            <Flex
              top={0}
              left={117}
              width="50px"
              height="50px"
              position="absolute"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              bg={refundable ? 'accent.700' : '#acacac'}
            >
              <Text color="white" fontSize="14px">
                Save
              </Text>
              <Text color="white" fontSize="14px" fontWeight={600}>
                {`${discount}%`}
              </Text>
            </Flex>
          ) : null}
        </Flex>
        <Flex width={`100%`} ml={'-2rem'} flexDirection="column">
          <Text my={2} color={`${refundable ? '' : '#acacac'}`} fontSize="14px" fontWeight={600}>
            {product?.name}
          </Text>
          <Text my={2} color={`${refundable ? '' : '#acacac'}`} fontSize="12px">
            {`Ordered: ${dayjs(orderDate).format('DD/MM/YYYY')} (${dayjs(orderDate).fromNow()})`}
          </Text>
          <Text color={`${refundable ? '' : '#acacac'}`} fontSize="12px">
            {`${product?.currency} ${product?.tradeFedCost}.00`}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

const OrderReturns: React.FC<OrderReturnsProps> = ({
  orders,
  actions,
  reasons,
  fetchingOrders,
  pastOrders,
  activeOrders,
  noPastOrdersHeader,
  noPastOrdersCaption,
  noActiveOrdersHeader,
  noActiveOrdersCaption
}) => {
  const history = useHistory()
  const toast = useToast()

  const [values, setValues] = React.useState<Values>()
  const [orderToReturn, setOrderToReturn] = React.useState<Order>()
  const [productToReturn, setProductToReturn] = React.useState<Maybe<Product> | undefined>()
  const [currentPage, setCurrentPage] = React.useState<string>('past')
  const [currentAction, setCurrentAction] = React.useState<string>('')
  const [currentReason, setCurrentReason] = React.useState<string>('')
  const [selectedOrderToReturn, setSelectedOrderToReturn] = React.useState<boolean>()

  const cancelStyles = {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.colors.blueText
  }
  const pastOrderPage = currentPage === 'past'
  const activeOrderPage = currentPage === 'active'

  const handleOrderHistoryClicked = () => {
    history.push('/orders')
  }
  const handleOrderClicked = (id: string | null | undefined) => {
    const theOrder = pastOrders?.filter((order) => order?.orderNumber === id)[0]
    const formValues = {
      ...values,
      returnOrderId: theOrder?.orderNumber
    }
    setValues(formValues)
    setOrderToReturn(theOrder)
    setSelectedOrderToReturn(true)
  }

  const goBackToOrders = () => {
    setSelectedOrderToReturn(false)
  }

  const refundableProducts = orderToReturn?.items?.filter((order) => order?.product?.isRefundable)
  const nonRefundableProducts = orderToReturn?.items?.filter(
    (order) => !order?.product?.isRefundable
  )

  const isNonRefundableEmpty = nonRefundableProducts?.length

  const message = `Hi TradeFed, I would like to request a return of ${productToReturn?.name} from Order# ${orderToReturn?.orderNumber}. I have indicated my reason and preferred action. Looking forward to hearing from you. Thanks in advance!`
  const returnComment = (orderToReturn && productToReturn && message) ?? ''

  const handleReasonChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.persist()
    const rsn = event?.target?.value
    setCurrentReason(rsn)
  }

  const handleActionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.persist()
    const actn = event?.target?.value
    setCurrentAction(actn)
  }

  const [requestForReturn, { loading: returnLoading }] = useRequestForReturnMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: ({ placeItemReturnRequest }) => {
      const msg = placeItemReturnRequest?.payload as string
      toast({ description: msg, ...SUCCESS_TOAST })
      setTimeout(() => {
        history.push('/orders')
      }, 1000)
    }
  })

  return (
    <PageWrap title="Order Returns" alignSelf="center">
      <Grid
        pt={3}
        pl={5}
        pr={3}
        width="76vw"
        borderRadius={5}
        background={theme.colors.accent[50]}
        boxShadow={theme.boxShadowMedium}
      >
        <Grid gridTemplateRows="20px 20px">
          <Flex justify="space-between">
            <H3 textAlign="left" fontSize={18} fontWeight={600}>
              Return an Order
            </H3>
            <Text onClick={handleOrderHistoryClicked} fontSize={14} style={cancelStyles}>
              Order History
            </Text>
          </Flex>
        </Grid>
      </Grid>
      <Grid mt={5} gridTemplateColumns="400px 693px">
        <Flex
          p={4}
          mr={5}
          borderRadius={5}
          background={theme.colors.accent[50]}
          boxShadow={theme.boxShadowMedium}
        >
          <Flex flexDirection="column" width="100%">
            <Flex justify="space-between" mb={5}>
              <Button
                width="40%"
                variantColor="brand"
                fontSize={12}
                height="25px"
                userSelect="none"
                onClick={() => setCurrentPage('past')}
                border={!pastOrderPage ? `1px solid ${theme.colors.brand[500]}` : ''}
                background={!pastOrderPage ? 'white' : ''}
                color={!pastOrderPage ? `${theme.colors.brand[500]}` : 'white'}
              >
                PAST
              </Button>
              <Button
                width="40%"
                variantColor="brand"
                fontSize={12}
                height="25px"
                userSelect="none"
                onClick={() => setCurrentPage('active')}
                border={pastOrderPage ? `1px solid ${theme.colors.brand[500]}` : ''}
                background={pastOrderPage ? 'white' : ''}
                color={pastOrderPage ? `${theme.colors.brand[500]}` : 'white'}
              >
                ACTIVE
              </Button>
            </Flex>
            <Formik
              initialValues={{}}
              onSubmit={async (items, { setStatus, setSubmitting }) => {
                const input = {
                  input: {
                    action: String(currentAction),
                    reason: String(currentReason),
                    product: productToReturn?.id as string,
                    comment: returnComment,
                    orderNumber: orderToReturn?.orderNumber as string
                  }
                }
                setStatus(null)
                try {
                  setSubmitting(true)
                  requestForReturn({
                    variables: input
                  })
                  setSubmitting(false)
                } catch (error) {
                  setStatus(formatError(error))
                }
              }}
            >
              {({ isSubmitting, status }) => (
                <Form style={{ width: '100%' }}>
                  <ConnectedFormGroup
                    type="text"
                    label="Order ID*"
                    name="returnOrderId"
                    placeholder="Eg. TFSA-aw3erdfsd"
                    value={`${orderToReturn?.orderNumber || ''}`}
                  />
                  <ConnectedFormGroup
                    type="text"
                    label="Product Name"
                    name="returnProductName"
                    placeholder="Eg. Ngala Lamp Stand"
                    value={`${productToReturn ? `${productToReturn?.name}` : ''}`}
                  />
                  <ConnectedSelect
                    options={reasons}
                    onChange={handleReasonChanged}
                    name="returnReason"
                    label="Why would like to return the order?* "
                    placeholder="Select reason for return"
                  />
                  <ConnectedSelect
                    options={actions}
                    onChange={handleActionChanged}
                    name="returnAction"
                    label="What would you like to be done?* "
                    placeholder="Select preferred action to be taken"
                  />
                  <ConnectedTextArea
                    minHeight={`180px`}
                    name="returnComment"
                    value={returnComment}
                    handleSetTags={() => {}}
                    label="Comment(Optional)"
                    placeholder="Comments (Any additional information)"
                  />
                  <Button
                    mt={4}
                    width="100%"
                    type="submit"
                    variantColor="brand"
                    isLoading={returnLoading}
                  >
                    RETURN
                  </Button>
                </Form>
              )}
            </Formik>
          </Flex>
        </Flex>
        <Flex
          p={4}
          mr={5}
          borderRadius={5}
          background={theme.colors.accent[50]}
          boxShadow={theme.boxShadowMedium}
          width="100%"
          justify="space-between"
          flexDirection="column"
        >
          {activeOrderPage && activeOrders?.length ? (
            <Flex flexDirection="column">
              <Text fontWeight={600} fontSize={14}>
                {`All Active Orders (${activeOrders ? activeOrders?.length : ''}`})
              </Text>
              <Flex flexDirection="column" width={`100%`}>
                <Grid mt={3}>
                  <Flex
                    justify="space-between"
                    mb={3}
                    borderBottom={`1px dashed ${theme.colors.background}`}
                    pb={3}
                  >
                    <Text fontWeight={600}>Order#</Text>
                    <Text fontWeight={600}>Delivery Date</Text>
                    <Text fontWeight={600}>Delivered To</Text>
                  </Flex>
                  {fetchingOrders && <Spinner margin="auto" />}
                  {activeOrders?.map((order: Order, index: number) => (
                    <Flex
                      borderBottom={`1px dashed ${theme.colors.background}`}
                      textAlign="left"
                      key={`${index}_order_item`}
                      justify="space-between"
                      py={4}
                    >
                      <Text fontSize={12}>{order?.orderNumber}</Text>
                      <Text fontSize={12}>{dayjs(order?.deliveryDate).fromNow()}</Text>
                      <Text fontSize={12}>{order?.deliveryAddress?.name || 'Home'}</Text>
                    </Flex>
                  ))}
                </Grid>
              </Flex>
            </Flex>
          ) : (
            activeOrderPage &&
            !activeOrders?.length && (
              <NoData header={noActiveOrdersHeader} caption={noActiveOrdersCaption} />
            )
          )}
          {pastOrderPage && pastOrders?.length ? (
            <Flex flexDirection="column">
              {selectedOrderToReturn ? (
                <React.Fragment>
                  <Flex cursor="pointer" onClick={goBackToOrders}>
                    <ArrowLeft />
                    <Text fontWeight={600} fontSize={14} ml={3}>
                      {`Back to Orders`}
                    </Text>
                  </Flex>
                  <Flex p={3} mt={2} flexDirection="column">
                    <Text fontWeight={600} fontSize={14}>
                      {`Order# ${orderToReturn?.orderNumber}`}
                    </Text>
                    <Flex
                      pb={5}
                      borderBottom={`${isNonRefundableEmpty ? '1px dashed #acacac' : ''}`}
                      flexDirection="column"
                      maxHeight="250px"
                      overflowY="scroll"
                    >
                      {refundableProducts?.map((item, index) => {
                        return (
                          <OrderReturnProduct
                            refundable
                            product={item?.product}
                            key={`${index}_order_product`}
                            orderDate={orderToReturn?.created_at}
                            productToReturn={productToReturn?.id}
                            setProductToReturn={setProductToReturn}
                          />
                        )
                      })}
                    </Flex>
                    {isNonRefundableEmpty ? (
                      <Flex flexDirection="column" mt={2}>
                        <Flex>
                          <Tag
                            fontSize={12}
                            mt={3}
                            size="sm"
                            justifySelf="start"
                            background={theme.colors.tag}
                            color={theme.colors.tagText}
                          >
                            NON-REFUNDABLE ITEMS
                          </Tag>
                        </Flex>
                        <Flex mt={3}>
                          {nonRefundableProducts?.map((item, index) => {
                            return (
                              <OrderReturnProduct
                                key={`${index}_order_product_non`}
                                product={item?.product}
                                refundable={false}
                                orderDate={orderToReturn?.created_at}
                              />
                            )
                          })}
                        </Flex>
                      </Flex>
                    ) : null}
                  </Flex>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Text fontWeight={600} fontSize={14}>
                    {`All Past Orders (${pastOrders ? pastOrders?.length : ''}`})
                  </Text>
                  <Flex flexDirection="column">
                    <Grid mt={3} p={4}>
                      <Flex
                        justify="space-between"
                        mb={3}
                        borderBottom={`1px dashed ${theme.colors.background}`}
                        pb={3}
                      >
                        <Text fontWeight={600}>Order#</Text>
                        <Text fontWeight={600}>Delivery Date</Text>
                        <Text fontWeight={600}>Delivered To</Text>
                      </Flex>
                      {fetchingOrders && <Spinner margin="auto" />}
                      {pastOrders?.map((order: Order, index: number) => (
                        <Flex
                          borderBottom={`1px dashed ${theme.colors.background}`}
                          textAlign="left"
                          key={`${index}_order_item`}
                          justify="space-between"
                          py={4}
                        >
                          <Flex style={{ textDecoration: 'underline' }} cursor="pointer">
                            <Text
                              fontSize={12}
                              onClick={() => handleOrderClicked(order?.orderNumber)}
                            >
                              {order?.orderNumber}
                            </Text>
                          </Flex>
                          <Text fontSize={12}>{dayjs(order?.deliveryDate).fromNow()}</Text>
                          <Text fontSize={12}>{order?.deliveryAddress?.name}</Text>
                        </Flex>
                      ))}
                    </Grid>
                  </Flex>
                </React.Fragment>
              )}
            </Flex>
          ) : (
            pastOrderPage &&
            !pastOrders?.length && (
              <NoData header={noPastOrdersHeader} caption={noPastOrdersCaption} />
            )
          )}
        </Flex>
      </Grid>
    </PageWrap>
  )
}

export default OrderReturns
