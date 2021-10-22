/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'
import * as Yup from 'yup'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import {
  Category,
  Country,
  Enum_Componentlocationaddress_Type,
  Maybe,
  useCategoryQuery,
  useCreateMyBusinessMutation,
  useFetchCountriesQuery,
  useUpdateSelfMutation
} from '../../generated/graphql'
import { Button, Flex, useToast, Image } from '@chakra-ui/core'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import { Form, Formik, FormikProps } from 'formik'
import { formatError } from '../../utils'
import { H3, Text } from '../../typography'
import { images, theme } from '../../theme'
import { MotionFlex } from '../../components'
import { PageWrap } from '../../layouts'
import { useAuthContext } from '../../context/AuthProvider'

import BusinessInfo from './businessInfo'
import DispatchAddress from './dispatchAddress'
import PersonalInfo from './personalInfo'

const SellerFormValidation = Yup.object().shape({
  beeStatus: Yup.string().required('BEE Status is required'),
  building: Yup.string().required('Building is required'),
  businessPhoneNumber: Yup.string().required('Business Phone Number is required'),
  businessType: Yup.string().required('Business Type is required'),
  categories: Yup.array().required('Business Category is required'),
  city: Yup.string().required('City / Town is required'),
  email: Yup.string().email('Please enter a valid email address').required('An email is required'),
  firstName: Yup.string().required('First Name is required'),
  hasPhysicalStore: Yup.boolean().required('Physical Presence is required'),
  hazChem: Yup.string(),
  headQuater: Yup.string().required('Business Head Quater is required'),
  isHazChem: Yup.boolean().required('Haz Chem status is required'),
  isRetailSupplier: Yup.boolean().required('Retail Supplier Status is required'),
  isVatRegistered: Yup.boolean().required('VAT Registration Status is required'),
  lastName: Yup.string().required('Last Name is required'),
  name: Yup.string().required('Business Name is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  position: Yup.string().required('Company Position is required'),
  postalCode: Yup.string().required('Postal Code is required'),
  products: Yup.string().required('Product Description is required'),
  province: Yup.string().required('Province is required'),
  registrationNumber: Yup.string().required('Registration Number is required'),
  revenue: Yup.string().required('Revenue Range is required'),
  street: Yup.string().required('Street Address is required'),
  suburb: Yup.string().required('Suburb is required'),
  suppliedBrands: Yup.string().required('List of brands is required'),
  uniqueProducts: Yup.string().required('Number of Unique Products is required'),
  vatNumber: Yup.string().when('isVatRegistered', {
    is: (isVatRegistered) => isVatRegistered === true,
    then: Yup.string().required('A VAT number is required if your business is VAT registered')
  }),
  yearsInOperation: Yup.number().required('Years of Operation is required')
})

export type ErrorsObject = {
  beeStatus?: string | undefined
  building: string | undefined
  businessType?: string | undefined
  city: string | undefined
  hasPhysicalStore?: boolean | undefined
  hazChem?: string | undefined
  // headQuater: string | undefined
  isHazChem?: boolean | undefined
  isRetailSupplier?: boolean | undefined
  isVatRegistered?: boolean | undefined
  position?: string | undefined
  postalCode: string | undefined
  province: string | undefined
  registrationNumber?: string | undefined
  revenue?: string | undefined
  street: string | undefined
  suburb: string | undefined
}

export type TouchedErrors = {
  beeStatus?: boolean | undefined
  building: boolean | undefined
  businessType?: boolean | undefined
  city: boolean | undefined
  hasPhysicalStore?: boolean | undefined
  // headQuater?: boolean | undefined
  isHazChem?: boolean | undefined
  isRetailSupplier?: boolean | undefined
  isVatRegistered?: boolean | undefined
  position?: boolean | undefined
  postalCode: boolean | undefined
  province: boolean | undefined
  registrationNumber?: boolean | undefined
  revenue?: boolean | undefined
  street: boolean | undefined
  suburb: boolean | undefined
  //hazChem?: boolean | undefined
}

export type SellerValues = {
  beeStatus: string
  businessPhoneNumber: string
  businessType?: string
  businessWebsite?: string
  categories: string[]
  countries: string[]
  email: string
  errors?: ErrorsObject
  firstName: string
  hasPhysicalStore: boolean
  hazChem: string
  // headQuater: string
  isHazChem: boolean
  isRetailSupplier: boolean
  isVatRegistered: boolean
  lastName: string
  location: string
  name: string
  phoneNumber?: string
  position: string
  products: Maybe<Maybe<string>> | undefined
  registrationNumber: string
  revenue: string
  suppliedBrands: string
  uniqueProducts: string
  vatNumber: string
  yearsInOperation: number
  street: string
  province: string
  building: string
  city: string
  suburb: string
  postalCode: string
}

const initialValues = {
  location: '',
  products: '' || undefined,
  suppliedBrands: '',
  uniqueProducts: '',
  street: '',
  province: '',
  building: '',
  city: '',
  suburb: '',
  postalCode: ''
}

const Seller: React.FC = () => {
  const { user, setUser } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })
  const { data: countriesData } = useFetchCountriesQuery()

  const autofillDetails = {
    ...initialValues,
    beeStatus: user?.business?.beeStatus || '',
    businessPhoneNumber: user?.business?.phoneNumber || '',
    businessType: user?.business?.businessType || '',
    companyRelated: user?.business?.companyRelated || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    hasPhysicalStore: user?.business?.hasPhysicalStore || false,
    hazChem: user?.business?.hazChem || '',
    // headQuater: user?.business?.headQuater || '',
    isHazChem: user?.business?.isHazChem || false,
    isRetailSupplier: user?.business?.isRetailSupplier || false,
    isVatRegistered: user?.business?.isVatRegistered || false,
    lastName: user?.lastName || '',
    name: user?.business?.owner?.companyName || '',
    phoneNumber: user?.phoneNumber || '',
    position: user?.position || '',
    registrationNumber: user?.business?.registrationNumber || '',
    revenue: user?.business?.annualTurn || '',
    vatNumber: user?.business?.vatNumber || '',
    websiteAddress: user?.business?.websiteAddress || '',
    yearsInOperation: user?.business?.yearsInOperation || 0,
    countries: [],
    categories: []
  }

  useEffect(() => {
    if (user?.isSeller === 'pending') {
      history.push('/seller-approval')
    }
  }, [history, user])

  const categories: any = get(data, 'categories', [])
  const countries: any = get(countriesData, 'countries', [])

  const mappedCategories = categories.map((category: Category) => ({
    label: category.name,
    value: category.id
  }))
  const mappedCountries = countries.map((country: Country) => ({
    label: country.name,
    value: country.id
  }))

  const [updateSelf] = useUpdateSelfMutation({
    onError: (err: any) => formatError(err),
    onCompleted: async ({ updateSelf }) => {
      if (updateSelf?.profileCompleted && setUser) {
        setUser(updateSelf)
        if (updateSelf?.isSeller === 'pending') {
          history.push('/seller-approval')
        }
      }
    }
  })

  const [createMyBusiness] = useCreateMyBusinessMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Business details updated!', ...SUCCESS_TOAST })
    }
  })

  const handleSubmit = async (values: SellerValues) => {
    const {
      email,
      revenue,
      hazChem,
      categories,
      countries,
      products,
      lastName,
      isHazChem,
      // headQuater,
      beeStatus,
      firstName,
      vatNumber,
      phoneNumber,
      businessType,
      uniqueProducts,
      suppliedBrands,
      isVatRegistered,
      businessWebsite,
      isRetailSupplier,
      hasPhysicalStore,
      yearsInOperation,
      registrationNumber,
      businessPhoneNumber,
      street,
      building,
      province,
      city,
      suburb,
      postalCode
    } = values
    const businessInput = {
      revenue,
      hazChem,
      beeStatus,
      vatNumber,
      businessType,
      uniqueProducts,
      // headQuater,
      suppliedBrands,
      yearsInOperation,
      registrationNumber,
      countries: countries,
      categories: categories,
      productsSummary: products,
      isHazChem: Boolean(isHazChem),
      websiteAddress: businessWebsite,
      phoneNumber: businessPhoneNumber,
      isVatRegistered: Boolean(isVatRegistered),
      hasPhysicalStore: Boolean(hasPhysicalStore),
      isRetailSupplier: Boolean(isRetailSupplier),
      dispatchAddress: {
        street,
        building,
        province,
        city,
        suburb,
        postalCode,
        type: Enum_Componentlocationaddress_Type.Business
      }
    }

    const userDetails = {
      firstName,
      lastName,
      email,
      phoneNumber
    }
    await createMyBusiness({ variables: { input: businessInput } })
    await updateSelf({ variables: { input: { ...userDetails } } })
  }

  return (
    <PageWrap
      pt={0}
      title="Seller Details"
      mt={20}
      width={isTabletOrMobile ? '100%' : '40%'}
      alignSelf="center"
    >
      <Flex width="100%" my={4} flexDirection="column" borderRadius={3}>
        <H3 textAlign="center">Apply to sell on TradeFed</H3>
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
            To continue to be a seller, you need to go through a credit check process as well.
          </Text>
        </Flex>
      </Flex>
      <Formik
        validationSchema={SellerFormValidation}
        initialValues={autofillDetails}
        onSubmit={async (items, { setStatus, setSubmitting }) => {
          setStatus(null)
          try {
            setSubmitting(true)
            await handleSubmit(items)
            setSubmitting(false)
          } catch (error) {
            setStatus(formatError(error))
          }
        }}
      >
        {({ isSubmitting, status, values, setFieldValue }: FormikProps<SellerValues>) => {
          return (
            <Form style={{ width: '100%' }}>
              <PersonalInfo />
              <BusinessInfo
                categories={mappedCategories}
                countries={mappedCountries}
                values={values}
                setFieldValue={setFieldValue}
              />
              <DispatchAddress setFieldValue={setFieldValue} />
              {status && (
                <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} mb={2} width="100%">
                  <Text textAlign="right" color="red.500">
                    {status}
                  </Text>
                </MotionFlex>
              )}
              <Button
                mt={4}
                width="100%"
                type="submit"
                variantColor="brand"
                isLoading={isSubmitting}
              >
                SUBMIT
              </Button>
            </Form>
          )
        }}
      </Formik>
    </PageWrap>
  )
}

export default Seller
