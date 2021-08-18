import * as React from 'react'

import { Flex, FlexProps, Grid, Image } from '@chakra-ui/core'
import { useBarcode } from 'react-barcodes'

import { images, theme } from '../../theme'
import { H3, Text } from '../../typography'

type PrintLabelComponentProps = FlexProps & {}

const PrintLabelComponent: React.FC<PrintLabelComponentProps> = () => {
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
                Jack's Peanuts
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                018 938 8371
              </Text>
            </Flex>
            <Flex flexDirection="column" mt={3}>
              <Text fontSize="12px" fontWeight={400}>
                251 Johnson Street
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                Hatfield, 0081
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                Pretoria
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" width="150px" pt={2} pb={2} pl={4} pr={2}>
            <H3 fontSize="12px" fontWeight={700} mb={1}>
              To :
            </H3>
            <Flex flexDirection="column">
              <Text fontSize="12px" fontWeight={400}>
                Nelly Smith
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                072 838 0502
              </Text>
            </Flex>
            <Flex flexDirection="column" mt={3}>
              <Text fontSize="12px" fontWeight={400}>
                96 Shell Street
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                George, 2181
              </Text>
              <Text fontSize="12px" fontWeight={400}>
                Cape Town
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
              W: 23cm
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text fontSize="12px" fontWeight={400} pb={2}>
              L: 45cm
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text fontSize="12px" fontWeight={400} pb={2}>
              H: 13cm
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text fontSize="12px" fontWeight={400}>
              Weight: 48kg
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
    </Flex>
  )
}

export default PrintLabelComponent
