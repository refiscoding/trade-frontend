import * as React from 'react'

import { Grid, Flex, useToast } from '@chakra-ui/core'

import Input, { Label } from './Input'
import OnboardingAddress from '../OnboardingUserDetails/OnboardingAddress'
import { ComponentLocationAddressInput, useUpdateAddressMutation } from '../../generated/graphql'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { useAuthContext } from '../../context/AuthProvider'

type DeliveryAddressFormProps = {}

type DetailsInput = {
  address?: ComponentLocationAddressInput
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = () => {
  const { setUser } = useAuthContext()
  const [addressTypeChecked, setAddressTypeChecked] = React.useState<string>('business')
  const toast = useToast()

  const handleAddressTypeChanged = (addressType: string, checked: boolean) => {
    if (checked) {
      setAddressTypeChecked(addressType)
    }
  }

  const [updateAddress] = useUpdateAddressMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    // @ts-ignore
    onCompleted: async ({ updateAddress }) => {
      if (updateAddress?.profileCompleted && setUser) {
        setUser(updateAddress)
        toast({
          description: 'Successfully added your details!',
          ...SUCCESS_TOAST
        })
      }
    }
  })

  const handleUserDetails = async (details: DetailsInput) => {
    await updateAddress({ variables: { input: details.address } })
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
      <OnboardingAddress
        hideTitle={true}
        handleUserDetails={handleUserDetails}
        buttonLabel="ADD NEW ADDRESS"
      />
    </Flex>
  )
}

export default DeliveryAddressForm
