import { Flex } from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { useField } from 'formik'
import moment from 'moment'
import * as React from 'react'
import { isInclusivelyBeforeDay, SingleDatePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'
import { DATE_FORMAT } from '../../../constants'
import { Text } from '../../../typography'
import { Label, LabelProps } from '../styles'
import { DatePickerSelect, DatePickerWrapper } from './styles'

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
  const [date, setDate] = React.useState(field && field.value ? moment(field.value) : null)
  const [focused, setFocus] = React.useState<boolean | null>(true)

  const renderYears = () => {
    const arr = []
    for (let i = -100; i <= 5; i++) {
      arr.push(
        <option key={moment().year() + i} value={moment().year() + i}>
          {moment().year() + i}
        </option>
      )
    }
    return arr
  }

  return (
    <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
      <Label htmlFor={field.name}>{label}</Label>
      <DatePickerWrapper>
        <SingleDatePicker
          hideKeyboardShortcutsPanel={true}
          displayFormat={DATE_FORMAT}
          placeholder="Select date"
          numberOfMonths={1}
          onFocusChange={({ focused }) => setFocus(focused)}
          onDateChange={(date) => {
            setDate(date)
            helpers.setValue(date)
          }}
          date={date}
          focused={focused}
          id={field.name}
          disabled={isDisabled}
          isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
          renderMonthElement={({ month, onMonthSelect, onYearSelect }) => {
            return (
              <Flex flexDirection="row" justifyContent="center">
                <DatePickerSelect
                  mr={2}
                  name={field.name}
                  value={month.month()}
                  onChange={(e) => {
                    onMonthSelect(month, e.target.value)
                  }}
                >
                  {moment.months().map((lbl, value) => (
                    <option key={value} value={value}>
                      {lbl}
                    </option>
                  ))}
                </DatePickerSelect>
                <DatePickerSelect
                  name={field.name}
                  value={month.year()}
                  onChange={(e) => {
                    onYearSelect(month, e.target.value)
                  }}
                >
                  {renderYears()}
                </DatePickerSelect>
              </Flex>
            )
          }}
        />
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
