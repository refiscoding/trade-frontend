import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import { useState } from 'react'
import * as React from 'react'
import * as Yup from 'yup'
import { ComponentLocationAddress } from '../../generated/graphql'
import { MotionFlex } from '../../components'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { PROVINCES } from '../../constants'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

type NameProps = {
  handleUserDetails: (details: any) => void
  editItem?: ComponentLocationAddress
}

const NameFormValidation = Yup.object().shape({
  secondaryContactName: Yup.string().required('Secondary contact first name is required'),
  secondaryContactCountry: Yup.string().required('Secondary contact country is required'),
  secondaryContactSurname: Yup.string().required('Secondary contact last name is required'),
  secondaryContactProvince: Yup.string().required('Secondary contact province is required'),
  secondaryContactPhoneNumber: Yup.string().required('Secondary contact phone number is required'),
  secondaryContactEmailAddress: Yup.string().required('Secondary contact email address is required')
})

type NameValues = {
  secondaryContactName: string
  secondaryContactCountry: string
  secondaryContactSurname: string
  secondaryContactProvince: string
  secondaryContactPhoneNumber: string
  secondaryContactEmailAddress: string
}

const OnboardingSecondaryContact: React.FC<NameProps> = ({ handleUserDetails }) => {
  const [selectedProvince, setSelectedProvince] = useState('')
  console.log('selectedProvince', selectedProvince)

  const handleSubmit = ({ secondaryContactProvince }: NameValues) => {
    handleUserDetails({
      name: {
        secondaryContactProvince
      }
    })
  }

  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Secondary Contact Information</H3>
        <Text textAlign="left" fontSize="14px">
          In the case of not being able to get hold of you, please leave a secondary contact at your
          delivery address.
        </Text>
      </Flex>
      <Formik
        validationSchema={NameFormValidation}
        initialValues={{
          secondaryContactName: '',
          secondaryContactCountry: '',
          secondaryContactSurname: '',
          secondaryContactProvince: '',
          secondaryContactPhoneNumber: '',
          secondaryContactEmailAddress: ''
        }}
        onSubmit={async (
          {
            secondaryContactName,
            secondaryContactCountry,
            secondaryContactSurname,
            secondaryContactProvince,
            secondaryContactPhoneNumber,
            secondaryContactEmailAddress
          },
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          console.log('secondaryContactProvince', secondaryContactProvince)
          try {
            setSubmitting(true)
            handleUserDetails({
              secondaryContactName,
              secondaryContactCountry,
              secondaryContactSurname,
              secondaryContactProvince,
              secondaryContactPhoneNumber,
              secondaryContactEmailAddress
            })
            handleSubmit({
              secondaryContactName,
              secondaryContactCountry,
              secondaryContactSurname,
              secondaryContactProvince,
              secondaryContactPhoneNumber,
              secondaryContactEmailAddress
            })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<NameValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="First name *" name="secondaryContactName" type="text" />
            <ConnectedFormGroup label="Last name *" name="secondaryContactSurname" type="text" />
            <ConnectedFormGroup
              label="Phone number*"
              name="secondaryContactPhoneNumber"
              type="text"
            />
            <ConnectedFormGroup
              label="Email address*"
              name="secondaryContactEmailAddress"
              type="text"
            />
            <ConnectedFormGroup
              label="Country*"
              placeholder="Eg. South Africa"
              name="secondaryContactCountry"
              type="text"
            />
            <ConnectedSelect
              label="Province*"
              placeholder="select a Province"
              name="secondaryContactProvince"
              onChange={(name) => {
                setSelectedProvince(name.target.value)
              }}
              value={selectedProvince}
              options={PROVINCES}
            />

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

export default OnboardingSecondaryContact
