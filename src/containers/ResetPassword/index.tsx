import { Button, Flex, useToast } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import { MotionFlex, SideSlider } from '../../components'
import { ConnectedPasswordGroup } from '../../components/FormElements'
import { SUCCESS_TOAST } from '../../constants'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'
import strapiHelpers from '../../utils/strapiHelpers'

const ResetPasswordFormValidation = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password has to be longer than 6 characters!')
    .required('A password is required'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match')
})

type ResetPasswordProps = {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const toast = useToast()
  const location = useLocation()
  const history = useHistory()

  const INITIAL_VALUES = {
    password: '',
    confirmPassword: '',
    code: new URLSearchParams(location.search).get('code') as string
  }

  return (
    <PageWrap
      pt={0}
      align="center"
      justify="center"
      title="Reset Password"
      backgroundSize="cover"
      bgImage={`url(${images.bg})`}
    >
      <SideSlider>
        <Flex width="100%">
          <H3 textAlign="left" mb={4}>
            Forgot Password
          </H3>
        </Flex>
        <Formik
          validationSchema={ResetPasswordFormValidation}
          initialValues={INITIAL_VALUES}
          onSubmit={async ({ code, password, confirmPassword }, { setSubmitting, setStatus }) => {
            setStatus(null)
            try {
              setSubmitting(true)
              await strapiHelpers.resetPassword(code, password, confirmPassword)
              setSubmitting(false)
              toast({ description: 'Your password was updated.', ...SUCCESS_TOAST })
              history.push('/')
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ isSubmitting, status }: FormikProps<typeof INITIAL_VALUES>) => (
            <Form style={{ width: '100%' }}>
              <Flex mb={4}>
                <Text>Please enter a new password below.</Text>
              </Flex>
              <ConnectedPasswordGroup name="password" label="Password" placeholder="Password" />
              <ConnectedPasswordGroup
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm Password"
              />
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

export default ResetPassword
