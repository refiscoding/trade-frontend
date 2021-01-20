import { Flex, FlexProps } from '@chakra-ui/core'
import * as React from 'react'
import { OuterCircle, Square } from './styles'

type StepperProps = FlexProps & {
  activeStep: number
  stepInfo?: string[]
}


type Dimensions = {
  width: number | null
  height: number | null
  offsetX: number | null
  offsetY: number | null
}

const Stepper: React.FC<StepperProps> = ({ activeStep, stepInfo, children, ...rest }) => {
  const childArr = React.Children.toArray(children)

  const stepCount = childArr.length

  const spacerRef = React.useRef<HTMLDivElement>(null)

  const squareRefs = new Array(stepCount).fill('').map(() => React.createRef<HTMLDivElement>())


  const [spacerWidth, setSpacerWidth] = React.useState(0)

  React.useEffect(() => {
    if (spacerRef && spacerRef.current && spacerWidth !== spacerRef.current.offsetWidth) {
      setSpacerWidth(spacerRef.current.offsetWidth)
    }
    if (stepInfo && stepInfo.length > 0) {
      if (stepInfo.length !== stepCount) {
        console.warn("Stepper Error: Step info and number of steps don't match. Please update.")
      }
    }
    // eslint-disable-next-line
  }, [activeStep])

  return (
    <React.Fragment>
      <Flex
        {...rest}
        justifyContent={stepCount === 1 ? 'flex-end' : 'space-between'}
        width="100%"
        maxHeight="10px"
        padding={0}
        mb={5}
        borderRadius={10}
        overflow="hidden"
      >
        {childArr.map((_, i) => {
          const isCompletedStep = i < activeStep
          const isCurrentStep = i === activeStep
          return (
            <Flex width={`${100/stepCount}%`} flex={1} key={i} flexDir="column">
              <Flex
                flex={1}
                pos="relative"
                align="center"
                direction="row"
                ref={spacerRef}
                justify="center"
              >
                {isCompletedStep ? (
                  <Square ref={squareRefs[i]}>
                    <OuterCircle bg="brand.500" />
                  </Square>
                ) : (
                  <Square ref={squareRefs[i]}>
                    <OuterCircle bg={isCurrentStep ? 'brand.500' : 'gray.200'} />
                  </Square>
                )}
              </Flex>
            </Flex>
          )
        })}
      </Flex>
      {childArr[activeStep]}
    </React.Fragment>
  )
}

export default Stepper

Stepper.defaultProps = {
  flex: 1,
  p: 4,
  flexDir: 'row',
  alignItems: 'flex-start'
}
