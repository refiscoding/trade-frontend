import * as React from 'react'
import { Flex, FormLabel } from '@chakra-ui/core'
import { Field } from 'formik'
import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedTextArea
} from '../../components/FormElements'
import { H3, Text } from '../../typography'
import ConnectedSelect from '../../components/FormElements/ConnectedSelect'

import { ErrorsObject } from "./index";

export type Options = {
  label: string
  value: string
}

type businessTypes = {
  categories: Options[]
  errors: ErrorsObject
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
  'Less than 200k',
  'R20k - R50k',
  'R50k - R100k',
  'R100k - R500k',
  'More than R500k'
]

const BusinessInfo: React.FC<businessTypes> = ({ categories, errors }) => {
  return (
    <React.Fragment>
      <Flex flexDirection="column" borderBottomColor="accent.600" borderBottomWidth={10}>
        <H3 my={4} fontWeight={500} textAlign="left">
          Information about your business
        </H3>
        <ConnectedFormGroup label="Company Name*" name="name" type="text" />
        <ConnectedSelect placeholder="Select a category" label="Category* " name="category" options={categories} />
        <FormLabel htmlFor="isVatRegistered">Are you VAT registered?*</FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={i} alignItems="center">
            <Field key={i} type="radio" name="isVatRegistered" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {
          errors["isVatRegistered"] && <Text color="red.500">{ errors["isVatRegistered"] }</Text>
        }
        <ConnectedFormGroup mt={3} label="Vat Number*" name="vatNumber" type="text" />
        <FormLabel htmlFor="revenue">Monthly Revenue*</FormLabel>
        {revenue.map((item: string, i: number) => (
          <Flex key={i} alignItems="center">
            <Field key={i} type="radio" name="revenue" value={item} />
            <Text ml={2}>{item}</Text>
          </Flex>
        ))}
        {
          errors["revenue"] && <Text color="red.500">{ errors["revenue"] }</Text>
        }
        <ConnectedFormGroup
          mt={3}
          label="Business Registration Number*"
          name="registrationNumber"
          type="text"
        />
        {
          errors["registrationNumber"] && <Text color="red.500">{ errors["registrationNumber"] }</Text>
        }
      </Flex>
      <Flex flexDirection="column" borderBottomColor="accent.600" borderBottomWidth={10}>
        <H3 my={4} fontWeight={500} textAlign="left">
          Tell us about your products
        </H3>
        <ConnectedNumberInput label="Number of unique products*" name="uniqueProducts" />
        <ConnectedTextArea label="What products do you sell?* " name="products" handleSetTags={() => {}}/>
        <FormLabel htmlFor="carryStock">Do you carry stock?*</FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={i} alignItems="center">
            <Field key={i} type="radio" name="carryStock" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {
          errors["carryStock"] && <Text color="red.500">{ errors["carryStock"] }</Text>
        }
        <FormLabel mt={3} htmlFor="hasPhysicalStore">Do you have a physical store?* </FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={i} alignItems="center">
            <Field key={i} type="radio" name="hasPhysicalStore" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {
          errors["hasPhysicalStore"] && <Text color="red.500">{ errors["hasPhysicalStore"] }</Text>
        }
        <FormLabel mt={3} htmlFor="isRetailSupplier">Are you a supplier to retail outlets?* </FormLabel>
        {options.map((item: Options, i: number) => (
          <Flex key={i} alignItems="center">
            <Field key={i} type="radio" name="isRetailSupplier" value={item.value} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        ))}
        {
          errors["isRetailSupplier"] && <Text color="red.500">{ errors["isRetailSupplier"] }</Text>
        }
        <FormLabel mt={3} htmlFor="businessType">I am a…*</FormLabel>
        {businessTypes.map((item: any, i: number) => (
          <Flex key={i} alignItems="center">
            <Field key={i} type="radio" name="businessType" value={item.value} />
            <Text ml={2}>{item.name}</Text>
          </Flex>
        ))}
         {
          errors["businessType"] && <Text color="red.500">{ errors["businessType"] }</Text>
        }
      </Flex>
    </React.Fragment>
  )
}

export default BusinessInfo
