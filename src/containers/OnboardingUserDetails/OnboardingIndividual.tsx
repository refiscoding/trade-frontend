import * as React from 'react'
import * as Yup from 'yup'
import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'

import { ComponentLocationAddress } from '../../generated/graphql'
import { ConnectedFormGroup, ConnectedNumberInput } from '../../components/FormElements'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex } from '../../components'

type NameProps = {
  handleUserDetails: (details: any) => void
  editItem?: ComponentLocationAddress
}

const NameFormValidation = Yup.object().shape({
  firstName: Yup.string().required('Name is required'),
  lastName: Yup.string().required('Surname is required'),
  phoneNumber: Yup.string().required('Cell phone number is required')
})

type NameValues = {
  firstName: string
  lastName: string
  phoneNumber: string
}

const OnboardingIndividual: React.FC<NameProps> = ({ handleUserDetails }) => {
  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Let’s get to know you</H3>
      </Flex>
      <Formik
        validationSchema={NameFormValidation}
        initialValues={{
          firstName: '',
          lastName: '',
          phoneNumber: ''
        }}
        onSubmit={async ({ firstName, lastName, phoneNumber }, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleUserDetails({
              firstName,
              lastName,
              phoneNumber
            })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<NameValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Name*" name="firstName" type="text" />
            <ConnectedFormGroup label="Surname*" name="lastName" type="text" />
            <ConnectedNumberInput label="Cell phone number*" name="phoneNumber" />
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
