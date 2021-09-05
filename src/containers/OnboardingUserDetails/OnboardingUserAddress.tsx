import * as React from 'react'
import * as Yup from 'yup'
import { useState } from 'react'

import { ApolloError } from 'apollo-boost'
import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { get } from 'lodash'

import { ComponentLocationAddress, useGetHubCodesQuery } from '../../generated/graphql'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { ERROR_TOAST } from '../../constants'
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
  province: Yup.string().required('Province is required'),
  city: Yup.string().required('City / Town is required'),
  suburb: Yup.string().required('Suburb is required'),
  postalCode: Yup.string().required('Postal Code is required')
})

type AddressValues = {
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
  console.log('hubCodes: ', hubCodes)

  const initialValues = {
    province: editItem?.province || '',
    city: editItem?.city || '',
    suburb: editItem?.suburb || '',
    postalCode: editItem?.postalCode || '',
    type: editItem?.type || 'Residential',
    name: editItem?.name || ''
  }

  const handleSelectedProvince = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.persist()
    const value = event?.target?.value
    setSelectedProvince(value)
  }

  const handleSubmit = ({ province, suburb, city, postalCode, name }: AddressValues) => {
    handleUserDetails({
      address: {
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
          { province, suburb, city, postalCode, name },
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          try {
            setSubmitting(true)
            await handleSubmit({ province, suburb, city, postalCode, name })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<AddressValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup
              label="Address Name*"
              name="name"
              type="text"
              placeholder="Eg. Mum's Place"
            />
            <ConnectedSelect
              label="Select Province"
              onChange={handleSelectedProvince}
              placeholder="-"
              name="province"
              options={[
                {
                  label: 'Eastern Cape',
                  value: 'Eastern Cape'
                },
                {
                  label: 'Free State',
                  value: 'Free State'
                },
                {
                  label: 'Gauteng',
                  value: 'Gauteng'
                },
                {
                  label: 'KwaZulu Natal',
                  value: 'KwaZulu Natal'
                },
                {
                  label: 'Limpopo',
                  value: 'Limpopo'
                },
                {
                  label: 'Mpumalanga',
                  value: 'Mpumalanga'
                },
                {
                  label: 'Northern Cape',
                  value: 'Northern Cape'
                },
                {
                  label: 'North West',
                  value: 'North West'
                },
                {
                  label: 'Western Cape',
                  value: 'Western Cape'
                }
              ]}
            />
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
