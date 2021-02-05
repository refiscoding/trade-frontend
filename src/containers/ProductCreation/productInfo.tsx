import * as React from 'react'
import { Flex, FormLabel } from '@chakra-ui/core'

import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedSelect,
  ConnectedTextArea
} from '../../components/FormElements'
import { Options } from '../Seller/businessInfo'
import { Field } from 'formik'
import { Text } from '../../typography'
import { PlusSquare } from 'react-feather'

type ProductInfoTpes = {
  categories: Options[]
}

const packagingItems = [
  {
    label: 'Per Pack of Items',
    value: 'perPack'
  },
  {
    label: 'Per Liter',
    value: 'litre'
  },
  {
    label: 'Per Ton',
    value: 'ton'
  },
  {
    label: 'Per Kg',
    value: 'kg'
  }
]

const ProductInfo: React.FC<ProductInfoTpes> = ({ categories }) => {
  return (
    <Flex flexDirection="column">
      <ConnectedFormGroup label="Product Name" name="name" type="text" />
      <ConnectedTextArea label="Small Product Description" name="shortDescription" />
      <ConnectedSelect label="Select Category " name="category" options={categories} />
      <Flex flexDirection="column">
        <Flex mb={2} alignItems="center">
          <PlusSquare size={15} />
          <Text ml={2} fontSize={14}>
            Add another category
          </Text>
        </Flex>
      </Flex>
      <ConnectedTextArea label="Add Tags" name="tags" />
      <ConnectedNumberInput label="Price per Unit" name="phoneNumber" unit="R" />
      <ConnectedNumberInput label="Retail Price per Unit" name="phoneNumber" unit="R" />
      <ConnectedFormGroup
        label="How Many Units available to sell?"
        name="availableUnits"
        type="text"
      />
      <FormLabel htmlFor="packaging">How Is the product going to be packaged?</FormLabel>
      {packagingItems.map((item: Options, i: number) => (
        <Flex key={i} alignItems="center">
          <Field key={i} type="radio" name="packaging" value={item.value} />
          <Text ml={2}>{item.label}</Text>
        </Flex>
      ))}
      <ConnectedFormGroup label="How Many Items Are in a pack" name="itemsPerPackage" type="text" />
    </Flex>
  )
}

export default ProductInfo
