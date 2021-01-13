import { Button, Flex, Image } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { MotionFlex, SideSlider } from '../../components'
import { ConnectedFormGroup } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

type AddressProps = {
  handleUserDetails: (details: any) => void
}

const AddressFormValidation = Yup.object().shape({
  address: Yup.string().required('An address is required'),
  complex: Yup.string(),
  suburb: Yup.string().required('A Suburb is required'),
  city: Yup.string().required('A City / Town is required'),
  postalCode: Yup.string().required('A Postal Code is required')
})

type AddressValues = {
  address: string
  complex: string
  suburb: string
  city: string
  postalCode: string
}

const UserDetails: React.FC<AddressProps> = ({
  handleUserDetails
}) => {
  return (
    <PageWrap pt={0} title="Onboarding Details" align="center" justify="center">
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Let’s get to know you.</H3>
        <Text textAlign="left" fontSize="14px">
          Fill out some information about yourself to get started.
        </Text>
      </Flex>
      <SideSlider>
        <Formik
          validationSchema={AddressFormValidation}
          initialValues={{
            address: '',
            complex: '',
            suburb: '',
            city: '',
            postalCode: ''
          }}
          onSubmit={async (
            { address, complex, suburb, city, postalCode },
            { setStatus, setSubmitting }
          ) => {
            setStatus(null)
            try {
              setSubmitting(true)
              handleUserDetails({ address, complex, suburb, city, postalCode })
              setSubmitting(false)
            } catch (error) {
              setStatus(formatError(error))
            }
          }}
        >
          {({ isSubmitting, status }: FormikProps<AddressValues>) => (
            <Form style={{ width: '100%' }}>
              <Flex flexDirection="column">
                <ConnectedFormGroup
                  label="What is your first name?*"
                  name="address"
                  type="text"
                  placeholder="Eg. 12 Ridge Street"
                  mb={1}
                />
                <Image mb={2} alignSelf="flex-end" width="40%" src={images['PoweredByGoogle']} />
              </Flex>
              <ConnectedFormGroup
                label="Complex / Building (Optional)"
                name="complex"
                type="text"
                placeholder="Complex or Building Name, unit number or floor"
              />
              <ConnectedFormGroup label="Suburb*" name="suburb" type="text" />
              <ConnectedFormGroup label="City / Town*" name="city" type="text" />
              <ConnectedFormGroup label="Postal Code*" name="postalCode" type="text" />
              {status && (
                <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
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
                NEXT
              </Button>
            </Form>
          )}
        </Formik>
      </SideSlider>
    </PageWrap>
  )
}

export default UserDetails
