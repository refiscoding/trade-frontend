import * as Yup from 'yup'
import * as React from 'react'
import { useState } from 'react'
import { Form, Formik, FormikProps } from 'formik'
import { Button, Flex, useToast, Image } from '@chakra-ui/core'
import usePlacesAutocomplete, { getGeocode, getLatLng, getZipCode } from 'use-places-autocomplete'

import { formatError } from '../../utils'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { MotionFlex } from '../../components'
import { ERROR_TOAST } from '../../constants'
import { ConnectedFormGroup } from '../../components/FormElements'
import { ComponentLocationAddress } from '../../generated/graphql'

type AddressProps = {
  handleUserDetails: (details: any) => void
  hideTitle?: boolean
  buttonLabel?: string
  editItem?: ComponentLocationAddress
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
  name?: string
  address?: string
  lat?: number
  lng?: number
  type?: string
}

type SelectedSuggestion = {
  street: string
  surburb: string
  cityOrTown: string
}

const morphAddressString = (addressString: string) => {
  const locationDetails = addressString?.split(',')
  const selectedLocation = {
    street: locationDetails[0],
    surburb: locationDetails[1] && locationDetails[1]?.trim(),
    cityOrTown: locationDetails[2] && locationDetails[2]?.trim()
  }
  return selectedLocation
}

const OnbordingUserAddress: React.FC<AddressProps> = ({
  handleUserDetails,
  hideTitle,
  buttonLabel,
  editItem
}) => {
  const addressString = (editItem ? editItem?.address : '') ?? ''
  const addressObject = editItem && morphAddressString(addressString)

  const initialValues = {
    complex: '',
    suburb: addressObject?.surburb || '',
    city: addressObject?.cityOrTown || '',
    postalCode: editItem?.postalCode || '',
    lat: editItem?.lat || 0,
    lng: editItem?.lng || 0,
    type: editItem?.type || 'Residential',
    name: editItem?.name || ''
  }
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

  const handleSelect = ({ description }: any, setFieldValue: any) => () => {
    const locationDetails = description?.split(',')
    const selectedLocation = {
      street: locationDetails[0],
      surburb: locationDetails[1] && locationDetails[1]?.trim(),
      cityOrTown: locationDetails[2] && locationDetails[2]?.trim()
    }
    setValue(description, false)
    setFieldValue('city', selectedLocation?.cityOrTown)
    setFieldValue('suburb', selectedLocation?.surburb)
    clearSuggestions()

    getGeocode({
      address: description
    })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setDefaultValues({
          ...defaultValues,
          address: description,
          lat,
          lng,
          suburb: selectedLocation?.surburb,
          city: selectedLocation?.cityOrTown
        })
      })
      .catch((error) => {
        toast({
          description: 'Something went wrong while updating your address',
          ...ERROR_TOAST
        })
      })

    getGeocode({
      address: description
    })
      .then((zipResults) => getZipCode(zipResults[0], false))
      .then((zipCode) => {
        if(zipCode) {
          setFieldValue('postalCode', zipCode)
          setDefaultValues({
            ...defaultValues,
            postalCode: zipCode
          })
        } else {
          setFieldValue('postalCode', '-')
        }
      })
      .catch((error) => {
        toast({
          description: 'Something went wrong while updating your address',
          ...ERROR_TOAST
        })
      })
  }

  const renderSuggestions = (setFieldValue: any) =>
    data.map((suggestion) => {
      const suggestedplaces = suggestion
      return (
        <Flex
          cursor="pointer"
          bg="white"
          p={2}
          key={suggestedplaces.place_id}
          onClick={handleSelect(suggestion, setFieldValue)}
        >
          <Text fontWeight={600}>{suggestedplaces.structured_formatting.main_text}</Text>
          <Text>{suggestedplaces.structured_formatting.secondary_text}</Text>
        </Flex>
      )
    })

  const handleSubmit = ({ complex, suburb, city, postalCode, name }: AddressValues) => {
    const address = `${value} - ${complex}, ${suburb}, ${city}`

    handleUserDetails({
      address: {
        address: defaultValues.address || address,
        postalCode,
        lng: defaultValues.lng,
        lat: defaultValues.lat,
        type: defaultValues.type,
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
        initialValues={defaultValues}
        onSubmit={async (
          { complex, suburb, city, postalCode, name },
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleSubmit({ complex, suburb, city, postalCode, name })
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
              name="name"
              type="text"
              placeholder="Eg. Mum's Place"
            />

            <Flex flexDirection="column" position="relative">
              <ConnectedFormGroup
                label="Enter your street address*"
                name="address"
                type="text"
                placeholder="Eg. 56 Gauteng Road"
                mb={1}
                value={value}
                onChange={handleInput}
              />
              {resultsStatus === 'OK' && (
                <Flex
                  flexDirection="column"
                  position="absolute"
                  height="200px"
                  zIndex={15}
                  width="100%"
                  bottom={-200}
                >
                  {renderSuggestions(setFieldValue)}
                </Flex>
              )}
              <Flex justify="space-between" mb={4}>
                {/* <Text
                  onClick={handleUseCurrentLocation}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  fontSize={12}
                >
                  Use My Current Location
                </Text> */}
                <Image justifySelf="end" width="40%" src={images.PoweredByGoogle} />
              </Flex>
            </Flex>
            <ConnectedFormGroup
              label="Complex / Building (Optional)"
              name="complex"
              type="text"
              placeholder="Eg. Complex/Building Name, Unit Number or Floor"
            />
            <ConnectedFormGroup
              label="Suburb*"
              name="suburb"
              type="text"
              placeholder="Eg. Langaville"
            />
            <ConnectedFormGroup
              label="City / Town*"
              name="city"
              type="text"
              placeholder="Eg. Brakpan"
            />
            <ConnectedFormGroup
              label="Postal Code*"
              name="postalCode"
              type="text"
              placeholder="Eg. 1540"
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