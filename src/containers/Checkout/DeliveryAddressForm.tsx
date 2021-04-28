import * as React from 'react'

import { Grid, Flex, useToast } from '@chakra-ui/core'

import Input, { Label } from './Input'
import OnboardingAddress from '../OnboardingUserDetails/OnboardingAddress'
import {
  ComponentLocationAddressInput,
  useUpdateAddressMutation,
  useEditAddressMutation,
  ComponentLocationAddress
} from '../../generated/graphql'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { useAuthContext } from '../../context/AuthProvider'
import { useEffect } from 'react'
import { ApolloError } from 'apollo-client'

type DeliveryAddressFormProps = {
  editItem?: ComponentLocationAddress
}

type DetailsInput = {
  address?: ComponentLocationAddressInput
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({ editItem }) => {
  const { setUser } = useAuthContext()
  const [addressTypeChecked, setAddressTypeChecked] = React.useState<string>('')
  const toast = useToast()

  useEffect(() => {
    editItem && setAddressTypeChecked(editItem.type || '')
  }, [editItem])

  const handleAddressTypeChanged = (addressType: string) => {
    setAddressTypeChecked(addressType)
  }

  const [updateAddress] = useUpdateAddressMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
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

  const [editAddress] = useEditAddressMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async ({ editAddress }) => {
      if (editAddress?.profileCompleted && setUser) {
        setUser(editAddress)
        toast({
          description: 'Successfully edited your details!',
          ...SUCCESS_TOAST
        })
      }
    }
  })

  const handleUserDetails = async (details: DetailsInput) => {
    if (editItem) {
      const { id, address, postalCode, lat, lng, defaultAddress } = editItem
      return await editAddress({
        variables: {
          input: {
            address,
            postalCode,
            lat,
            lng,
            defaultAddress,
            ...details.address,
            type: addressTypeChecked,
            id
          }
        }
      })
    }
    await updateAddress({ variables: { input: { ...details.address, type: addressTypeChecked } } })
  }

  const addressTypes = [
    {
      name: 'Business'
    },
    {
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
              value={addressTypeChecked}
              checked={addressTypeChecked === address?.name}
              onChange={() => handleAddressTypeChanged(address?.name)}
            />
            <Label>{address?.name}</Label>
          </Flex>
        ))}
      </Grid>
      <OnboardingAddress
        hideTitle={true}
        handleUserDetails={handleUserDetails}
        buttonLabel={editItem ? 'Edit Address' : 'ADD NEW ADDRESS'}
      />
    </Flex>
  )
}

export default DeliveryAddressForm
