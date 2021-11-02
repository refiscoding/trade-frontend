import * as React from 'react'

import { Button, Flex, Image } from '@chakra-ui/core'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { Category } from '../../generated/graphql'
import { ConnectedCheckbox } from '../../components/FormElements'
import { Form, Formik, FormikProps } from 'formik'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'

type CategoriesProps = {
  handleUserDetails: (details: any) => void
  categories?: any
}

type CategoriesValues = {
  categories: Category[]
}

const UserDetails: React.FC<CategoriesProps> = ({ categories, handleUserDetails }) => {
  return (
    <React.Fragment>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left">Which industries are you interested in?</H3>
        <Flex
          mt={3}
          background={theme.colors.info}
          p={2}
          width="100%"
          height="40px"
          alignItems="center"
          justifyItems="space-between"
        >
          <Image src={images.infoIcon} height="50%" />
          <Text fontSize={12} ml={3}>
            Please select an industry or industries of interest to continue
          </Text>
        </Flex>
      </Flex>
      <Formik
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
                  label={item.name && capitalizeFirstLetter(item.name)}
                  value={item.id}
                  hideError={true}
                />
              </Flex>
            ))}
            <Button
              mt={4}
              width="100%"
              type="submit"
              variantColor="brand"
              isLoading={isSubmitting}
              isDisabled={values && values.categories?.length < 1 ? true : false}
            >
              DONE
            </Button>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default UserDetails
