import * as React from 'react'

import { Flex, FormLabel } from '@chakra-ui/core'
import { Field } from 'formik'

import { theme } from '../../theme'
import { ErrorsObject, SellerValues } from './index'
import { H3, Text } from '../../typography'
import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedTextArea
} from '../../components/FormElements'
import ConnectedSelect from '../../components/FormElements/ConnectedSelect'

export type Options = {
  label: string
  value: string
}

type businessTypes = {
  categories: Options[]
  countries: Options[]
  errors: ErrorsObject
  values: SellerValues
}

const options = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]

const businessTypes = [
  { name: 'Wholesaler', value: 'wholesaler' },
  { name: 'Distributor', value: 'distributor' },
  { name: 'Both', value: 'both' }
]

const revenue = [
  'Less than R 1 million',
  'R 1 - 2 million',
  'R 2 - 5 million',
  'R 5 - 10 million',
  'More than R 10 million'
]
const beeStatuses = [
  'Not Applicable',
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
  'Level 5',
  'Level 6',
  'Level 7',
  'Level 8'
]

const BusinessInfo: React.FC<businessTypes> = ({ categories, errors, countries, values }) => {
  const saidYesToVATRegistered = values?.isVatRegistered === 'true'
  return (
    <React.Fragment>
      <Flex
        flexDirection="column"
        background={theme.colors.accent[50]}
        mt={3}
        boxShadow={theme.boxShadowMedium}
        p={4}
        borderRadius={5}
      >
        <H3 mb={3} fontWeight={550} textAlign="left">
          Business Details
        </H3>
        <ConnectedFormGroup
          label="Company Name*"
          name="name"
          type="text"
          placeholder="Enter the name of your business"
        />
        <ConnectedFormGroup
          label="Business Registration Number*"
          name="registrationNumber"
          type="text"
          placeholder="Enter business registration number"
        />
        <ConnectedNumberInput
          label="Business Phone number*"
          name="businessPhoneNumber"
          unit="+27"
        />
        <ConnectedFormGroup
          label="Business Website"
          name="businessWebsite"
          type="text"
          placeholder="Eg. https://yourbusiness.com"
        />
        <ConnectedNumberInput label="Years of Operation*" name="yearsOfOperation" />
        <ConnectedSelect
          placeholder="Select a Category"
          label="Category* "
          name="category"
          options={categories}
        />
        <ConnectedSelect
          placeholder="Select a Country"
          label="Country of Operation* "
          name="location"
          options={countries}
        />

        <FormLabel htmlFor="isVatRegistered">Are you VAT registered?*</FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={`${i}_vat`} alignItems="center">
            <Field key={i} type="radio" name="isVatRegistered" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {errors['isVatRegistered'] && <Text color="red.500">{errors['isVatRegistered']}</Text>}

        {saidYesToVATRegistered && (
          <ConnectedFormGroup mt={3} label="VAT Number*" name="vatNumber" type="text" />
        )}

        <FormLabel mt={2} htmlFor="revenue">
          Annual Turnover*
        </FormLabel>
        {revenue.map((item: string, i: number) => (
          <Flex key={`${i}_revenue`} alignItems="center">
            <Field key={i} type="radio" name="revenue" value={item} />
            <Text ml={2}>{item}</Text>
          </Flex>
        ))}
        {errors['revenue'] && <Text color="red.500">{errors['revenue']}</Text>}

        <FormLabel mt={3} htmlFor="beeStatus">
          BEE Status*
        </FormLabel>
        {beeStatuses.map((item: string, i: number) => (
          <Flex key={`${i}_bee`} alignItems="center">
            <Field key={i} type="radio" name="beeStatus" value={item} />
            <Text ml={2}>{item}</Text>
          </Flex>
        ))}
        {errors['beeStatus'] && <Text color="red.500">{errors['beeStatus']}</Text>}
      </Flex>
      <Flex
        flexDirection="column"
        background={theme.colors.accent[50]}
        mt={3}
        boxShadow={theme.boxShadowMedium}
        p={4}
        borderRadius={5}
      >
        <H3 mb={4} fontWeight={550} textAlign="left">
          Product Description
        </H3>
        <ConnectedNumberInput label="Number of unique products*" name="uniqueProducts" />
        <ConnectedTextArea
          label="What products do you sell?* "
          name="products"
          handleSetTags={() => {}}
        />

        <FormLabel mt={3} htmlFor="businessType">
          I am a…*
        </FormLabel>
        {businessTypes.map((item: any, i: number) => (
          <Flex key={`${i}_type`} alignItems="center">
            <Field key={i} type="radio" name="businessType" value={item.value} />
            <Text ml={2}>{item.name}</Text>
          </Flex>
        ))}
        {errors['businessType'] && <Text color="red.500">{errors['businessType']}</Text>}

        <FormLabel mt={3} htmlFor="hasPhysicalStore">
          Do you have a physical store?*{' '}
        </FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={`${i}_store`} alignItems="center">
            <Field key={i} type="radio" name="hasPhysicalStore" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {errors['hasPhysicalStore'] && <Text color="red.500">{errors['hasPhysicalStore']}</Text>}

        <FormLabel mt={3} htmlFor="isRetailSupplier">
          Are you a supplier to retail outlets?*{' '}
        </FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={`${i}_supplier`} alignItems="center">
            <Field key={i} type="radio" name="isRetailSupplier" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {errors['isRetailSupplier'] && <Text color="red.500">{errors['isRetailSupplier']}</Text>}

        <FormLabel mt={3} htmlFor="hazChem">
          Do you deal in chemical products?*
        </FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={`${i}_chem`} alignItems="center">
            <Field key={i} type="radio" name="hazChem" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {errors['hazChem'] && <Text color="red.500">{errors['hazChem']}</Text>}
      </Flex>
    </React.Fragment>
  )
}

export default BusinessInfo
