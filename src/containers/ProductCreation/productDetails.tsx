import * as React from 'react'
import { Flex, FormLabel } from '@chakra-ui/core'

import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedTextArea,
  ConnectedFileUploader
} from '../../components/FormElements'
import { Text } from '../../typography'
import { Options } from '../Seller/businessInfo'
import { Field } from 'formik'
import { PlusSquare } from 'react-feather'

const options: Options[] = [
  { label: 'Per Colour', value: 'colour' },
  { label: 'Per Size', value: 'size' }
]

const ProductDetails: React.FC = () => {
  return (
    <Flex flexDirection="column">
      <FormLabel htmlFor="packaging">Add Product Images (0/5)</FormLabel>
      <ConnectedFileUploader placeholder="Cover Image" name="coverImage" />
      <ConnectedFileUploader isMulti placeholder="Add Another Image" name="productImages" />
      <ConnectedTextArea label="Product Description" name="description" />
      <ConnectedFormGroup label="List Product Features" name="features" type="text" />
      <Flex mb={2} alignItems="center">
        <PlusSquare size={15} />
        <Text ml={2} fontSize={14}>
          Add another feature
        </Text>
      </Flex>
      <FormLabel htmlFor="packaging">Product Variations (Optional)</FormLabel>
      {options.map((item: Options, i: number) => (
        <Flex key={i} alignItems="center">
          <Field key={i} type="radio" name="packaging" value={item.value} />
          <Text ml={2}>{item.label}</Text>
        </Flex>
      ))}
      <ConnectedNumberInput label="Product Height" name="height" unit="mm" />
      <ConnectedNumberInput label="Product Length" name="length" unit="mm" />
      <ConnectedNumberInput label="Product Width" name="width" unit="mm" />
      <ConnectedNumberInput label="Product Weight" name="weight" unit="Kg" />
    </Flex>
  )
}

export default ProductDetails
