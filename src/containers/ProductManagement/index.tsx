import * as React from 'react'

import { DateRangePicker } from 'react-dates'
import { useMediaQuery } from 'react-responsive'
import { ChevronRight, Clock } from 'react-feather'
import { Flex, Grid, Image, Tag } from '@chakra-ui/core'

import CardFooter from '../../components/Card/CardFooter'
import ProductManagementCard from '../../components/Card/ProductMangementCard'

import { Text } from '../../typography'
import { PageWrap } from '../../layouts'
import { theme, images } from '../../theme'
import { TOTAL_UNITS_SOLD, ACTIVE_PRODUCT_PROGRESS } from '../../constants'

const OlderActiveProduct = () => {
  return (
    <Flex
      borderRadius={5}
      p={3}
      mt={3}
      flexDirection="column"
      border={`1px solid ${theme.colors.background}`}
    >
      <Flex justify="space-between" alignItems="center">
        <Text fontWeight={600}>BMW</Text>
        <Text fontWeight={600}>R 200.00</Text>
        <Flex>
          <Flex mr={3} p={2} background={theme.colors.background} borderRadius={3}>
            <Clock />
            <Text ml={3}>12/09/21</Text>
          </Flex>
          <ChevronRight />
        </Flex>
      </Flex>
    </Flex>
  )
}
const ActiveProduct = () => {
  const sold = 9

  const slowMover = sold <= 10
  const mover = sold > 10 && sold <= 49
  const averageMover = sold > 49 && sold <= 70
  const fastMove = sold > 70

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
        <Flex width="50%" position="relative" onClick={() => {}}>
          <Image
            width="100%"
            height="100%"
            src={'http://localhost:1337/uploads/yuvraj_singh_Rjj_Emr24h_M_unsplash_f91dc39bca.jpg'}
            borderTopLeftRadius={3}
            borderBottomLeftRadius={3}
          />
          {true ? (
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
              <Text color="white" fontSize="14px">
                Save
              </Text>
              <Text color="white" fontSize="14px" fontWeight={600}>
                {`${20}%`}
              </Text>
            </Flex>
          ) : null}
        </Flex>
        <CardFooter paddingLeft={2} width={`100%`} bg="white" height="100%" justifyContent="center">
          <Flex justify="space-between" width={`100%`}>
            <Text onClick={() => {}} my={2} fontSize="14px" fontWeight={600}>
              {`BWM`}
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
                12/09/21 (2 days ago)
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
              <Text mr={3} color={theme.colors.blueText} fontSize={`12px`} fontWeight={550}>
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
  const isWebViewport = useMediaQuery({
    query: '(min-width: 40em)'
  })
  const hasOlderActiveProducts = true
  const hasData = true

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
                      <ActiveProduct />
                      <ActiveProduct />
                      <ActiveProduct />
                      <ActiveProduct />
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
                      <OlderActiveProduct />
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
        <Flex flexDirection="column">
          {productManagementItems.map((item, key) => (
            <ProductManagementCard key={key} caption={item.caption} title={item.title} />
          ))}
          {hasOlderActiveProducts && (
            <Flex
              mt={5}
              pl={5}
              height="50px"
              borderRadius="10px"
              boxShadow="0 2px 4px 0 rgba(0,0,0,0.25)"
              justify="space-between"
              alignItems="center"
              onClick={() => console.log('TODO: Handle Older Products')}
              backgroundColor="white"
            >
              <Flex width="100%" ml={3}>
                <Text fontSize={12}>View Older Products</Text>
              </Flex>
              <ChevronRight />
            </Flex>
          )}
        </Flex>
      )}
    </PageWrap>
  )
}

export default ProductManagement
