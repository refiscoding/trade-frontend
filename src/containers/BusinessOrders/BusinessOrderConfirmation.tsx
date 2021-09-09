import * as React from 'react'
import { Button, Flex, Link, useToast } from '@chakra-ui/core'

import { H3, Text } from '../../typography'
import { PageWrap } from '../../layouts'
import { theme } from '../../theme'
import strapiHelpers from '../../utils/strapiHelpers'
import { SUCCESS_TOAST } from '../../constants/index'
// import { UsersPermissionsUser } from '../../generated/graphql'

type BusinessOrderConfirmationProps = {}

const BusinessOrderConfirmation: React.FC<BusinessOrderConfirmationProps> = () => {
  const toast = useToast()

  return (
    <PageWrap title="Order Confirmation" alignSelf="center" width="90%" mt={0} pt={0} p={0}>
      <H3 textAlign="left" fontSize={14} fontWeight={700}>
        Order Confirmation
      </H3>
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
            An Order Has Been Placed - Q3294871
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
              Order Number: TFSA000001-01
            </Text>
          </Flex>
          <Flex width="100%" pb={4}>
            <Text fontSize={12} fontWeight={700}>
              Origin:
            </Text>
            <Text fontSize={12} pl={2}>
              Menlo Park, 0081, Pretoria, South Africa
            </Text>
          </Flex>
          <Flex width="100%" pb={4}>
            <Text fontSize={12} fontWeight={700}>
              Date ordered:
            </Text>
            <Text fontSize={12} pl={2}>
              20 July 2021 at 14:37pm
            </Text>
          </Flex>
          <Flex width="100%" pb={4}>
            <Text fontSize={12} fontWeight={700}>
              Destination:
            </Text>
            <Text fontSize={12} pl={2}>
              23 Trade Street, Menlo Park, 0081, Pretoria, South Africa
            </Text>
          </Flex>
          <Flex width="100%" pb={4}>
            <Text fontSize={12} fontWeight={700}>
              Recipient Details:
            </Text>
            <Text fontSize={12} pl={2}>
              Name: Jack Theron
            </Text>
            <Text fontSize={12} pl={2}>
              Contact Number: 072 838 0502
            </Text>
          </Flex>
          <Flex width="100%" pb={4}>
            <Flex flexDirection="row">
              <Text fontSize={12} fontWeight={700}>
                Order Specifics (1):
              </Text>
              <Flex flexDirection="column" pl={2}>
                <Flex>
                  <Text fontSize={12} fontWeight={700}>
                    Product SKU:
                  </Text>
                  <Text fontSize={12} pl={2}>
                    2343223456543
                  </Text>
                </Flex>
                <Flex>
                  <Text fontSize={12} fontWeight={700}>
                    Quantity:
                  </Text>
                  <Text fontSize={12} pl={2}>
                    2
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex width="100%" pb={4} flexDirection="row">
            <Text fontSize={12} fontWeight={700}>
              Dimensions:
            </Text>
            <Flex pl={2} flexDirection="column">
              <Flex flexDirection="row">
                <Text fontSize={12} fontWeight={700}>
                  Height:
                </Text>
                <Text fontSize={12} pl={2}>
                  23cm
                </Text>
              </Flex>
              <Flex flexDirection="row">
                <Text fontSize={12} fontWeight={700}>
                  Width:
                </Text>
                <Text fontSize={12} pl={2}>
                  225cm
                </Text>
              </Flex>
              <Flex flexDirection="row">
                <Text fontSize={12} fontWeight={700}>
                  Length:
                </Text>
                <Text fontSize={12} pl={2}>
                  290cm
                </Text>
              </Flex>
              <Flex flexDirection="row">
                <Text fontSize={12} fontWeight={700}>
                  Weight:
                </Text>
                <Text fontSize={12} pl={2}>
                  19kg
                </Text>
              </Flex>
            </Flex>
          </Flex>
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
                return strapiHelpers.sendOrderConfirmationEmail()
              }}
            >
              <Text fontSize="12px">CONFIRM AVAILABILITY</Text>
            </Button>
          </Flex>
          <Flex flexDirection="column" mt={3} width="100%" alignItems="center">
            <Text fontSize={12} fontWeight={700}>
              <Link href="#" cursor="pointer" borderBottom={`1px solid ${theme.colors.brand[500]}`}>
                Unfortunately not available
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </PageWrap>
  )
}

export default BusinessOrderConfirmation
