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
  firstName: Yup.string().required('Name is required'),
  lastName: Yup.string().required('Surname is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  email: Yup.string().required('Email address is required')
})

type NameValues = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

const OnboardingIndividual: React.FC<NameProps> = ({ handleUserDetails }) => {
  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Let’s get to know you more</H3>
        <Text textAlign="left" fontSize="14px">
          Fill out some information about yourself to get started.
        </Text>
      </Flex>
      <Formik
        validationSchema={NameFormValidation}
        initialValues={{
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: ''
        }}
        onSubmit={async (
          { firstName, lastName, phoneNumber, email },
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleUserDetails({
              firstName,
              lastName,
              phoneNumber,
              email
            })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<NameValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Name *" name="firstName" type="text" />
            <ConnectedFormGroup label="Surname *" name="lastName" type="text" />
            <ConnectedFormGroup label="Phone number*" name="phoneNumber" type="text" />
            <ConnectedFormGroup label="Email address*" name="email" type="text" />
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

export default OnboardingIndividual
