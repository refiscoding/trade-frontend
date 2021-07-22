import * as React from 'react'

import moment from 'moment'

import { useField } from 'formik'
import { DateRangePicker } from 'react-dates'
import { Flex, InputProps, FormLabel } from '@chakra-ui/core'

import { LabelProps } from './label'
import { Text } from '../../typography'
import { DatePickerWrapper } from './styles'

import 'react-dates/lib/css/_datepicker.css'

type ConnectedDatePickerProps = LabelProps &
  InputProps & {
    label?: string
    name: string
  }

const ConnectedDatePicker: React.FC<ConnectedDatePickerProps> = ({
  label,
  isDisabled,
  ...rest
}) => {
  const [field, meta, helpers] = useField(rest.name)
  const [date, setDate] = React.useState({
    startDate: field && field.value ? moment(field.value) : null,
    endDate: field && field.value ? moment(field.value) : null
  })
  const [focused, setFocus] = React.useState<'startDate' | 'endDate' | null>('startDate')
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <Flex
      flexDirection="column"
      width={rest.width || '100%'}
      mr={rest.mr}
      ml={rest.ml}
      mt={rest.mt}
      mb={rest.mb}
      onClick={() => setIsFocused(true)}
    >
      <FormLabel color="gray.500" htmlFor={field.name}>
        {label}
      </FormLabel>
      <DatePickerWrapper>
        {isFocused ? (
          <DateRangePicker
            isOutsideRange={() => false}
            startDate={date.startDate}
            startDateId="start"
            endDate={date.endDate}
            endDateId="end"
            onFocusChange={(focused) => setFocus(focused)}
            focusedInput={focused}
            onDatesChange={({ startDate, endDate }) => {
              setDate({
                startDate,
                endDate
              })
              helpers.setValue({
                startDate,
                endDate
              })
            }}
            disabled={isDisabled}
          />
        ) : (
          <Flex
            color="gray.500"
            border="1px solid"
            paddingX="1rem"
            height="2.5rem"
            align="center"
            borderColor="gray.300"
            borderRadius="0.25rem"
          >
            {rest.placeholder}
          </Flex>
        )}
      </DatePickerWrapper>
      {meta.touched && meta.error ? (
        <Text color="red.500" textAlign="right">
          {meta.error}
        </Text>
      ) : null}
    </Flex>
  )
}

export default ConnectedDatePicker

ConnectedDatePicker.defaultProps = {
  mb: 2,
  fontWeight: 'lighter'
}
