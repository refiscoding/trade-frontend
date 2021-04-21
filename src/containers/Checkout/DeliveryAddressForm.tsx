import * as React from 'react'

import { Grid, Flex } from '@chakra-ui/core'
import { ConnectedFormGroup } from '../../components/FormElements'

import Input, { Label } from './Input'
import OnboardingAddress from '../OnboardingUserDetails/OnboardingAddress'

type DeliveryAddressFormProps = {}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = () => {
  const [addressTypeChecked, setAddressTypeChecked] = React.useState<string>('business')

  const handleAddressTypeChanged = (addressType: string, checked: boolean) => {
    if (checked) {
      setAddressTypeChecked(addressType)
    }
  }

  const addressTypes = [
    {
      value: 'business',
      changeHandler: handleAddressTypeChanged,
      name: 'Business'
    },
    {
      value: 'residential',
      changeHandler: handleAddressTypeChanged,
      name: 'Residential'
    }
  ]

  return (
    <Flex flexDirection="column">
      <Grid gridTemplateColumns="1fr 1fr" mb={5}>
        {addressTypes?.map((address, index) => (
          <Flex alignItems="center" key={`${index}_address_type`}>
            <Input
              type="checkbox"
              name={address?.name}
              value={address?.value}
              checked={addressTypeChecked === address?.value}
              onChange={(event) =>
                address?.changeHandler(event?.target?.value, event?.target?.checked)
              }
            />
            <Label>{address?.name}</Label>
          </Flex>
        ))}
      </Grid>
      <OnboardingAddress hideTitle={true} handleUserDetails={() => {}} />
    </Flex>
  )
}

export default DeliveryAddressForm
