import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { theme } from '../../theme'
import { H3 } from '../../typography'
import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'

const SenderInfo: React.FC = () => {
  return (
    <Flex
      flexDirection="column"
      borderBottomColor="accent.600"
      p={4}
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow={theme.boxShadowMedium}
    >
      <H3 mb={4} fontWeight={550} textAlign="left">
        Sender Information
      </H3>
      <ConnectedFormGroup
        label="Company Name"
        name="senderCompanyName"
        type="text"
        isDisabled={true}
      />
      <ConnectedFormGroup
        label="Street Address(Origin)"
        name="senderStreetAddress"
        type="text"
        isDisabled={true}
      />
      <ConnectedFormGroup label="Suburb:" name="senderSuburb" type="text" isDisabled={true} />
      <ConnectedFormGroup label="City / Town" name="senderTown" type="text" isDisabled={true} />
      <ConnectedNumberInput
        label="Contact Number:"
        name="senderNumber"
        unit="+27"
        isDisabled={true}
      />
    </Flex>
  )
}

export default SenderInfo
