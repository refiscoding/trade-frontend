import * as React from 'react'
import * as Yup from 'yup'
import { useState } from 'react'

import { ApolloError } from 'apollo-boost'
import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { get } from 'lodash'

import { ComponentLocationAddress, useGetHubCodesQuery } from '../../generated/graphql'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { ERROR_TOAST, PROVINCES } from '../../constants'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex } from '../../components'

type AddressProps = {
  handleUserDetails: (details: any) => void
  hideTitle?: boolean
  buttonLabel?: string
  editItem?: ComponentLocationAddress
}

const AddressFormValidation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  street: Yup.string().required('Street Address is required'),
  province: Yup.string().required('Province is required'),
  city: Yup.string().required('City / Town is required'),
  suburb: Yup.string().required('Suburb is required'),
  postalCode: Yup.string().required('Postal Code is required')
})

type AddressValues = {
  street: string
  building: string
  province: string
  city: string
  suburb: string
  postalCode: string
  name?: string
  type?: string
}

const OnbordingUserAddress: React.FC<AddressProps> = ({
  handleUserDetails,
  hideTitle,
  buttonLabel,
  editItem
}) => {
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
      label: city,
      value: city
    }))
  const checkCity = (cities: any, selectedCity: string) => {
    return cities.filter((city: any) => city.City === selectedCity)
  }
  const cityWithSuburb = checkCity(hubCodes, selectedCity)
  const suburbList = cityWithSuburb.map((sub: any) => ({
    label: sub?.Suburb || '',
    value: sub?.Suburb || ''
  }))
  const postalCodeList = cityWithSuburb
    .map((sub: any) => sub?.PostalCode)
    .filter((value: any, index: any, self: any) => self.indexOf(value) === index)
    .map((postal: any) => ({
      label: postal,
      value: postal
    }))

  const initialValues = {
    street: editItem?.street || '',
    building: editItem?.building || '',
    province: editItem?.province || '',
    city: editItem?.city || '',
    suburb: editItem?.suburb || '',
    postalCode: editItem?.postalCode || '',
    type: editItem?.type || 'Residential',
    name: editItem?.name || ''
  }

  const handleSubmit = ({
    street,
    building,
    province,
    suburb,
    city,
    postalCode,
    name
  }: AddressValues) => {
    handleUserDetails({
      address: {
        street,
        building,
        province,
        city,
        suburb,
        postalCode,
        type: initialValues.type,
        name
      }
    })
  }

  return (
    <React.Fragment>
      {!hideTitle && (
        <Flex width="100%" mb={4} flexDirection="column">
          <H3 textAlign="left">User Address</H3>
          <Text textAlign="left" fontSize="14px">
            Fill out some information about yourself to get started.
          </Text>
        </Flex>
      )}
      <Formik
        validationSchema={AddressFormValidation}
        initialValues={initialValues}
        onSubmit={async (
          { street, building, province, suburb, city, postalCode, name }: AddressValues,
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          try {
            setSubmitting(true)
            await handleSubmit({ street, building, province, suburb, city, postalCode, name })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, setFieldValue }: FormikProps<AddressValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup
              label="Address Name*"
              placeholder="Eg. Mum's Place"
              name="name"
              type="text"
            />
            <ConnectedFormGroup
              label="Building/Complex Name"
              placeholder="Eg. Carlton Centre"
              name="building"
              type="text"
            />
            <ConnectedFormGroup
              label="Street Address*"
              placeholder="Eg. 68 Fifth Street"
              name="street"
              type="text"
            />
            <ConnectedSelect
              label="Province*"
              placeholder="Select a Province"
              name="province"
              onChange={(name) => {
                setSelectedProvince(name.target.value)
                setFieldValue('province', name.target.value)
              }}
              options={PROVINCES}
            />
            <ConnectedSelect
              label="City*"
              placeholder="Select a City / Town"
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
              placeholder="Select a Suburb"
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
              label="Postal Code*"
              name="postalCode"
              onChange={(name) => {
                setFieldValue('postalCode', name.target.value)
              }}
              placeholder="Select Postal Code"
              options={postalCodeList}
              isDisabled={selectedSuburb === '' ? true : false}
            />
            {status && (
              <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                <Text textAlign="right" color="red.500">
                  {status}
                </Text>
              </MotionFlex>
            )}
            <Button mt={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
              {buttonLabel || 'NEXT'}
            </Button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default OnbordingUserAddress
