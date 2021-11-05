import * as React from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { get } from 'lodash'
import { useHistory } from 'react-router'
import { ApolloError } from 'apollo-boost'
import { DateRangePicker } from 'react-dates'
import { useMediaQuery } from 'react-responsive'
import { Flex, Grid, Image, Tag, useToast } from '@chakra-ui/core'
import { ChevronRight, Clock, ArrowLeft } from 'react-feather'

import CardFooter from '../../components/Card/CardFooter'
import ProductManagementCard from '../../components/Card/ProductMangementCard'

import { Text } from '../../typography'
import { PageWrap } from '../../layouts'
import { theme, images } from '../../theme'
import { useFindActiveProductsQuery, Product } from '../../generated/graphql'
import { TOTAL_UNITS_SOLD, ACTIVE_PRODUCT_PROGRESS, ERROR_TOAST } from '../../constants'

dayjs.extend(relativeTime)

type OlderActiveProductProps = {
  product: Product
}

const OlderActiveProduct: React.FC<OlderActiveProductProps> = ({ product }) => {
  return (
    <Flex
      borderRadius={5}
      p={3}
      mt={3}
      flexDirection="column"
      border={`1px solid ${theme.colors.background}`}
    >
      <Flex alignItems="center">
        <Flex width={`100%`}>
          <Text fontWeight={600}>{product?.name}</Text>
        </Flex>
        <Flex width={`100%`} justifySelf="end">
          <Text fontWeight={600}>
            {`${product?.currency} ${product?.tradeFedCost
              ?.toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
          </Text>
        </Flex>
        <Flex>
          <Flex mr={3} p={2} background={theme.colors.background} borderRadius={3}>
            <Clock />
            <Text ml={3}>{`${dayjs(product?.created_at).format('DD/MM/YYYY')}`}</Text>
          </Flex>
          <ChevronRight />
        </Flex>
      </Flex>
    </Flex>
  )
}
type ActiveProductProps = {
  product: Product
  sold: number
  totalUnitsSold: number
  remainingUnits: number
}
const ActiveProduct: React.FC<ActiveProductProps> = ({
  product,
  sold,
  totalUnitsSold,
  remainingUnits
}) => {
  const history = useHistory()

  const slowMover = sold <= 10
  const mover = sold > 10 && sold <= 49
  const averageMover = sold > 49 && sold <= 70
  const fastMove = sold > 70
  const maxSellCost = get(product, 'maxSellCost') as number
  const tradeFedCost = get(product, 'tradeFedCost') as number

  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  const tagColors = slowMover
    ? {
        background: theme.colors.background,
        color: ''
      }
    : mover
    ? {
        background: '#B6DAF5',
        color: theme.colors.tagText
      }
    : averageMover
    ? {
        background: '#f0943d',
        color: theme.colors.accent[50]
      }
    : fastMove
    ? {
        background: theme.colors.greenFill,
        color: theme.colors.accent[50]
      }
    : {
        background: '',
        color: ''
      }

  const viewMoreActiveProductStats = (id: string) => {
    history.push(`/product-analysis/${id}`)
  }

  return (
    <Flex
      mt={3}
      width={'100%'}
      justifyContent="space-between"
      alignItems="center"
      position="relative"
    >
      <Flex
        border={`1px solid ${theme.colors.background}`}
        borderRadius={3}
        width="100%"
        height="150px"
        flexDirection="row"
      >
        <Flex width="50%" position="relative">
          <Image
            width="100%"
            height="100%"
            src={product?.coverImage?.url || ''}
            borderTopLeftRadius={3}
            borderBottomLeftRadius={3}
          />
          {discount ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              width="50px"
              height="50px"
              position="absolute"
              bg="accent.700"
              flexDirection="column"
              top={0}
              right={0}
            >
              <Text color="white" fontWeight={600} fontSize="14px">
                Save
              </Text>
              <Text color="white" fontSize="14px" fontWeight={600}>
                {`${discount}%`}
              </Text>
            </Flex>
          ) : null}
        </Flex>
        <CardFooter paddingLeft={2} width={`100%`} bg="white" height="100%" justifyContent="center">
          <Flex justify="space-between" width={`100%`}>
            <Text my={2} fontSize="14px" fontWeight={600}>
              {product?.name}
            </Text>
            <Tag
              height="40%"
              justifySelf="end"
              fontSize={11}
              mr={2}
              mt={2}
              p={3}
              size="sm"
              background={tagColors?.background}
              color={tagColors?.color}
            >
              {`${sold >= 100 ? `Sold Out` : `${sold}% Sold`}`}
            </Tag>
          </Flex>
          <Flex width={`100%`} flexDirection="column">
            <Flex alignItems="center" height="20px">
              <Text fontSize={`12px`} fontWeight={550}>
                Listed On:{' '}
              </Text>
              <Text fontSize={`12px`} ml={2}>
                {`${dayjs(product?.created_at).format('DD/MM/YYYY')} (${dayjs(
                  product?.created_at
                ).fromNow()})`}
              </Text>
            </Flex>
            <Flex alignItems="center" height="20px">
              <Text fontSize={`12px`} fontWeight={550}>
                Units Sold:{' '}
              </Text>
              <Text fontSize={`12px`} ml={2}>
                {`${totalUnitsSold}`}
              </Text>
            </Flex>
            <Flex alignItems="center" height="20px">
              <Text fontSize={`12px`} fontWeight={550}>
                Units Left:{' '}
              </Text>
              <Text fontSize={`12px`} ml={2}>
                {`${remainingUnits}`}
              </Text>
            </Flex>
            <Flex
              mt={2}
              justify="space-between"
              alignItems="center"
              justifySelf="end"
              height="20px"
              cursor="pointer"
            >
              <Text fontSize={`12px`} fontWeight={550}>
                {`${product?.currency} ${product?.tradeFedCost
                  ?.toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              </Text>
              <Text
                mr={3}
                color={theme.colors.blueText}
                fontSize={`12px`}
                fontWeight={550}
                onClick={() => viewMoreActiveProductStats(product?.id)}
              >
                View More
              </Text>
            </Flex>
          </Flex>
        </CardFooter>
      </Flex>
    </Flex>
  )
}

const productManagementItems = [
  {
    title: TOTAL_UNITS_SOLD,
    caption: 'No data available yet.'
  },
  {
    title: ACTIVE_PRODUCT_PROGRESS,
    caption: 'No data available yet.'
  }
]

type ProductManagementProps = {}

const ProductManagement: React.FC<ProductManagementProps> = () => {
  const toast = useToast()
  const [showOlderActiveProducts, setShowOlderActiveProducts] = React.useState<boolean>()
  const [activeProductsChartData, setActiveProductsChartData] = React.useState<string>('{}')
  const [oldActiveProductsChartData, setOldActiveProductsChartData] = React.useState<string>('{}')

  const isWebViewport = useMediaQuery({
    query: '(min-width: 40em)'
  })
  const hasOlderActiveProducts = true
  const hasActiveProducts = true
  const hasData = true

  const handleBackToProductManagement = () => {
    setShowOlderActiveProducts(false)
  }

  const { data: activeProductsData } = useFindActiveProductsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })
  const { data: oldActiveProductsData } = useFindActiveProductsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    variables: { old: true }
  })

  React.useEffect(() => {
    const activeProductsResponse = activeProductsData?.findActiveProducts?.payload
    if (activeProductsResponse) {
      setActiveProductsChartData(activeProductsResponse)
    }
  }, [activeProductsData, setActiveProductsChartData])
  React.useEffect(() => {
    const oldActiveProductsResponse = oldActiveProductsData?.findActiveProducts?.payload
    if (oldActiveProductsResponse) {
      setOldActiveProductsChartData(oldActiveProductsResponse)
    }
  }, [oldActiveProductsData, setOldActiveProductsChartData])

  const activeProducts = JSON.parse(activeProductsChartData)
  const activeItems = Object.keys(activeProducts)
    .map((row) => {
      const item = activeProducts[row]
      return item
    })
    .reverse()
  const oldActiveProducts = JSON.parse(oldActiveProductsChartData)
  const oldActiveItems = Object.keys(oldActiveProducts)
    .map((row) => {
      const item = oldActiveProducts[row]
      return item
    })
    .reverse()

  return (
    <PageWrap alignItems={isWebViewport ? '' : 'center'} title="Product Management">
      {isWebViewport ? (
        <Flex>
          <Grid gridTemplateColumns={`1fr 1fr`} width={`100%`} gap="25px">
            {productManagementItems.map((item, key) => (
              <ProductManagementCard key={key} caption={item.caption} title={item.title} />
            ))}
            <Flex
              flexDirection="column"
              bg="white"
              boxShadow={theme.boxShadowLight}
              borderRadius="8px"
              my={2}
            >
              <Flex justify="space-between">
                <Text m="15px" fontWeight={600} fontSize="14px">
                  Active Products
                </Text>
              </Flex>
              <Flex width="100%" flexDirection="column">
                {hasData ? (
                  <Flex mx={4} flexDirection="column">
                    <Flex flexDirection="column" height={`250px`} overflowY={`scroll`}>
                      {activeItems?.map((item, index) => (
                        <ActiveProduct
                          key={`${index}_item`}
                          sold={item.soldUnits}
                          totalUnitsSold={item.count}
                          remainingUnits={item.remainingUnits}
                          product={item.product}
                        />
                      ))}
                    </Flex>
                  </Flex>
                ) : (
                  <React.Fragment>
                    <Image width="70px" height="auto" src={images.filesIcon} />
                    <Text fontSize="12px">No Active Product History</Text>
                  </React.Fragment>
                )}
              </Flex>
            </Flex>
            <Flex
              flexDirection="column"
              bg="white"
              boxShadow={theme.boxShadowLight}
              borderRadius="8px"
              my={2}
            >
              <Flex justify="space-between">
                <Text m="15px" fontWeight={600} fontSize="14px">
                  Older Active Products
                </Text>
                <Flex>
                  <Text mt={3} mr={2}>
                    Select Date Range:
                  </Text>
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
              </Flex>
              <Flex width="100%" flexDirection="column">
                {hasData ? (
                  <Flex mx={4} flexDirection="column">
                    <Flex flexDirection="column" height={`250px`} overflowY={`scroll`}>
                      {oldActiveItems?.map((item, index) => (
                        <OlderActiveProduct key={`${index}_item`} product={item.product} />
                      ))}
                    </Flex>
                  </Flex>
                ) : (
                  <React.Fragment>
                    <Image width="70px" height="auto" src={images.filesIcon} />
                    <Text fontSize="12px">No Active Product History</Text>
                  </React.Fragment>
                )}
              </Flex>
            </Flex>
          </Grid>
        </Flex>
      ) : (
        <Flex flexDirection="column" width={`100%`} justify="center">
          {showOlderActiveProducts ? (
            <Flex flexDirection="column">
              <Flex cursor="pointer" onClick={handleBackToProductManagement}>
                <ArrowLeft />
                <Flex ml={3}>Product Management</Flex>
              </Flex>
              <Flex flexDirection="column">
                <Text mt={3} mr={2} fontSize={12}>
                  Select Date Range:
                </Text>
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
              <Flex
                mt={3}
                flexDirection="column"
                boxShadow={theme.boxShadowMedium}
                borderRadius={5}
                background={theme.colors.accent[50]}
                width={`100%`}
                p={3}
              >
                <Flex width={`100%`} flexDirection="column">
                  {oldActiveItems?.map((item, index) => (
                    <OlderActiveProduct key={`${index}_item`} product={item.product} />
                  ))}
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <React.Fragment>
              {productManagementItems.map((item, key) => (
                <ProductManagementCard key={key} caption={item.caption} title={item.title} />
              ))}
              {hasActiveProducts && (
                <Flex
                  background={theme.colors.accent[50]}
                  borderRadius={5}
                  boxShadow={theme.boxShadowLight}
                  mt={4}
                  p={4}
                  flexDirection="column"
                >
                  <Text fontWeight={600} fontSize="14px">
                    Active Products
                  </Text>
                  <Flex flexDirection="column" height={`250px`} overflowY={`scroll`}>
                    {activeItems?.map((item, index) => (
                      <ActiveProduct
                        key={`${index}_item`}
                        sold={item.soldUnits}
                        totalUnitsSold={item.count}
                        remainingUnits={item.remainingUnits}
                        product={item.product}
                      />
                    ))}
                  </Flex>
                </Flex>
              )}
              {hasOlderActiveProducts && (
                <Flex
                  mt={5}
                  pl={5}
                  height="50px"
                  borderRadius="10px"
                  boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
                  justify="space-between"
                  alignItems="center"
                  onClick={() => setShowOlderActiveProducts(true)}
                  backgroundColor="white"
                >
                  <Flex width="100%" ml={3}>
                    <Text fontSize={12}>View Older Products</Text>
                  </Flex>
                  <ChevronRight />
                </Flex>
              )}
            </React.Fragment>
          )}
        </Flex>
      )}
    </PageWrap>
  )
}

export default ProductManagement
