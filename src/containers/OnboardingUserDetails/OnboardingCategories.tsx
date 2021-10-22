import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { ConnectedCheckbox } from '../../components/FormElements'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

type CategoriesProps = {
  handleUserDetails: (details: any) => void
  categories?: any
}

const CategoriesFormValidation = Yup.object().shape({
  categories: Yup.array().required('Category is required')
})

type CategoriesValues = {
  categories: any
}

const UserDetails: React.FC<CategoriesProps> = ({ categories, handleUserDetails }) => {
  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Which Industries are you interested in?</H3>
      </Flex>
      <Formik
        validationSchema={CategoriesFormValidation}
        initialValues={{
          categories: []
        }}
        onSubmit={async ({ categories: formCategories }, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleUserDetails({ categories: formCategories })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, values }: FormikProps<CategoriesValues>) => (
          <Form style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
            {categories?.map((item: any, i: number) => (
              <Flex width="50%" key={`${i}-container`}>
                <ConnectedCheckbox
                  key={i}
                  name="categories"
                  label={item.name}
                  value={item.id}
                  hideError={true}
                />
              </Flex>
            ))}
            {values && values.categories?.length < 1 && (
              <Flex width="100%" key={`category-error-container`} justifyContent="center">
                <Text color="red.500" textAlign="right" margin={4}>
                  {`Category is required`}
                </Text>
              </Flex>
            )}
            <Button mt={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
              DONE
            </Button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default UserDetails
