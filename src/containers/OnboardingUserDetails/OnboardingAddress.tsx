import { Button, Flex, useToast } from "@chakra-ui/core";
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'

import { MotionFlex } from '../../components'
import { ConnectedFormGroup } from '../../components/FormElements'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'
import { useState } from 'react'
import { ERROR_TOAST } from '../../constants'

type AddressProps = {
  handleUserDetails: (details: any) => void
}

const AddressFormValidation = Yup.object().shape({
  complex: Yup.string(),
  suburb: Yup.string().required('A Suburb is required'),
  city: Yup.string().required('A City / Town is required'),
  postalCode: Yup.string().required('A Postal Code is required')
})

type AddressValues = {
  complex: string
  suburb: string
  city: string
  postalCode: string
  lat?: number
  lng?: number
}

const initialValues = {
  complex: '',
  suburb: '',
  city: '',
  postalCode: '',
  lat: 0,
  lng: 0
}

const UserDetails: React.FC<AddressProps> = ({ handleUserDetails }) => {
  const [defaultValues, setDefaultValues] = useState<AddressValues>(initialValues)
  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300
  })
  const resultsStatus = status
  const toast = useToast()

  const handleInput = (e: any) => {
    setValue(e.target.value)
  }

  const handleSelect = ({ description }: any) => () => {
    setValue(description, false)
    clearSuggestions()

    getGeocode({
      address: description,
      componentRestrictions: {
        country: 'RSA'
      }
    })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setDefaultValues({
          ...defaultValues,
          lat,
          lng
        })
      })
      .catch((error) => {
        console.log('Error:', error)
        toast({
          description: 'Something went wrong while updating your address',
          ...ERROR_TOAST
        })
      })
  }

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const suggestedplaces = suggestion

      return (
        <li key={suggestedplaces.place_id} onClick={handleSelect(suggestion)}>
          <Text fontWeight={600}>{suggestedplaces.structured_formatting.main_text}</Text>
          <Text>{suggestedplaces.structured_formatting.secondary_text}</Text>
        </li>
      )
    })

  const handleSubmit = ({ complex, suburb, city, postalCode }: AddressValues) => {
    const address = `${complex} ${suburb} ${city}`
    handleUserDetails({
      address: {
        address,
        postalCode,
        lng: defaultValues.lng,
        lat: defaultValues.lat
      }
    })
  }

  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Let’s get to know you.</H3>
        <Text textAlign="left" fontSize="14px">
          Fill out some information about yourself to get started.
        </Text>
      </Flex>
      <Formik
        validationSchema={AddressFormValidation}
        initialValues={defaultValues}
        onSubmit={async ({ complex, suburb, city, postalCode }, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleSubmit({ complex, suburb, city, postalCode })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<AddressValues>) => (
          <Form style={{ width: '100%' }}>
            <Flex flexDirection="column">
              <ConnectedFormGroup
                label="Enter your street address*"
                name="address"
                type="text"
                placeholder="Eg. 12 Ridge Street"
                mb={1}
                value={value}
                onChange={handleInput}
              />
              {resultsStatus === 'OK' && <Flex flexDirection="column">{renderSuggestions()}</Flex>}
            </Flex>
            <ConnectedFormGroup
              label="Complex / Building (Optional)"
              name="complex"
              type="text"
              placeholder="Complex or Building Name, unit number or floor"
            />
            <ConnectedFormGroup label="Suburb*" name="suburb" type="text" />
            <ConnectedFormGroup label="City / Town*" name="city" type="text" />
            <ConnectedFormGroup label="Postal Code*" name="postalCode" type="text" />
            {status && (
              <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                <Text textAlign="right" color="red.500">
                  {status}
                </Text>
              </MotionFlex>
            )}
            <Button mt={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
              NEXT
            </Button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default UserDetails
