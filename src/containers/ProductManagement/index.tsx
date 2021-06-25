import * as React from 'react'

import { Flex, Grid, Image } from '@chakra-ui/core'
import { ChevronRight } from 'react-feather'
import { useMediaQuery } from 'react-responsive'

import ProductManagementCard from '../../components/Card/ProductMangementCard'

import { theme, images } from '../../theme'
import { PageWrap } from '../../layouts'
import { Text } from '../../typography'
import { TOTAL_UNITS_SOLD, ACTIVE_PRODUCT_PROGRESS, ACTIVE_PRODUCTS } from '../../constants'

const productManagementItems = [
  {
    title: TOTAL_UNITS_SOLD,
    caption: 'No data available yet.'
  },
  {
    title: ACTIVE_PRODUCT_PROGRESS,
    caption: 'No data available yet.'
  },
  {
    title: ACTIVE_PRODUCTS,
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
              <Text m="15px" fontWeight={600} fontSize="14px">
                Older Active Products
              </Text>
              <Flex width="100%" flexDirection="column" alignItems="center" margin="auto">
                {hasData ? (
                  <React.Fragment>Older Active Products</React.Fragment>
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
