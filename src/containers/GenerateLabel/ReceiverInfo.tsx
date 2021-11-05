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
      <ConnectedFormGroup label="Receiver Name" name="receiverName" type="text" isDisabled={true} />
      <ConnectedFormGroup
        label="Street Address(Destination)"
        name="receiverStreetAddress"
        type="text"
        isDisabled={true}
      />
      <ConnectedFormGroup label="Suburb:" name="receiverSuburb" type="text" isDisabled={true} />
      <ConnectedFormGroup label="City / Town" name="receiverTown" type="text" isDisabled={true} />
      <ConnectedNumberInput label="Contact Number" name="receiverNumber" isDisabled={true} />
    </Flex>
  )
}

export default ReceiverInfo
