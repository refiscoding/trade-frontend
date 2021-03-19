import * as React from 'react'
import { get } from 'lodash'

import { PageWrap } from '../../layouts'
import { MotionFlex } from '../../components'
import { Category, useCategoryQuery } from '../../generated/graphql'
import { formatError } from '../../utils'
import { Button, Flex, Text, FormLabel, useToast } from '@chakra-ui/core'
import { ERROR_TOAST } from '../../constants'
import { H3 } from '../../typography'
import { FieldArray, Form, Formik, FormikProps } from 'formik'
import { Options } from '../Seller/businessInfo'
import * as Yup from 'yup'
import { ConnectedFormGroup, ConnectedSelect } from '../../components/FormElements'
import {PlusSquare, XCircle} from 'react-feather'
import { useHistory } from 'react-router-dom'
import { ApolloError } from 'apollo-client'
import { useMediaQuery } from 'react-responsive'

const ProductFormValidation = Yup.object().shape({
  minPrice: Yup.string(),
  maxPrice: Yup.string(),
  category: Yup.array().of(Yup.string()),
  country: Yup.string()
})

export type ProductValues = {
  minPrice: string
  maxPrice: string
  category: string[]
  country: string
}

const initialValues = {
  minPrice: '',
  maxPrice: '',
  category: [''],
  country: ''
}

const ProductFilter: React.FC = () => {
  const toast = useToast()
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const { data } = useCategoryQuery({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
  })

  const categories = get(data, 'categories', null) as Category[]

  const mappedCategories = categories?.map((category: Category) => ({
    label: category.name,
    value: category.id
  })) as Options[]

  const handleClearFilters = () => {
    history.push(`/`)
  }

  const handleSelectFilters = (values: ProductValues) => {
    const { minPrice, maxPrice, category } = values
    history.push(`/?minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}`)
  }

  return (
    <PageWrap title="Add Product" alignSelf="center" width={isTabletOrMobile ? '100%' : '40%'}>
      <Flex width="100%" mb={4} justifyContent="space-between">
        <H3 textAlign="left" fontSize={18} fontWeight={600}>
          Filtering Options
        </H3>
        <Text
          color="accent.500"
          textDecoration="underline"
          fontSize="12px"
          onClick={() => handleClearFilters()}
        >
          Clear Filters
        </Text>
      </Flex>
      <Formik
        validationSchema={ProductFormValidation}
        initialValues={initialValues}
        onSubmit={async (items, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            await handleSelectFilters(items)
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, values }: FormikProps<ProductValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup
              label="Min Price"
              placeholder="Select and option..."
              name="minPrice"
              type="text"
            />
            <ConnectedFormGroup
              label="Max Price"
              placeholder="Select and option..."
              name="maxPrice"
              type="text"
            />
            <FormLabel htmlFor="category">Select Category</FormLabel>
            <FieldArray
              name="category"
              render={(arrayHelpers) => {
                const userCategories = values.category
                return (
                  <Flex flexDirection="column">
                    {userCategories?.map((category: string, index: number) => (
                      <Flex key={index} alignItems="center">
                        <ConnectedSelect placeholder="Select a category" name={`category.[${index}]`} options={mappedCategories} />
                        <Flex
                          ml={2}
                          mb={4}
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <XCircle />
                        </Flex>
                      </Flex>
                    ))}
                    <Flex onClick={() => arrayHelpers.push('')} mb={2} alignItems="center">
                      <PlusSquare size={15} />
                      <Text ml={2} fontSize={14}>
                        Add another category
                      </Text>
                    </Flex>
                  </Flex>
                )
              }}
            />
            <ConnectedFormGroup
              label="Select Country"
              placeholder="Select and option..."
              name="country"
              type="text"
            />
            {status && (
              <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                <Text textAlign="right" color="red.500">
                  {status}
                </Text>
              </MotionFlex>
            )}
            <Button mt={4} width="100%" type="submit" variantColor="brand" isLoading={isSubmitting}>
              APPLY
            </Button>
          </Form>
        )}
      </Formik>
    </PageWrap>
  )
}

export default ProductFilter
