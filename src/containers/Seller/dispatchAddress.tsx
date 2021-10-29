import * as React from 'react'
import { ApolloError } from 'apollo-boost'
import { Flex, useToast } from '@chakra-ui/core'
import { get } from 'lodash'
import { useEffect, useState } from 'react'

import { ERROR_TOAST, PROVINCES } from '../../constants'
import { theme } from '../../theme'
import { H3 } from '../../typography'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { useGetHubCodesQuery } from '../../generated/graphql'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

type dispatchAddressTypes = {
  setFieldValue: any
  setSelectedHub: any
}

const DispatchAddress: React.FC<dispatchAddressTypes> = ({ setFieldValue, setSelectedHub }) => {
  const toast = useToast()
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedSuburb, setSelectedSuburb] = useState('')

  const { data } = useGetHubCodesQuery({
    onError: (err: ApolloError) =>
      toast({
        description: err.message,
        ...ERROR_TOAST
      }),
    variables: { province: selectedProvince }
  })

  const hubCodesResults = get(data, 'getHubCodes')
  const hubCodes = hubCodesResults?.ResultSets?.[0] || []
  const cities = hubCodes
    .map((hub: any) => hub.City)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((city) => ({
      label: city && capitalizeFirstLetter(city),
      value: city
    }))
  const checkCity = (cities: any, selectedCity: string) => {
    return cities.filter((city: any) => city.City === selectedCity)
  }
  const cityWithSuburb = checkCity(hubCodes, selectedCity)
  const suburbList = cityWithSuburb.map((sub: any) => ({
    label: (sub?.Suburb && capitalizeFirstLetter(sub?.Suburb)) || '',
    value: sub?.Suburb || ''
  }))
  const postalCodeList = cityWithSuburb
    .map((sub: any) => sub?.PostalCode)
    .filter((value: any, index: any, self: any) => self.indexOf(value) === index)
    .map((postal: any) => ({
      label: postal,
      value: postal
    }))
  const hubCodeList = cityWithSuburb.map((hubCode: any) => hubCode.HubCode)

  useEffect(() => {
    setSelectedHub(hubCodeList[0])
  }, [hubCodeList])

  return (
    <Flex
      flexDirection="column"
      borderBottomColor="accent.600"
      p={4}
      mt={3}
      borderRadius={5}
      background={theme.colors.accent[50]}
      boxShadow={theme.boxShadowMedium}
    >
      <H3 mb={4} fontWeight={550} textAlign="left">
        Dispatch address
      </H3>
      <ConnectedFormGroup
        label="Address name*"
        placeholder="Eg. Mum's Place"
        name="name"
        type="text"
      />
      <ConnectedFormGroup
        label="Building/ complex name"
        placeholder="Eg. Carlton Centre"
        name="building"
        type="text"
      />
      <ConnectedFormGroup
        label="Street address*"
        placeholder="Eg. 68 Fifth Street"
        name="street"
        type="text"
      />
      <ConnectedSelect
        label="Province*"
        placeholder="Select province"
        name="province"
        onChange={(name) => {
          setSelectedProvince(name.target.value)
          setFieldValue('province', name.target.value)
        }}
        options={PROVINCES}
      />
      <ConnectedSelect
        label="City*"
        placeholder="Select city"
        name="city"
        textTransform="lowercase"
        onChange={(name) => {
          setSelectedCity(name.target.value)
          setFieldValue('city', name.target.value)
        }}
        options={cities}
        isDisabled={selectedProvince === '' ? true : false}
      />
      <ConnectedSelect
        label="Suburb*"
        placeholder="Select suburb"
        name="suburb"
        textTransform="lowercase"
        onChange={(name) => {
          setSelectedSuburb(name.target.value)
          setFieldValue('suburb', name.target.value)
        }}
        options={suburbList}
        isDisabled={selectedCity === '' ? true : false}
      />
      <ConnectedSelect
        label="Postal code*"
        name="postalCode"
        onChange={(name) => {
          setFieldValue('postalCode', name.target.value)
        }}
        placeholder="Select postal code"
        options={postalCodeList}
        isDisabled={selectedSuburb === '' ? true : false}
      />
    </Flex>
  )
}

export default DispatchAddress
