import * as React from 'react'

import { Flex } from '@chakra-ui/core'

import { BEESTATUS, TURNOVER } from '../../constants'
import { theme } from '../../theme'
import { SellerValues } from './index'
import { H3 } from '../../typography'
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
  values: SellerValues
  setFieldValue: any
}

const options = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]

const businessTypes = [
  { label: 'Wholesaler', value: 'wholesaler' },
  { label: 'Distributor', value: 'distributor' },
  { label: 'Both', value: 'both' }
]

const BusinessInfo: React.FC<businessTypes> = ({
  categories,
  countries,
  values,
  setFieldValue
}) => {
  const [vatChecked, setVatChecked] = React.useState(values.isVatRegistered)
  const [hazChem, setHazChem] = React.useState(values.isHazChem)
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
          label="Related/associated company/group"
          name="companyRelated"
          type="text"
        />
        <ConnectedFormGroup
          label="Business Website"
          name="websiteAddress"
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
        <ConnectedSelect
          label="Are you VAT registered?*"
          name="isVatRegistered"
          onChange={(name) => {
            setFieldValue('isVatRegistered', name.target.value)
            if (name.target.value === 'true') {
              setVatChecked(true)
            } else {
              setVatChecked(false)
            }
          }}
          options={[
            {
              label: 'No',
              value: false
            },
            {
              label: 'Yes',
              value: true
            }
          ]}
        />
        {vatChecked === true && (
          <ConnectedFormGroup
            label="If yes, please provide VAT number*"
            placeholder="Please provide VAT number"
            name="vatNumber"
            type="text"
          />
        )}
        <ConnectedSelect
          label="Annual turnover (R)*"
          name="revenue"
          onChange={(e) => setFieldValue('revenue', e.target.value)}
          options={TURNOVER}
        />
        <ConnectedSelect
          label="BEE status*"
          name="beeStatus"
          onChange={(e) => setFieldValue('beeStatus', e.target.value)}
          options={BEESTATUS}
        />
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
          label="Please give a brief description about what the business does and what you are wanting to sell on our platform* "
          name="products"
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          handleSetTags={() => {}}
        />
        <ConnectedSelect
          label="Business Type*"
          name="businessType"
          onChange={(e) => setFieldValue('businessType', e.target.value)}
          options={businessTypes}
        />
        <ConnectedSelect
          label="Do you have a physical store?*"
          name="hasPhysicalStore"
          onChange={(e) => setFieldValue('hasPhysicalStore', e.target.value)}
          options={options}
        />
        <ConnectedSelect
          label="Are you a supplier to retail outlets?*"
          name="isRetailSupplier"
          onChange={(e) => setFieldValue('isRetailSupplier', e.target.value)}
          options={options}
        />
        <ConnectedSelect
          label="Do you deal with Hazardous Chemicals?*"
          name="isHazChem"
          onChange={(e) => {
            setFieldValue('isHazChem', e.target.value)
            if (e.target.value === 'true') {
              setHazChem(true)
            } else {
              setHazChem(false)
            }
          }}
          options={options}
        />
        {hazChem && (
          <ConnectedFormGroup
            mt={3}
            label="Please provide brief discussion of Hazardous chemicals*"
            name="hazChem"
            type="text"
          />
        )}
        <ConnectedTextArea
          mt={3}
          label="List the brands that you supply* "
          name="suppliedBrands"
          type="text"
          handleSetTags={() => {}}
        />
      </Flex>
    </React.Fragment>
  )
}

export default BusinessInfo
