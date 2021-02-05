import * as React from 'react'
import { get } from 'lodash'

import { PageWrap } from '../../layouts'
import { MotionFlex, Stepper } from '../../components'
import { useCategoryQuery } from '../../generated/graphql'
import { formatError } from '../../utils'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthProvider'
import { Button, Flex, useToast } from '@chakra-ui/core'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { H3, Text } from '../../typography'
import { Form, Formik, FormikProps } from 'formik'
import ProductInfo from './productInfo'
import ProductDetails from "./productDetails";

const Onboarding: React.FC = () => {
  const history = useHistory()
  const [active, setACtive] = React.useState(1)
  const toast = useToast()

  const { data } = useCategoryQuery({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const categories: any = get(data, 'categories', [])

  const mappedCategories = categories.map((category: any) => ({
    label: category.name,
    value: category.id
  }))

  return (
    <PageWrap title="Add Product" mt={10}>
      <Flex width="100%" mb={4} flexDirection="column">
        <H3 textAlign="left" fontSize={18} fontWeight={600}>
          Add Basic Product Information
        </H3>
      </Flex>
      <Formik
        validationSchema={{}}
        initialValues={{}}
        onSubmit={async (items, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status }: FormikProps<null>) => (
          <Form style={{ width: '100%' }}>
            <Stepper activeStep={active}>g
              <ProductInfo categories={mappedCategories} />
              <ProductDetails />
              <Flex></Flex>
            </Stepper>
            {status && (
              <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                <Text textAlign="right" color="red.500">
                  {status}
                </Text>
              </MotionFlex>
            )}
            <Button mt={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
              SUBMIT
            </Button>
          </Form>
        )}
      </Formik>
    </PageWrap>
  )
}

export default Onboarding
