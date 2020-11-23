import { Flex, FlexProps } from '@chakra-ui/core'
import { AnimatePresence, motion } from 'framer-motion'
import { throttle } from 'lodash'
import * as React from 'react'
import { Check } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { Text } from '../../typography'
import { InnerCircle, OuterCircle, SpacerLine, Square } from './styles'

type StepperProps = FlexProps & {
  activeStep: number
  stepInfo?: string[]
}

const AnimatedCheck = motion.custom(Check)

type Dimensions = {
  width: number | null
  height: number | null
  offsetX: number | null
  offsetY: number | null
}

function getDistance(a: DOMRect, b: DOMRect) {
  if (a && b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }
}

function useThrottledResize(ref: React.RefObject<HTMLElement>, delay?: 500) {
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    width: null,
    height: null,
    offsetX: null,
    offsetY: null
  })
  const rafId = React.useRef<number>()

  React.useEffect(() => {
    if (!ref.current) return

    const node = ref.current

    function measure() {
      rafId.current = requestAnimationFrame(() => {
        setDimensions({
          width: node.offsetWidth,
          height: node.offsetHeight,
          offsetX: node.offsetLeft,
          offsetY: node.offsetTop
        })
      })
    }

    const throttledMeasure = throttle(measure, delay)

    window.addEventListener('resize', throttledMeasure)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      window.removeEventListener('resize', throttledMeasure)
    }
  }, [ref, delay])

  return dimensions
}

const Stepper: React.FC<StepperProps> = ({ activeStep, stepInfo, children, ...rest }) => {
  const childArr = React.Children.toArray(children)

  const stepCount = childArr.length

  const spacerRef = React.useRef<HTMLDivElement>(null)

  const squareRefs = new Array(stepCount).fill('').map(() => React.createRef<HTMLDivElement>())

  const dimensions = useThrottledResize(spacerRef)

  const [spacerWidth, setSpacerWidth] = React.useState(0)
  const [gap, setGap] = React.useState(0)

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

  React.useEffect(() => {
    if (dimensions.width) {
      setSpacerWidth(dimensions.width)
    }
    // need at least 2 steps to calculate distance
    if (squareRefs[0].current && squareRefs[1].current) {
      const el1 = squareRefs[0].current.getBoundingClientRect()
      const el2 = squareRefs[1].current.getBoundingClientRect()
      const distance = getDistance(el1, el2)
      setGap(distance ? distance - 40 : 0)
    }
  }, [squareRefs, dimensions])

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  return (
    <React.Fragment>
      <Flex {...rest} justifyContent={stepCount === 1 ? 'flex-end' : 'space-between'}>
        {childArr.map((_, i) => {
          const isCompletedStep = i < activeStep
          const isLastStep = i === stepCount - 1
          const isCurrentStep = i === activeStep
          return (
            <Flex flex={1} key={i} flexDir="column">
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
                    <OuterCircle bg="green.500">
                      <AnimatedCheck
                        size={22}
                        color="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    </OuterCircle>
                  </Square>
                ) : (
                  <Square ref={squareRefs[i]}>
                    <OuterCircle bg={isCurrentStep ? 'brand.500' : 'gray.200'}>
                      <InnerCircle bg={isCurrentStep ? 'gray.200' : 'gray.100'}>
                        <Text color={isCompletedStep ? 'white' : 'black'}>{i + 1}</Text>
                      </InnerCircle>
                    </OuterCircle>
                  </Square>
                )}
                <AnimatePresence>
                  {!isLastStep && (
                    <>
                      <SpacerLine
                        width={gap}
                        bg="gray.100"
                        left={(spacerWidth + (squareRefs[0].current?.offsetWidth || 40)) / 2}
                      />
                      {isCompletedStep && (
                        <SpacerLine
                          bg="green.500"
                          exit={{ width: 0 }}
                          initial={{ width: 0 }}
                          className="test-spacer"
                          animate={{ width: gap }}
                          left={(spacerWidth + (squareRefs[0].current?.offsetWidth || 40)) / 2}
                        />
                      )}
                    </>
                  )}
                </AnimatePresence>
              </Flex>
              {stepInfo && !!stepInfo[i] && !isTabletOrMobile && (
                <Flex pt={2} justify="center">
                  <Text textAlign="center" style={{ maxWidth: '75%' }}>
                    {stepInfo[i]}
                  </Text>
                </Flex>
              )}
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
