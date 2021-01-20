import { Button, Flex, Image } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { MotionFlex } from '../../components'
import { ConnectedFormGroup } from '../../components/FormElements'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

type NameProps = {
  handleUserDetails: (details: any) => void
}

const NameFormValidation = Yup.object().shape({
  firstName: Yup.string().required('An first name is required'),
  lastName: Yup.string().required('A last name is required')
})

type NameValues = {
  firstName: string
  lastName: string
}

const UserDetails: React.FC<NameProps> = ({ handleUserDetails }) => {
  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Let’s get to know you.</H3>
        <Text textAlign="left" fontSize="14px">
          Fill out some information about yourself to get started.
        </Text>
      </Flex>
      <Flex width="100%" align="center" justify="center" my={5}>
        <Image width="60%" src={images['OnboardingDetails']} />
      </Flex>
      <Formik
        validationSchema={NameFormValidation}
        initialValues={{
          firstName: '',
          lastName: ''
        }}
        onSubmit={async ({ firstName, lastName }, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleUserDetails({ firstName, lastName })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<NameValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="What is your first name?*" name="firstName" type="text" />
            <ConnectedFormGroup label="What is your last name?*" name="lastName" type="text" />
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
