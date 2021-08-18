import * as React from 'react'

import { Flex, FlexProps } from '@chakra-ui/core'

import { images, theme } from '../../theme'
import { motion } from 'framer-motion'
import { H5, Text } from '../../typography'

type PrintLabelComponentProps = FlexProps & {}

const PrintLabelComponent: React.FC<PrintLabelComponentProps> = () => {
  return (
    <Flex
      flexDirection="column"
      p={4}
      margin="2rem"
      width="545.05px"
      height="450.11px"
      borderRadius="4px"
      background={theme.colors.accent[50]}
      border={`4px solid ${theme.colors.brand[500]}`}
    >
      <Flex
        height="150px"
        borderBottom={`1px solid ${theme.colors.background}`}
        flexDirection="row"
        p={2}
      >
        <Flex
          borderRight={`1px solid ${theme.colors.background}`}
          flexDirection="column"
          style={{ placeItems: 'center' }}
          justifyContent="center"
          width="150px"
        >
          <motion.img width="40%" height="auto" src={images.TradeFedLogo} />
          <Text fontSize="23px" fontWeight={400} color="#16385a" mt={2}>
            TradeFed
          </Text>
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex flexDirection="column">
            <H5>From :</H5>
            <Flex flexDirection="column">
              <Text>Jack's Peanuts</Text>
              <Text>018 938 8371</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text>251 Johnson Street</Text>
              <Text>Hatfield, 0081</Text>
              <Text>Pretoria</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <H5>To :</H5>
            <Flex flexDirection="column">
              <Text>Nelly Smith</Text>
              <Text>072 838 0502</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text>96 Shell Street</Text>
              <Text>George, 2181</Text>
              <Text>Cape Town</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        height="170px"
        borderBottom={`1px solid ${theme.colors.background}`}
        flexDirection="row"
        p={2}
      >
        <Flex
          borderRight={`1px solid ${theme.colors.background}`}
          width="150px"
          flexDirection="column"
        ></Flex>
        <Flex></Flex>
      </Flex>
      <Flex justifyContent="space-between" flexDirection="row" p={2}>
        <Flex></Flex>
        <Flex></Flex>
      </Flex>
    </Flex>
  )
}

export default PrintLabelComponent
