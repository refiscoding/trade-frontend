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
import { Field, FieldArray } from 'formik'
import {File, PlusSquare, XCircle} from 'react-feather'
import { ProductValues } from './index'

type ProductDetailsTypes = {
  values: ProductValues
  setImage: (value: File[]) => void
}

const options: Options[] = [
  { label: 'Per Colour', value: 'color' },
  { label: 'Per Size', value: 'size' }
]

const ProductDetails: React.FC<ProductDetailsTypes> = ({ values, setImage }) => {
  return (
    <Flex flexDirection="column">
      <FormLabel htmlFor="packaging">Add Product Images (0/5)</FormLabel>
      <ConnectedFileUploader placeholder="Cover Image" name="coverImage" setImages={setImage} />
      <ConnectedFileUploader
        isMulti
        placeholder="Add Another Image"
        name="productImages"
        setImages={setImage}
      />
      <ConnectedTextArea label="Product Description" name="description" handleSetTags={() => {}}/>
      <FormLabel htmlFor="features">List Product Features</FormLabel>
      <FieldArray
        name="features"
        render={(arrayHelpers) => {
          const features = values.features
          return (
            <Flex flexDirection="column">
              {features?.map((feature: string, index: number) => (
                <Flex key={index} alignItems="center">
                  <ConnectedFormGroup name={`features.[${index}]`} type="text" />
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
                  Add another feature
                </Text>
              </Flex>
            </Flex>
          )
        }}
      />

      <FormLabel htmlFor="variations">Product Variations (Optional)</FormLabel>
      {options.map((item: Options, i: number) => (
        <Flex key={i} alignItems="center">
          <Field key={i} type="radio" name="variations" value={item.value} />
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
