import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik, FormikProps,  } from 'formik'
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
  categories: Yup.array()
})

type CategoriesValues = {
  categories: any
}

const UserDetails: React.FC<CategoriesProps> = ({ handleUserDetails, categories }) => {
  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Let’s get to know you.</H3>
        <Text textAlign="left" fontSize="14px">
          Select a few categories you’re interested in.
        </Text>
      </Flex>
      <Formik
        validationSchema={CategoriesFormValidation}
        initialValues={{
          categories: []
        }}
        onSubmit={async ({ categories }, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            handleUserDetails({ categories })
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting }: FormikProps<CategoriesValues>) => (
          <Form style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
            {categories?.map((item: any, i: number) => (
                <Flex width="50%">
                    <ConnectedCheckbox key={i} name="categories" label={item.name} value={item.id} />
                </Flex>
            ))}
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
