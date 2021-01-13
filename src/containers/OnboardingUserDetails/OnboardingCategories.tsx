import { Button, Flex } from '@chakra-ui/core'
import { Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { SideSlider } from '../../components'
import { ConnectedCheckbox } from '../../components/FormElements'
import { PageWrap } from '../../layouts'
import { H3, Text } from '../../typography'
import { formatError } from '../../utils'

type CategoriesProps = {
  handleUserDetails: (details: any) => void
}

const categories = [
  { label: 'Mens', value: 1 },
  { label: 'Mens', value: 1 },
  { label: 'Mens', value: 1 },
  { label: 'Mens', value: 1 },
  { label: 'Mens', value: 1 },
  { label: 'Mens', value: 1 }
]

const CategoriesFormValidation = Yup.object().shape({
  categories: Yup.array()
})

type CategoriesValues = {
  categories: any
}

const UserDetails: React.FC<CategoriesProps> = ({
  handleUserDetails
}) => {
  return (
    <PageWrap pt={0} title="Onboarding Details" align="center" justify="center">
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Let’s get to know you.</H3>
        <Text textAlign="left" fontSize="14px">
          Select a few categories you’re interested in.
        </Text>
      </Flex>
      <SideSlider>
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
            <Form style={{ width: '100%' }}>
              {categories.map((item, i) => (
                <ConnectedCheckbox key={i} reverse name={item.label} label={item.label} />
              ))}
              <Button
                mt={4}
                width="100%"
                type="submit"
                variantColor="brand"
                isLoading={isSubmitting}
              >
                DONE
              </Button>
            </Form>
          )}
        </Formik>
      </SideSlider>
    </PageWrap>
  )
}

export default UserDetails
