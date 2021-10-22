import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { theme } from '../../theme'
import { H3 } from '../../typography'
import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'

const PersonalInfo: React.FC = () => {
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
        Seller details
      </H3>
      <ConnectedFormGroup label="Name*" name="firstName" type="text" />
      <ConnectedFormGroup label="Surname*" name="lastName" type="text" />
      <ConnectedNumberInput label="Cell phone number*" name="phoneNumber" unit="+27" />
    </Flex>
  )
}

export default PersonalInfo
