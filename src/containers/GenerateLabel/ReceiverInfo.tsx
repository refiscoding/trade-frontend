import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { theme } from '../../theme'
import { H3 } from '../../typography'
import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'

const ReceiverInfo: React.FC = () => {
  return (
    <Flex
      flexDirection="column"
      borderBottomColor="accent.600"
      p={4}
      marginTop="0.5rem"
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow={theme.boxShadowMedium}
    >
      <H3 mb={4} fontWeight={550} textAlign="left">
        Receiver Information
      </H3>
      <ConnectedFormGroup label="Receiver Name*" name="receiverName" type="text" />
      <ConnectedFormGroup
        label="Physical Address(Destination):*"
        name="receiverAddress"
        type="text"
      />
      <ConnectedNumberInput label="Contact Number*" name="receiverNumber" unit="+27" />
    </Flex>
  )
}

export default ReceiverInfo
