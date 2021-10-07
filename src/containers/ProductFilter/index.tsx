import * as React from 'react'
import * as Yup from 'yup'

import { Button, Flex, Text, FormLabel, IconButton } from '@chakra-ui/core'
import { CATEGORIES } from '../../constants'
import { ConnectedCheckbox, ConnectedFormGroup } from '../../components/FormElements'
import { Form, Formik, FormikProps } from 'formik'
import { formatError } from '../../utils'
import { H3 } from '../../typography'
import { MotionFlex } from '../../components'
import { PageWrap } from '../../layouts'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { ArrowLeft } from 'react-feather'

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
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const handleClearFilters = () => {
    history.push(`/`)
  }

  const handleSelectFilters = (values: ProductValues) => {
    const { minPrice, maxPrice, category } = values
    history.push(`/?minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}`)
  }

  const navigateToProfile = () => {
    history.push(`/profile`)
  }

  return (
    <PageWrap
      mt={10}
      title="Add Product"
      alignSelf="center"
      width={isTabletOrMobile ? '100%' : '40%'}
    >
      <Flex alignSelf="flex-start" pt={4} pb={4}>
        <IconButton
          icon={ArrowLeft}
          aria-label="Go to Profile"
          backgroundColor="transparent"
          onClick={() => navigateToProfile()}
        />
        <H3 textAlign="left" fontSize={14} fontWeight={700} pl={4} style={{ placeSelf: 'center' }}>
          Back to Profile
        </H3>
      </Flex>
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
        {({ isSubmitting, status }: FormikProps<ProductValues>) => (
          <Form style={{ width: '100%' }}>
            <ConnectedFormGroup
              label="Minimum Price"
              placeholder="Select an option..."
              name="minPrice"
              type="text"
            />
            <ConnectedFormGroup
              label="Maximum Price"
              placeholder="Select an option..."
              name="maxPrice"
              type="text"
            />
            <FormLabel htmlFor="category">Select Category</FormLabel>
            {CATEGORIES?.map((item: any, i: number) => (
              <Flex width="50%" key={`${i}-container`}>
                <ConnectedCheckbox key={i} name="categories" label={item.name} value={item.id} />
              </Flex>
            ))}
            <ConnectedFormGroup
              label="Select Country"
              placeholder="Select an option..."
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
