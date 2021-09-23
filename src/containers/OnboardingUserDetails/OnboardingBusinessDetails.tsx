import { Button, Flex, Image } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { MotionFlex } from '../../components'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const BusinessDetailsFormValidation = Yup.object().shape({
  firstName: Yup.string().required('Name is required'),
  lastName: Yup.string().required('Name is required'),
  companyName: Yup.string().required('Company name is required'),
  position: Yup.string().required('Position is required'),
  workEmailAddress: Yup.string().required('Work email is required'),
  phoneNumber: Yup.string().required('Phone number is required')
})

type NameValues = {
  companyName: string
  position: string
  workEmailAddress: string
  phoneNumber: string
}

const BusinessDetails: React.FC<NameProps> = ({ handleUserDetails }) => {
  const [currentPosition, setCurrentPosition] = React.useState('')

  const handlePositionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.persist()
    const position = event?.target?.value
    setCurrentPosition(position)
  }

  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Lets get to know you</H3>
        <Text textAlign="left" fontSize="14px">
          Lets get to know more about your Business:
        </Text>
      </Flex>
      <Flex width="100%" align="center" justify="center" my={5}>
        <Image width="60%" src={images['OnboardingDetails']} />
      </Flex>
      <Formik
        validationSchema={BusinessDetailsFormValidation}
        initialValues={{
          firstName: '',
          lastName: '',
          companyName: '',
          position: '',
          workEmailAddress: '',
          phoneNumber: ''
        }}
        onSubmit={async (
          { firstName, lastName, companyName, workEmailAddress, phoneNumber },
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
              workEmailAddress,
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
            <ConnectedFormGroup label="Name *" name="firstName" type="text" />
            <ConnectedFormGroup label="Surname *" name="lastName" type="text" />
            <ConnectedFormGroup label="Company name*" name="companyName" type="text" />
            <ConnectedSelect
              label="Select position *"
              placeholder="select a Position"
              onChange={(e) => setFieldValue('position', e.target.value)}
              name="position"
              options={[
                {
                  label: 'CEO',
                  value: 'CEO'
                },
                {
                  label: 'Managing Director',
                  value: 'Managing Director'
                },
                {
                  label: 'Financial Manager',
                  value: 'Financial Manager'
                },
                {
                  label: 'Financial Director',
                  value: 'Financial Director'
                },
                {
                  label: 'Procurement Manager',
                  value: 'Procurement Manager'
                },
                {
                  label: 'Sales Manager',
                  value: 'Sales Manager'
                },
                {
                  label: 'Other',
                  value: 'Other'
                }
              ]}
            />
            <ConnectedFormGroup
              label="If other, please specify position."
              name="otherPosition"
              type="text"
            />
            <ConnectedFormGroup label="Work email address *" name="workEmailAddress" type="text" />
            <ConnectedFormGroup label="Cell phone number *" name="phoneNumber" type="text" />
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
