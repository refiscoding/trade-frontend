import * as React from 'react'
import { Flex, FormLabel } from '@chakra-ui/core'

import {
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedSelect,
  ConnectedTextArea
} from '../../components/FormElements'
import { Options } from '../Seller/businessInfo'
import { Field, FieldArray } from 'formik'
import { Text } from '../../typography'
import {PlusSquare, XCircle} from 'react-feather'
import { ProductValues } from './index'

type ProductInfoTypes = {
  categories: Options[]
  values: ProductValues
  handleSetTags: (tags: string[]) => void
}

//TO-DO: change this to come from backend
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
];

const ProductInfo: React.FC<ProductInfoTypes> = ({ categories, values, handleSetTags }) => {
  return (
    <Flex flexDirection="column">
      <ConnectedFormGroup label="Product Name" name="name" type="text" />
      <ConnectedTextArea label="Short Product Description" name="shortDescription" handleSetTags={() => {}}/>
      <FormLabel htmlFor="category">List Product Category</FormLabel>
      <FieldArray
        name="category"
        render={(arrayHelpers) => {
          const userCategories = values.category
          return (
            <Flex flexDirection="column">
              {userCategories?.map((category: string, index: number) => (
                <Flex key={index} alignItems="center">
                  <ConnectedSelect placeholder="Select a category" name={`category.[${index}]`} options={categories} />
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
      <ConnectedTextArea label="Add Tags" name="tags" hasTags handleSetTags={handleSetTags}/>
      <ConnectedNumberInput label="Price per Unit" name="pricePerUnit" unit="R" />
      <ConnectedNumberInput label="Retail Price per Unit" name="retailPricePerUnit" unit="R" />
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
