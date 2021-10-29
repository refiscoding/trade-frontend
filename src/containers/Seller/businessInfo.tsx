import * as React from 'react'
import { FormLabel, Flex } from '@chakra-ui/core'

import { BEESTATUS, POSITIONS, TURNOVER } from '../../constants'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import {
  ConnectedCheckbox,
  ConnectedFormGroup,
  ConnectedNumberInput,
  ConnectedTextArea
} from '../../components/FormElements'
import { H3 } from '../../typography'
import { SellerValues } from './index'
import { theme } from '../../theme'
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
          Company details
        </H3>
        <ConnectedFormGroup label="Company name*" name="name" type="text" />
        <ConnectedSelect
          placeholder="Select position"
          label="Position* "
          name="position"
          options={POSITIONS}
        />
        <ConnectedFormGroup label="If other, please specifiy" name="otherPosition" type="text" />
        <ConnectedNumberInput
          label="Business/ work phone number*"
          name="businessPhoneNumber"
          unit="+27"
        />
        <ConnectedFormGroup
          label="Business website"
          name="websiteAddress"
          type="text"
          placeholder="Eg. https://yourbusiness.com"
        />
        <ConnectedFormGroup
          label="Business registration number*"
          name="registrationNumber"
          type="text"
        />
        <ConnectedNumberInput label="Number of years in operation*" name="yearsOfOperation" />
        <ConnectedFormGroup
          label="Related/ associated company/ group"
          name="companyRelated"
          type="text"
        />
        <ConnectedSelect
          label="BEE status*"
          name="beeStatus"
          onChange={(e) => setFieldValue('beeStatus', e.target.value)}
          options={BEESTATUS}
        />
        <ConnectedSelect
          label="Annual turnover (R)*"
          name="revenue"
          onChange={(e) => setFieldValue('revenue', e.target.value)}
          options={TURNOVER}
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
          <ConnectedFormGroup label="Please provide VAT number*" name="vatNumber" type="text" />
        )}
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
          Tell us more about your business
        </H3>
        <ConnectedTextArea
          label="Please give a brief description about what the business does and what you are wanting to sell on our platform* "
          name="products"
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          handleSetTags={() => {}}
        />
        <ConnectedSelect
          label="Do you deal with hazardous chemicals?*"
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
            label="Please provide a brief description of the hazardous chemicals*"
            name="hazChem"
            type="text"
          />
        )}
        <ConnectedSelect
          placeholder="Select country"
          label="Where is your head office situated?*"
          name="headQuater"
          options={countries}
        />
        <FormLabel htmlFor="countries">What countries do you operate in?*</FormLabel>
        {countries?.map((item: any, i: number) => (
          <Flex width="50%" key={`${i}-container`}>
            <ConnectedCheckbox key={i} name="countries" label={item.label} value={item.value} />
          </Flex>
        ))}
        <FormLabel htmlFor="category">Select the categories your business falls under*</FormLabel>
        {categories?.slice(0, categories.length - 1).map((item: any, i: number) => (
          <Flex width="50%" key={`${i}-container`}>
            <ConnectedCheckbox
              key={i}
              name="categories"
              label={item.label && capitalizeFirstLetter(item.label)}
              value={item.value}
              hideError={true}
            />
          </Flex>
        ))}
        {categories?.slice(-1).map((item: any, i: number) => (
          <Flex width="50%" key={`${i}-container`}>
            <ConnectedCheckbox
              key={i}
              name="categories"
              label={item.label && capitalizeFirstLetter(item.label)}
              value={item.value}
              hideError={false}
            />
          </Flex>
        ))}
        <ConnectedTextArea
          mt={3}
          label="List the brands that you supply"
          name="suppliedBrands"
          type="text"
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          handleSetTags={() => {}}
        />
      </Flex>
    </React.Fragment>
  )
}

export default BusinessInfo
