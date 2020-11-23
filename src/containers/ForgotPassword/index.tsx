import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { MotionFlex, SideSlider } from '../../components'
import { ConnectedFormGroup } from '../../components/FormElements'
import { SUCCESS_TOAST } from '../../constants'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'
import strapiHelpers from '../../utils/strapiHelpers'

const ForgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required')
})

type ForgotPasswordProps = {}

type InitialValues = {
  email: string
}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const toast = useToast()

  return (
    <PageWrap
      pt={0}
      align="center"
      justify="center"
      backgroundSize="cover"
      title="Forgot Password"
      bgImage={`url(${images.bg})`}
    >
      <SideSlider>
        <Flex width="100%">
          <H3 textAlign="left" mb={4}>
            Forgot Password
          </H3>
        </Flex>
        <Formik
          validationSchema={ForgotPasswordValidation}
          initialValues={{
            email: ''
          }}
          onSubmit={async ({ email }, { setSubmitting, setStatus }) => {
            setStatus(null)
            try {
              setSubmitting(true)
              await strapiHelpers.forgotPassword(email)
              setSubmitting(false)
              toast({ description: 'Email sent. Please check your inbox.', ...SUCCESS_TOAST })
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ isSubmitting, status }: FormikProps<InitialValues>) => (
            <Form style={{ width: '100%' }}>
              <Flex mb={4}>
                <Text>
                  Enter your email address below and we&apos;ll send you a link to reset your
                  password.
                </Text>
              </Flex>
              <ConnectedFormGroup name="email" label="Email" placeholder="Email" />
              {status && (
                <MotionFlex
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  justify="center"
                  mb={2}
                  width="100%"
                >
                  <Text textAlign="right" color="red.500">
                    {status}
                  </Text>
                </MotionFlex>
              )}
              <Button
                mt={4}
                width="100%"
                type="submit"
                variantColor="brand"
                isLoading={isSubmitting}
              >
                SUBMIT
              </Button>
            </Form>
          )}
        </Formik>
      </SideSlider>
    </PageWrap>
  )
}

export default ForgotPassword
