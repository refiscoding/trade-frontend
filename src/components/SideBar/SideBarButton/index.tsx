import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import MotionFlex from '../../MotionFlex'

type SideBarButtonProps = {
  open: boolean
  color: string
  onClick?: () => void
}

const SvgWrap = styled(MotionFlex)`
  width: 30px;
  &:hover {
    cursor: pointer;
  }
`

const MotionSvg = styled(motion.svg)`
  &:hover {
    cursor: pointer;
  }
`

const SideBarButton: React.FC<SideBarButtonProps> = ({
  open = false,
  onClick,
  color,
  ...props
}) => {
  const variant = open ? 'opened' : 'closed'

  // TODO: replace this dynamic height issue by properly setting styling in parent component
  const [firstRender, setFirstRender] = useState(true)

  const top = {
    closed: {
      rotate: 0,
      translateY: 1
    },
    opened: {
      rotate: 45,
      translateY: 2
    }
  }
  const center = {
    closed: {
      opacity: 1
    },
    opened: {
      opacity: 0
    }
  }
  const bottom = {
    closed: {
      rotate: 0,
      translateY: -1
    },
    opened: {
      rotate: -45,
      translateY: -2
    }
  }

  const lineProps: any = {
    stroke: color,
    strokeWidth: 2,
    animate: variant,
    initial: 'closed',
    vectorEffect: 'non-scaling-stroke',
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }

  const unitHeight = 6
  const unitWidth = 6

  return (
    <SvgWrap>
      <MotionSvg
        width={open ? 12 : 24}
        height={open ? 12 : firstRender ? 24 : 48}
        onClick={() => {
          setFirstRender(false)
          onClick && onClick()
        }}
        overflow="visible"
        preserveAspectRatio="none"
        viewBox={`0 0 ${unitWidth} ${unitHeight}`}
        {...props}
      >
        <motion.line x1="0" x2={unitWidth} y1="0" y2="0" variants={top} {...lineProps} />
        <motion.line x1="0" x2={unitWidth} y1="2" y2="2" variants={center} {...lineProps} />
        <motion.line x1="0" x2={unitWidth} y1="4" y2="4" variants={bottom} {...lineProps} />
      </MotionSvg>
    </SvgWrap>
  )
}

export default SideBarButton
