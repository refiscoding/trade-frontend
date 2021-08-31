import * as React from 'react'
import { ApolloError } from 'apollo-boost'

import { get } from 'lodash'
import { Flex, FlexProps, Grid, Image, useToast } from '@chakra-ui/core'
import { useBarcode } from 'react-barcodes'

import { images, theme } from '../../theme'
import { H3, Text } from '../../typography'
import { useFetchLabelQuery } from '../../generated/graphql'
import { ERROR_TOAST } from '../../constants'

type PrintLabelComponentProps = FlexProps & {}

const PrintLabelComponent: React.FC<PrintLabelComponentProps> = () => {
  const toast = useToast()

  const { data } = useFetchLabelQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    variables: { waybill: 'collection0008' }
  })
  const labelData = get(data, 'getLabel')
  const label = labelData?.ResultSets?.[0]?.[0]
  const { inputRef } = useBarcode({
    value: 'react-barcodes',
    options: {
      displayValue: false,
      background: 'white'
    }
  })

  return (
    <Flex
      flexDirection="column"
      p={4}
      margin="2rem"
      width="545.05px"
      height="450.12px"
      borderRadius="4px"
      background={theme.colors.accent[50]}
      border={`4px solid ${theme.colors.brand[500]}`}
    >
      <Flex height="150px" borderBottom="1px solid #231F20" flexDirection="row" p={2}>
        <Flex
          borderRight="1px solid #231F20"
          flexDirection="column"
          style={{ placeItems: 'center' }}
          justifyContent="center"
          width="150px"
        >
          <Image width="40%" height="auto" src={images.TradeFedLogo} />
          <Text fontSize="23px" fontWeight={400} color="#16385a" mt={2}>
            TradeFed
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="column" width="150px" pt={2} pb={2} pl={4} pr={2}>
            <H3 fontSize="12px" fontWeight={700} mb={1}>
              From :
            </H3>
            <Flex flexDirection="column">
              <Text fontSize="12px" fontWeight={400}>
                {label?.ShipName || '-'}
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                {label?.ShipTel === null ? '-' : label?.ShipTel}
              </Text>
            </Flex>
            <Flex flexDirection="column" mt={3}>
              <Text fontSize="12px" fontWeight={400}>
                {label?.ShipAddr1 || '-'}
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                {label?.ShipAddr2 || '-'}
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                {label?.ShipAddr3 || '-'}
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                {label?.ShipAddr4 || '-'}
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" width="150px" pt={2} pb={2} pl={4} pr={2}>
            <H3 fontSize="12px" fontWeight={700} mb={1}>
              To :
            </H3>
            <Flex flexDirection="column">
              <Text fontSize="12px" fontWeight={400}>
                {label?.RecName || '-'}
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                {label?.RecTel || '-'}
              </Text>
            </Flex>
            <Flex flexDirection="column" mt={3}>
              <Text fontSize="12px" fontWeight={400}>
                {label?.RecAddr1 || '-'}
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                {label?.RecAddr2 || '-'}
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                {label?.RecAddr3 || '-'}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex height="170px" borderBottom="1px solid #231F20" flexDirection="row" p={2}>
        <Flex borderRight="1px solid #231F20" width="150px" flexDirection="column" pt={2} pl={4}>
          <H3 fontSize="12px" fontWeight={700} pb={2}>
            Parcel Info:
          </H3>
          <Flex>
            <Text fontSize="12px" fontWeight={400} pb={2}>
              W: -
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text fontSize="12px" fontWeight={400} pb={2}>
              L: -
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text fontSize="12px" fontWeight={400} pb={2}>
              H: -
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text fontSize="12px" fontWeight={400}>
              Weight: {label?.TotalKG || '-'}kg
            </Text>
          </Flex>
        </Flex>
        <Flex flexDirection="column" pt={2} pb={2} pl={4}>
          <H3 fontSize="12px" fontWeight={700} pb={2}>
            Order No: TFSA000001-01
          </H3>
          <H3 fontSize="12px" fontWeight={700} pb={2}>
            Parcel No: 01
          </H3>
          <Flex>
            <canvas ref={inputRef} style={{ width: '320px', height: '74px' }} />
          </Flex>
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" flexDirection="row" pt={4} pl={4}>
        <Flex flexDirection="column">
          <H3 fontSize="12px" fontWeight={700} mb={1}>
            Dispatch Date
          </H3>
          <Text fontSize="12px" fontWeight={400}>
            06.06.2021
          </Text>
        </Flex>
        <Flex flexDirection="column" alignSelf="flex-end">
          <Grid gridTemplateColumns="1fr 1fr 1fr 1fr" alignContent="center" columnGap="5px">
            <Flex>
              <Image src={images.umbrella} />
            </Flex>
            <Flex>
              <Image src={images.recycle} />
            </Flex>
            <Flex>
              <Image src={images.flame} />
            </Flex>
            <Flex>
              <Image src={images.wineGlass} />
            </Flex>
          </Grid>
        </Flex>
      </Flex>
      {/* </Flex>
      ))} */}
    </Flex>
  )
}

export default PrintLabelComponent
