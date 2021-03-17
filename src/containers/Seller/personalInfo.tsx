import * as React from 'react'
import { Flex } from '@chakra-ui/core'

import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'
import { H3 } from '../../typography'

const PersonalInfo: React.FC = () => {
  return (
    <Flex flexDirection="column" borderBottomColor="accent.600" borderBottomWidth={10}>
      <H3 mb={4} fontWeight={500} textAlign="left">
        Some Personal Information{' '}
      </H3>
      <ConnectedFormGroup label="What is your first name?*" name="firstName" type="text" />
      <ConnectedFormGroup label="What is your last name?*" name="lastName" type="text" />
      <ConnectedFormGroup label="Your Email Address?*" name="email" type="text" isDisabled={true} />
      <ConnectedFormGroup label="Enter your ID Number*" name="idNumber" type="text" />
      <ConnectedNumberInput label="Enter your phone number*" name="phoneNumber" unit="+27" />
    </Flex>
  )
}

export default PersonalInfo
