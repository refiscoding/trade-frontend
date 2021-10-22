import * as React from 'react'
import * as Yup from 'yup'
import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedSelect
} from '../../components/FormElements'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { MotionFlex } from '../../components'
import { POSITIONS } from '../../constants'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const BusinessDetailsFormValidation = Yup.object().shape({
  firstName: Yup.string().required('Name is required'),
  lastName: Yup.string().required('Name is required'),
  companyName: Yup.string().required('Company name is required'),
  position: Yup.string().required('Position is required'),
  phoneNumber: Yup.string().required('Cell phone number is required')
})

type NameValues = {
  companyName: string
  position: string
  phoneNumber: string
}

const BusinessDetails: React.FC<NameProps> = ({ handleUserDetails }) => {
  const [currentPosition] = React.useState('')

  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Lets get to know you</H3>
      </Flex>
      <Formik
        validationSchema={BusinessDetailsFormValidation}
        initialValues={{
          firstName: '',
          lastName: '',
          companyName: '',
          position: '',
          phoneNumber: ''
        }}
        onSubmit={async (
          { firstName, lastName, companyName, phoneNumber },
          { setStatus, setSubmitting }
        ) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleUserDetails({
              firstName,
              lastName,
              companyName,
              position: currentPosition,
              phoneNumber
            })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, setFieldValue }: FormikProps<NameValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Name*" name="firstName" type="text" />
            <ConnectedFormGroup label="Surname*" name="lastName" type="text" />
            <ConnectedFormGroup label="Company name*" name="companyName" type="text" />
            <ConnectedSelect
              label="Select position*"
              placeholder="Select a Position"
              onChange={(e) => setFieldValue('position', e.target.value)}
              name="position"
              options={POSITIONS}
            />
            <ConnectedFormGroup
              label="If other, please specify position."
              name="otherPosition"
              type="text"
            />
            <ConnectedNumberInput label="Cell phone number*" name="phoneNumber" unit="+27" />
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

export default BusinessDetails
