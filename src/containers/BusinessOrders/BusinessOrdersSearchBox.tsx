import React, { FC } from 'react'
import { Flex } from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { Search } from 'react-feather'
import { connectSearchBox } from 'react-instantsearch-dom'
import { Form, Formik } from 'formik'

import { ConnectedFormGroup } from '../../components/FormElements'

type BusinessOrdersSearchBoxProps = InputProps & {
  handleSearch: (value: string) => void
  handleReset: () => void
}

const BusinessOrdersSearchBox: FC<BusinessOrdersSearchBoxProps> = ({
  handleSearch,
  handleReset
}) => {
  const SearchBox = connectSearchBox(({ refine, currentRefinement }) => (
    <Formik initialValues={{ search: '' }} onSubmit={() => {}}>
      <Form style={{ width: '80%' }}>
        <ConnectedFormGroup
          icon={Search}
          name="search"
          placeholder="Search Orders"
          fontSize={12}
          paddingLeft="40px"
          borderColor="transparent"
          bg="accent.600"
          iconPosition="left"
          onChange={(e: any) => {
            handleSearch(e.target.value)
            refine(e.target.value)
          }}
          onReset={handleReset}
          value={currentRefinement}
          mb={0}
        />
      </Form>
    </Formik>
  ))

  return (
    <Flex width="100%" height="40px" alignItems="center">
      <SearchBox />
    </Flex>
  )
}

export default BusinessOrdersSearchBox
