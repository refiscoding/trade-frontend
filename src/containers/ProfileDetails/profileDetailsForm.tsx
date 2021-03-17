import * as React from 'react'
import { Button, Flex } from '@chakra-ui/core'

import { ConnectedCheckbox, ConnectedFormGroup } from '../../components/FormElements'
import { Form, Formik, FormikProps } from 'formik'
import { formatError } from '../../utils'
import { Category } from '../../generated/graphql'
import * as Yup from 'yup'

const DetailsValidation = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string(),
  categories: Yup.array().of(Yup.string())
})

export type profileValues = {
  firstName?: string
  lastName?: string
  email?: string
  categories?: string[]
}

type formProps = {
  categories?: Category[]
  handleUserDetails?: (values: profileValues) => void
  initialValues: profileValues
}

const ProfileDetailForm: React.FC<formProps> = ({
  categories,
  handleUserDetails,
  initialValues
}) => {
  return (
    <Flex flexDirection="column">
      <Formik
        validationSchema={DetailsValidation}
        initialValues={initialValues}
        onSubmit={async (details, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleUserDetails && handleUserDetails(details)
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting }: FormikProps<profileValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup label="Your first name?" name="firstName" type="text" />
            <ConnectedFormGroup label="Your last name?" name="lastName" type="text" />
            <ConnectedFormGroup label="Your Email Address?" name="email" type="text" />
            {categories?.map((item: any, i: number) => (
              <ConnectedCheckbox key={i} name="categories" label={item.name} value={item.id} />
            ))}
            <Button my={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
              SAVE
            </Button>
          </Form>
        )}
      </Formik>
    </Flex>
  )
}

export default ProfileDetailForm
