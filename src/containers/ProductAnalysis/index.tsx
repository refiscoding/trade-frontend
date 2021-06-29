import * as React from 'react'

import { PageWrap } from '../../layouts'
import { useHistory } from 'react-router-dom'
import { ArrowLeft, Clock } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { Flex, Image, Text } from '@chakra-ui/core'

import { theme } from '../../theme'
import { TotalUnits } from '../../components/Card/ProductMangementCard/charts'

type ProductManagementAnalysisProps = {}

const ProductManagementAnalysis: React.FC<ProductManagementAnalysisProps> = () => {
  const history = useHistory()

  const isWebViewport = useMediaQuery({
    query: '(min-width: 40em)'
  })

  const maxSellCost = 3000
  const tradeFedCost = 2500
  const discount = Math.round(((maxSellCost - tradeFedCost) / maxSellCost) * 100)

  const isSmallPhone = useMediaQuery({ query: '(max-width: 25em)' })
  const isTinyPhone = useMediaQuery({ query: '(max-width: 20em)' })

  const positionRight = isTinyPhone ? '6rem' : isSmallPhone ? '3rem' : '2rem'

  const handleBackToProductManagement = () => {
    history.push('/product-management')
  }
  const images = [
    '/uploads/yuvraj_singh_Rjj_Emr24h_M_unsplash_f91dc39bca.jpg',
    '/uploads/yuvraj_singh_Rjj_Emr24h_M_unsplash_f91dc39bca.jpg',
    '/uploads/yuvraj_singh_Rjj_Emr24h_M_unsplash_f91dc39bca.jpg'
  ]
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
                  src={'/uploads/yuvraj_singh_Rjj_Emr24h_M_unsplash_f91dc39bca.jpg'}
                />
              </Flex>
              <Flex ml={3} pb={3} width={`30%`} flexDirection="column">
                {images?.map((product: string | undefined) => (
                  <Image
                    key={product || `${Math.random()}`}
                    width="100%"
                    height="100%"
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
              <TotalUnits totalUnitsChartData={'{}'} />
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
                  Product Details
                </Text>
              </Flex>
              <Flex width="100%">
                <Flex p={2} background={theme.colors.background} borderRadius={3}>
                  <Clock />
                  <Text ml={3}>12/09/21</Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex mt={3} justify="space-between">
              <Flex width="100%">Descriptipn</Flex>
              <Flex justify="space-between" width="100%">
                <Flex width={`100%`} flexDirection="column">
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Sold:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2}>
                      80%
                    </Text>
                  </Flex>
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Listed On:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2}>
                      2 days ago
                    </Text>
                  </Flex>
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Units Sold:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2}>
                      120
                    </Text>
                  </Flex>
                  <Flex alignItems="center" height="20px">
                    <Text fontSize={`12px`} fontWeight={550}>
                      Units Left:{' '}
                    </Text>
                    <Text fontSize={`12px`} ml={2}>
                      12
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
                      R 2000.00
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
            <Image
              borderRadius={3}
              width="100%"
              height="100%"
              src={'/uploads/yuvraj_singh_Rjj_Emr24h_M_unsplash_f91dc39bca.jpg'}
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
                right={positionRight}
                borderBottomLeftRadius={2}
                borderBottomRightRadius={2}
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
                <Text ml={3}>12/09/21</Text>
              </Flex>
            </Flex>
            <Flex width={`100%`} flexDirection="column">
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Sold:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2}>
                  80%
                </Text>
              </Flex>
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Listed On:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2}>
                  2 days ago
                </Text>
              </Flex>
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Units Sold:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2}>
                  120
                </Text>
              </Flex>
              <Flex alignItems="center" height="20px">
                <Text fontSize={`12px`} fontWeight={550}>
                  Units Left:{' '}
                </Text>
                <Text fontSize={`12px`} ml={2}>
                  12
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
                  R 2000.00
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
              <TotalUnits totalUnitsChartData={'{}'} />
            </Flex>
          </Flex>
        </Flex>
      )}
    </PageWrap>
  )
}

export default ProductManagementAnalysis
