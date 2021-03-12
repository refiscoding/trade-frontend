import { Flex } from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import React, { FC } from 'react'
import { Filter, Search } from 'react-feather'
import { connectSearchBox } from 'react-instantsearch-dom'
import { Form, Formik } from 'formik'
import { ConnectedFormGroup } from '../FormElements'
import { useMediaQuery } from 'react-responsive'

type SearchBarProps = InputProps & {
  handleSearch: (value: string) => void
  handleReset: () => void
  handleFilter: () => void
}

const SearchBar: FC<SearchBarProps> = ({ handleSearch, handleReset, handleFilter }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const SearchBox = connectSearchBox(({ refine, currentRefinement }) => (
    <Formik initialValues={{ search: '' }} onSubmit={() => {}}>
      <Form style={{ width: isTabletOrMobile ? '80%' : '95%' }}>
        <ConnectedFormGroup
          icon={Search}
          name="search"
          placeholder="Search for products, categories..."
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
        />
      </Form>
    </Formik>
  ))

  return (
    <Flex width="100%" height="40px" alignItems="center" justifyContent="space-between">
      <SearchBox />
      <Flex
        borderRadius={4}
        bg="accent.600"
        alignItems="center"
        justifyContent="center"
        width="50px"
        height="40px"
        mb="1rem"
        onClick={() => handleFilter()}
      >
        <Filter fontSize={10} />
      </Flex>
    </Flex>
  )
}

export default SearchBar
