import * as React from 'react'

import { Button } from '@chakra-ui/core'

type StepButtonProps = {
  type?: 'button' | 'submit' | undefined
  active: number
  disabled: boolean
  setActive: (step: number) => void
}

const StepButton: React.FC<StepButtonProps> = ({
  children,
  setActive,
  active,
  disabled,
  type,
  ...rest
}) => {
  return (
    <Button
      mt={5}
      width="100%"
      type={type ? type : 'button'}
      variantColor="brand"
      variant="solid"
      isDisabled={disabled}
      onClick={() => setActive(active + 1)}
      {...rest}
    >
      {children}
    </Button>
  )
}
export default StepButton
