import { Flex, Radio, RadioProps } from '@chakra-ui/core'
import { useField } from 'formik'
import * as React from 'react'
import { Text } from '../../../typography'
import { LabelProps } from '../styles'

export type ConnectedRadioButtonProps = LabelProps &
  RadioProps & {
    label?: string
    name: string
  }

const ConnectedRadioButton: React.FC<ConnectedRadioButtonProps> = ({ label, ...rest }) => {
  const [field, meta] = useField(rest.name)
  return (
    <Flex
      mb={rest.mb}
      ml={rest.ml}
      mr={rest.mr}
      mt={rest.mt}
      align="center"
      justify={rest.justifyContent}
    >
      <Radio id={field.name} {...field} {...rest}>
        {label}
      </Radio>
      {meta.touched && meta.error ? (
        <Text color="red.500" textAlign="right">
          {meta.error}
        </Text>
      ) : null}
    </Flex>
  )
}

export default ConnectedRadioButton

ConnectedRadioButton.defaultProps = {
  mb: 2,
  alignItems: 'center',
  justifyContent: 'flex-start'
}
