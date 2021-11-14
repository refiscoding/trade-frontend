/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'
import * as Yup from 'yup'
import { get } from 'lodash'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import {
  Category,
  Country,
  Enum_Componentlocationaddress_Type,
  Maybe,
  useCategoryQuery,
  useUpdateMyBusinessMutation,
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
import DispatchSecondaryContact from './dispatchSecondaryContact'

const SellerFormValidation = Yup.object().shape({
  addressName: Yup.string().required('Address name is required'),
  annualTurnover: Yup.string().required('Annual turnover is required'),
  beeStatus: Yup.string().required('BEE status is required'),
  businessPhoneNumber: Yup.string().required('Business/ work phone number is required'),
  city: Yup.string().required('City is required'),
  companyName: Yup.string().required('Company name is required'),
  dispatchSecondaryEmailAddress: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  dispatchSecondaryFirstName: Yup.string().required('Name is required'),
  dispatchSecondaryPhoneNumber: Yup.string().required('Cell phone number is required'),
  dispatchSecondarySurname: Yup.string().required('Surname is required'),
  firstName: Yup.string().required('Name is required'),
  hazChem: Yup.string().when('isHazChem', {
    is: (isHazChem) => isHazChem === true,
    then: Yup.string().required('Description of the hazardous chemicals is required')
  }),
  headQuater: Yup.string().required('Head office is required'),
  isHazChem: Yup.boolean().required('Haz Chem status is required'),
  isVatRegistered: Yup.boolean().required('VAT Registration Status is required'),
  lastName: Yup.string().required('Surname is required'),
  phoneNumber: Yup.string().required('Cell phone number is required'),
  position: Yup.string().required('Company position is required'),
  postalCode: Yup.string().required('Postal code is required'),
  products: Yup.string().required('Product description is required'),
  province: Yup.string().required('Province is required'),
  registrationNumber: Yup.string().required('Business registration number is required'),
  street: Yup.string().required('Street address is required'),
  suburb: Yup.string().required('Suburb is required'),
  vatNumber: Yup.string().when('isVatRegistered', {
    is: (isVatRegistered) => isVatRegistered === true,
    then: Yup.string().required('VAT number is required')
  }),
  yearsInOperation: Yup.string().required('Number of years in operation is required')
  // categories: Yup.array().required('Business category is required'),
  // countries: Yup.array().required('Countries of operation is required'),
})

export type ErrorsObject = {
  addressName: string | undefined
  beeStatus: string | undefined
  businessPhoneNumber: string | undefined
  city: string | undefined
  companyName: string | undefined
  dispatchSecondaryEmailAddress: string | undefined
  dispatchSecondaryFirstName: string | undefined
  dispatchSecondaryPhoneNumber: string | undefined
  dispatchSecondarySurname: string | undefined
  firstName: string | undefined
  hazChem: string | undefined
  headQuater: string | undefined
  isHazChem: boolean | undefined
  isVatRegistered: boolean | undefined
  lastName: string | undefined
  phoneNumber: string | undefined
  position: string | undefined
  postalCode: string | undefined
  products: string | undefined
  province: string | undefined
  registrationNumber: string | undefined
  annualTurnover: string | undefined
  street: string | undefined
  suburb: string | undefined
  vatNumber: string | undefined
  yearsInOperation: string | undefined
}

export type TouchedErrors = {
  addressName: boolean | undefined
  beeStatus: boolean | undefined
  businessPhoneNumber: boolean | undefined
  city: boolean | undefined
  companyName: boolean | undefined
  dispatchSecondaryEmailAddress: boolean | undefined
  dispatchSecondaryFirstName: boolean | undefined
  dispatchSecondaryPhoneNumber: boolean | undefined
  dispatchSecondarySurname: boolean | undefined
  firstName: boolean | undefined
  hazChem: boolean | undefined
  headQuater: boolean | undefined
  isHazChem: boolean | undefined
  isVatRegistered: boolean | undefined
  lastName: boolean | undefined
  phoneNumber: boolean | undefined
  position: boolean | undefined
  postalCode: boolean | undefined
  products: boolean | undefined
  province: boolean | undefined
  registrationNumber: boolean | undefined
  annualTurnover: boolean | undefined
  street: boolean | undefined
  suburb: boolean | undefined
  vatNumber: boolean | undefined
  yearsInOperation: boolean | undefined
}

export type SellerValues = {
  addressName: string
  beeStatus: string
  building: string
  businessPhoneNumber: string
  categories: string[]
  city: string
  countries: string[]
  companyName: string
  companyRelated: string
  dispatchSecondaryEmailAddress: string
  dispatchSecondaryFirstName: string
  dispatchSecondaryPhoneNumber: string
  dispatchSecondarySurname: string
  errors?: ErrorsObject
  firstName: string
  hazChem: string
  headQuater: string
  isHazChem: boolean
  isVatRegistered: boolean
  lastName: string
  phoneNumber: string
  position: string
  postalCode: string
  products: Maybe<Maybe<string>> | undefined
  province: string
  registrationNumber: string
  annualTurnover: string
  street: string
  suburb: string
  suppliedBrands: string
  vatNumber: string
  website?: string
  yearsInOperation: string
}

const initialValues = {
  addressName: '',
  building: '',
  categories: [],
  city: '',
  countries: [],
  dispatchSecondaryEmailAddress: '',
  dispatchSecondaryFirstName: '',
  dispatchSecondaryPhoneNumber: '',
  dispatchSecondarySurname: '',
  hazChem: '',
  headQuater: '',
  hubCode: '',
  isHazChem: false,
  location: '',
  postalCode: '',
  products: '' || undefined,
  province: '',
  street: '',
  suburb: '',
  suppliedBrands: ''
}

const Seller: React.FC = () => {
  const { user, setUser } = useAuthContext()
  const history = useHistory()
  const toast = useToast()
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  const [selectedHub, setSelectedHub] = useState('')

  const { data } = useCategoryQuery({
    onError: (err: any) => formatError(err)
  })
  const { data: countriesData } = useFetchCountriesQuery()

  const autofillDetails = {
    ...initialValues,
    beeStatus: user?.business?.beeStatus || '',
    businessPhoneNumber: user?.business?.phoneNumber || '',
    companyName: user?.business?.companyName || '',
    companyRelated: user?.business?.companyRelated || '',
    firstName: user?.firstName || '',
    isVatRegistered: user?.business?.isVatRegistered || false,
    lastName: user?.lastName || '',
    otherPosition: user?.business?.otherPosition || '',
    phoneNumber: user?.phoneNumber || '',
    position: user?.business?.position || '',
    registrationNumber: user?.business?.registrationNumber || '',
    annualTurnover: user?.business?.annualTurnover || '',
    vatNumber: user?.business?.vatNumber || '',
    website: user?.business?.website || '',
    yearsInOperation: user?.business?.yearsInOperation || ''
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

  const [updateMyBusiness] = useUpdateMyBusinessMutation({
    onError: (err: any) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async () => {
      toast({ description: 'Business details updated!', ...SUCCESS_TOAST })
    }
  })

  const handleSubmit = async (values: SellerValues) => {
    const {
      addressName,
      beeStatus,
      building,
      businessPhoneNumber,
      website,
      city,
      companyName,
      companyRelated,
      dispatchSecondaryEmailAddress,
      dispatchSecondaryFirstName,
      dispatchSecondaryPhoneNumber,
      dispatchSecondarySurname,
      firstName,
      hazChem,
      headQuater,
      isHazChem,
      isVatRegistered,
      lastName,
      phoneNumber,
      position,
      postalCode,
      products,
      province,
      registrationNumber,
      annualTurnover,
      street,
      suburb,
      suppliedBrands,
      vatNumber,
      yearsInOperation
    } = values
    const businessInput = {
      beeStatus,
      categories: categories.map((category: any) => category.id),
      companyName,
      companyRelated,
      countries: countries.map((country: any) => country.id),
      hazChem,
      headQuater,
      isHazChem: Boolean(isHazChem),
      isVatRegistered: Boolean(isVatRegistered),
      phoneNumber: businessPhoneNumber,
      position,
      productsSummary: products,
      registrationNumber,
      annualTurnover,
      secondaryEmailAddress: dispatchSecondaryEmailAddress,
      secondaryFirstName: dispatchSecondaryFirstName,
      secondaryPhoneNumber: dispatchSecondaryPhoneNumber,
      secondarySurname: dispatchSecondarySurname,
      suppliedBrands,
      vatNumber,
      website: website,
      yearsInOperation,
      dispatchAddress: {
        building,
        city,
        hubCode: selectedHub,
        name: addressName,
        postalCode,
        province,
        street,
        suburb,
        type: Enum_Componentlocationaddress_Type.Business
      }
    }

    const userDetails = {
      firstName,
      lastName,
      phoneNumber
    }
    await updateMyBusiness({ variables: { input: businessInput } })
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
        <H3 textAlign="center">Apply to sell on tradeFed</H3>
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
              <DispatchAddress setFieldValue={setFieldValue} setSelectedHub={setSelectedHub} />
              <DispatchSecondaryContact />
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
