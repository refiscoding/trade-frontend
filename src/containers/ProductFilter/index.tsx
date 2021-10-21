import * as React from 'react'
import * as Yup from 'yup'

import { Button, Flex, Text, FormLabel } from '@chakra-ui/core'
import { CATEGORIES } from '../../constants'
import {
  ConnectedCheckbox,
  ConnectedFormGroup,
  ConnectedSelect
} from '../../components/FormElements'
import { Form, Formik, FormikProps } from 'formik'
import { formatError } from '../../utils'
import { H3 } from '../../typography'
import { MotionFlex } from '../../components'
import { PageWrap } from '../../layouts'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { theme } from '../../theme'

const ProductFormValidation = Yup.object().shape({
  minPrice: Yup.string(),
  maxPrice: Yup.string(),
  category: Yup.array().of(Yup.string()),
  country: Yup.string()
})

export type Options = {
  label: string
  value: string
}

type ProductTypes = {
  countries: Options[]
}

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

const ProductFilter: React.FC<ProductTypes> = ({ countries }) => {
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const handleClearFilters = () => {
    history.push(`/`)
  }

  const handleSelectFilters = (values: ProductValues) => {
    const { minPrice, maxPrice, category } = values
    history.push(`/?minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}`)
  }

  // const navigateToPreviousPage = () => {
  //  history.goBack()
  // }

  return (
    <PageWrap
      mt={10}
      title="Add Product"
      alignSelf="center"
      width={isTabletOrMobile ? '100%' : '40%'}
    >
      {/* <Flex alignSelf="flex-start" pt={4} pb={4}>
        <IconButton
          icon={ArrowLeft}
          aria-label="Go "
          backgroundColor="transparent"
          onClick={() => navigateToPreviousPage()}
        />
        <H3 textAlign="left" fontSize={14} fontWeight={700} pl={4} style={{ placeSelf: 'center' }}>
          Back
        </H3>
      </Flex> */}
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
            <ConnectedSelect
              label="Select Country"
              placeholder="Select a country..."
              name="country"
              options={countries}
            />
            {status && (
              <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                <Text textAlign="right" color="red.500">
                  {status}
                </Text>
              </MotionFlex>
            )}
            <Button
              ml={1}
              mt={4}
              variantColor="brand"
              type="submit"
              isLoading={isSubmitting}
              width="250px"
            >
              <Text>APPLY</Text>
            </Button>
            <Button
              mt={4}
              ml={8}
              width="250px"
              onClick={() => {
                history.goBack()
              }}
              border={`1px solid ${theme.colors.brand[700]}`}
              background="white"
            >
              <Text>CANCEL</Text>
            </Button>
          </Form>
        )}
      </Formik>
    </PageWrap>
  )
}

export default ProductFilter
