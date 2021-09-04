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
  province: string
  suburb: string
  city: string
  postalCode: string
  name?: string
  address?: string
  type?: string
}

const UserDetails: React.FC<AddressProps> = ({
  handleUserDetails,
  hideTitle,
  buttonLabel,
  editItem
}) => {
  const initialValues = {
    province: editItem?.province || '',
    suburb: editItem?.suburb || '',
    city: editItem?.city || '',
    postalCode: editItem?.postalCode || '',
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

  const handleSubmit = ({ province, suburb, city, postalCode, name }: AddressValues) => {

    handleUserDetails({
      address: {
        province,
        city,
        suburb,
        postalCode,
        type: defaultValues.type,
        name
      }
    })
  }

  return (
    <React.Fragment>
      {!hideTitle && (
        <Flex width="100%" mb={4} flexDirection="column">
          <H3 textAlign="left">Company Address</H3>
          <Text textAlign="left" fontSize="14px">
            Fill out some information about yourself to get started.
          </Text>
        </Flex>
      )}
      <Formik
        validationSchema={AddressFormValidation}
        initialValues={defaultValues}
        onSubmit={async (
          { province, suburb, city, postalCode, name },
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleSubmit({ province, suburb, city, postalCode, name })
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
                  {/* {renderSuggestions(setFieldValue)} */}
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

export default UserDetails
