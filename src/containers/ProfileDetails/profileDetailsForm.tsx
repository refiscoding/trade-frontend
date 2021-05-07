import * as React from 'react'
import { Button, Flex } from '@chakra-ui/core';
import { useMediaQuery } from "react-responsive";

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
};

const ProfileDetailForm: React.FC<formProps> = ({
  categories,
  handleUserDetails,
  initialValues
}) => {
  const isWebViewport = useMediaQuery({
    query: "(min-width: 40em)"
  });
  const styles = {
    width: isWebViewport ? "35%" : "100%",
    justifySelf: isWebViewport ? "center" : "",
  };
  return (
    <Flex flexDirection="column" width={styles.width} alignSelf={styles.justifySelf}>
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
            <ConnectedFormGroup label="Your First Name?" name="firstName" type="text" />
            <ConnectedFormGroup label="Your Last Name?" name="lastName" type="text" />
            <ConnectedFormGroup label="Your Email Address?" name="email" type="text" isDisabled={true} />
            <ConnectedFormGroup label="Your Phone Number?" name="phoneNumber" type="text" />
            <ConnectedFormGroup label="Your ID Number?" name="idNumber" type="text" />
            {/* <ConnectedFormGroup label="Your Address?" name="address" type="text" /> */}
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