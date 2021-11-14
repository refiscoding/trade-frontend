import * as React from 'react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { get } from 'lodash'
import { ApolloError } from 'apollo-boost'
import { ArrowLeft, Clock } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { useHistory, useParams } from 'react-router-dom'
import { Flex, Image, Text, useToast, Spinner } from '@chakra-ui/core'

import { theme } from '../../theme'
import { PageWrap } from '../../layouts'
import { ERROR_TOAST } from '../../constants'
import { TotalUnits } from '../../components/Card/ProductMangementCard/charts'
import {
  useFindActiveProductsQuery,
  useFindProductTotalUnitsSoldPerMonthQuery
} from '../../generated/graphql'

dayjs.extend(relativeTime)

type ProductManagementAnalysisProps = {}
type ParamType = {
  id: string
}

const ProductManagementAnalysis: React.FC<ProductManagementAnalysisProps> = () => {
  const params: ParamType = useParams()

  const toast = useToast()
  const history = useHistory()

  const isWebViewport = useMediaQuery({
    query: '(min-width: 40em)'
  })

  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })

  const positionRight = isTinyPhone ? '6rem' : isSmallPhone ? '3rem' : '2rem'

  const handleBackToProductManagement = () => {
    history.push('/product-management')
  }

  const { loading, data } = useFindProductTotalUnitsSoldPerMonthQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    variables: {
      id: params.id
    }
  })

  const { data: activeProductsData } = useFindActiveProductsQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const chartData = data?.findProductTotalUnitsSoldPerMonth?.payload
  const productData = activeProductsData?.findActiveProducts?.payload
  const productItem = chartData?.product
  const productStats = chartData?.stats ?? '{}'
  const productDataStats = productData ?? '{}'
  const stats = JSON.parse(productDataStats)[`${params.id}`]
  const sold = stats && stats['soldUnits']
  const remaining = stats && stats['remainingUnits']
  const count = stats && stats['count']
  const productImages = productItem?.productImages?.map((image) => image?.url)
  const productCover = productItem?.coverImage?.url
  const productImagesCount = productImages?.length
  const imageHeight = productImagesCount === 1 ? '40%' : productImagesCount === 2 ? '60%' : '100%'
  const maxSellCost = get(productItem, 'maxSellCost') as number
  const tradeFedCost = get(productItem, 'tradeFedCost') as number
  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  const slowtradeFed = sold <= 10
  const tradeFed = sold > 10 && sold <= 49
  const averagetradeFed = sold > 49 && sold <= 70
  const fastMove = sold > 70

  const textColor = slowtradeFed
    ? theme.colors.background
    : tradeFed
    ? theme.colors.tagText
    : averagetradeFed
    ? '#f0943d'
    : fastMove
    ? theme.colors.greenFill
    : ''

  return (
    <PageWrap
      alignItems={isWebViewport ? '' : 'center'}
      title="Product"
      bg={theme.colors.background}
    >
      {isWebViewport ? (
        <Flex flexDirection="column">
          <Flex
            mb={3}
            backgroundColor="white"
            borderRadius={5}
            width="100%"
            height="450px"
            boxShadow={theme.boxShadowMedium}
          >
            <Flex width={`50%`}>
              <Flex width={`100%`}>
                <Image
                  borderTopLeftRadius={3}
                  borderBottomLeftRadius={3}
                  width="100%"
                  height="100%"
                  src={productCover || ''}
                />
              </Flex>
              <Flex ml={3} pb={3} width={`30%`} flexDirection="column">
                {productImages?.map((product: string | undefined) => (
                  <Image
                    key={product || `${Math.random()}`}
                    width="100%"
                    height={imageHeight}
                    objectFit="cover"
                    src={product || ''}
                    mt={3}
                  />
                ))}
              </Flex>
            </Flex>
            <Flex p={3} ml={3} width={`50%`} flexDirection="column">
              <Text fontSize="14px" fontWeight={600}>
                Total Units
              </Text>
              {loading ? <Spinner /> : <TotalUnits totalUnitsChartData={productStats} />}
            </Flex>
          </Flex>
          <Flex
            backgroundColor="white"
            borderRadius={5}
            p={4}
            width="100%"
            boxShadow={theme.boxShadowMedium}
            flexDirection="column"
          >
            <Flex width="100%" justify="space-between">
              <Flex width="100%">
                <Text fontSize={14} fontWeight={600}>
                  {`Product Details (${loading ? '' : productItem?.name})`}
                </Text>
              </Flex>
              {loading ? (
                <Spinner />
              ) : (
                <Flex ml={3} width="100%">
                  <Flex p={2} background={theme.colors.background} borderRadius={3}>
                    <Clock />
                    <Text ml={3}>{`${dayjs(productItem?.created_at).format('DD/MM/YYYY')}`}</Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
            <Flex mt={3} justify="space-between">
              <Flex width="100%">
                <Text fontSize={`11px`}>{`${loading ? '' : productItem?.description}`}</Text>
              </Flex>
              <Flex ml={3} justify="space-between" width="100%">
                <Flex width={`100%`} flexDirection="column">
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Sold:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2} color={textColor} fontWeight={600}>
                      {`${sold >= 100 ? `Sold Out` : `${sold}%`}`}
                    </Text>
                  </Flex>
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Listed On:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2}>{`${dayjs(
                      productItem?.created_at
                    ).fromNow()}`}</Text>
                  </Flex>
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Units Sold:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2}>
                      {`${count}`}
                    </Text>
                  </Flex>
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Units Left:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2}>
                      {`${remaining}`}
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
                      {`${productItem?.currency} ${productItem?.tradeFedCost
                        ?.toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                    </Text>
                    <Text
                      mr={3}
                      color={theme.colors.blueText}
                      fontSize={`12px`}
                      fontWeight={550}
                      cursor="pointer"
                      onClick={() => history.push(`/product/${productItem?.id}`)}
                    >
                      View
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex flexDirection="column" width={`100%`}>
          <Flex cursor="pointer" onClick={handleBackToProductManagement}>
            <ArrowLeft />
            <Flex ml={3}>Product Management</Flex>
          </Flex>
          <Flex mt={3} height="250px" width={`100%`} position="relative">
            <Image borderRadius={3} width="100%" height="100%" src={productCover || ''} />
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
                right={positionRight}
                borderBottomLeftRadius={2}
                borderBottomRightRadius={2}
              >
                <Text color="black" fontWeight={600} fontSize="14px">
                  Save
                </Text>
                <Text color="black" fontSize="14px" fontWeight={600}>
                  {`${discount}%`}
                </Text>
              </Flex>
            ) : null}
          </Flex>
          <Flex
            p={3}
            mt={3}
            flexDirection="column"
            boxShadow={theme.boxShadowMedium}
            borderRadius={3}
            background={theme.colors.accent[50]}
          >
            <Flex justify="space-between">
              <Text fontSize={14} fontWeight={600}>
                Product Details
              </Text>
              <Flex p={2} background={theme.colors.background} borderRadius={3}>
                <Clock />
                <Text ml={3}>{`${dayjs(productItem?.created_at).format('DD/MM/YYYY')}`}</Text>
              </Flex>
            </Flex>
            <Flex width={`100%`} flexDirection="column">
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Sold:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2} color={textColor}>
                  {`${sold >= 100 ? `Sold Out` : `${sold}%`}`}
                </Text>
              </Flex>
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Listed On:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2}>{`${dayjs(
                  productItem?.created_at
                ).fromNow()}`}</Text>
              </Flex>
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Units Sold:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2}>
                  {`${count}`}
                </Text>
              </Flex>
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Units Left:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2}>
                  {`${remaining}`}
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
                  {`${productItem?.currency} ${productItem?.tradeFedCost
                    ?.toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                </Text>
                <Text
                  mr={3}
                  color={theme.colors.blueText}
                  fontSize={`12px`}
                  fontWeight={550}
                  cursor="pointer"
                  onClick={() => history.push('/product/1')}
                >
                  View
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            p={3}
            mt={3}
            flexDirection="column"
            boxShadow={theme.boxShadowMedium}
            borderRadius={3}
            background={theme.colors.accent[50]}
          >
            <Flex mb={3}>
              <Text fontSize={14} fontWeight={600}>
                Total Units
              </Text>
            </Flex>
            <Flex>
              <TotalUnits totalUnitsChartData={productStats} />
            </Flex>
          </Flex>
        </Flex>
      )}
    </PageWrap>
  )
}

export default ProductManagementAnalysis
