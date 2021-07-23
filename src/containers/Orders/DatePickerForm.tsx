import * as Yup from 'yup'
import * as React from 'react'

import moment from 'moment'

import { Flex } from '@chakra-ui/core'
import { ApolloQueryResult } from 'apollo-boost'
import { Form, Formik, FormikProps } from 'formik'

import ConnectedDateRangePicker from '../../components/DateRangePicker'

import { theme } from '../../theme'
import { Text } from '../../typography'
import { FetchUserCheckoutOrdersQuery } from '../../generated/graphql'

const DateRangeValidation = Yup.object().shape({
  dateRange: Yup.object().shape({
    startDate: Yup.string(),
    endDate: Yup.string()
  })
})

export type Ranges = {
  startDate: string | null
  endDate: string | null
}

type DateRangeValues = {
  dateRange?: Ranges
}

type SelectDateRangeFormProps = {
  setDateRange: React.Dispatch<React.SetStateAction<Ranges | undefined>>
  setIsFiltering: React.Dispatch<React.SetStateAction<boolean | undefined>>
  refetchUserOrders: () => Promise<ApolloQueryResult<FetchUserCheckoutOrdersQuery>>
  isFiltering: boolean | undefined
}

const SelectDateRangeForm = ({
  isFiltering,
  refetchUserOrders,
  setIsFiltering,
  setDateRange
}: SelectDateRangeFormProps): JSX.Element => {
  const initialState = {
    dateRange: {
      startDate: null,
      endDate: null
    }
  }

  const cancelStyles = {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: theme.colors.blueText
  }

  const cancelFilters = () => {
    setIsFiltering(false)
    setDateRange({
      endDate: null,
      startDate: null
    })
    refetchUserOrders()
  }

  return (
    <Flex minWidth={`600px`}>
      <Formik
        validationSchema={DateRangeValidation}
        initialValues={initialState}
        onSubmit={() => console.log(`TODO: Add Handler`)}
      >
        {({ values, resetForm }: FormikProps<DateRangeValues>) => {
          const dateRanges = values.dateRange
          const startDate = moment(dateRanges?.startDate).toISOString()
          const endDate = moment(dateRanges?.endDate).toISOString()
          if (startDate && endDate) {
            const range = { startDate, endDate }
            setIsFiltering(true)
            setDateRange(range)
            resetForm()
          }
          return (
            <Form style={{ width: '100%' }}>
              <Flex>
                <ConnectedDateRangePicker
                  width="50%"
                  name="dateRange"
                  label="Filter Orders By Date"
                  placeholder="Set a Date Range"
                />
                {isFiltering && (
                  <Text onClick={cancelFilters} mr={3} fontSize={14} style={cancelStyles}>
                    Clear
                  </Text>
                )}
              </Flex>
            </Form>
          )
        }}
      </Formik>
    </Flex>
  )
}

export default SelectDateRangeForm
