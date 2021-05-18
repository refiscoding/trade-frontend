import { Flex, FlexProps } from '@chakra-ui/core'
import * as React from 'react'
import { Helmet } from 'react-helmet'

type PageWrapProps = FlexProps & {
  title: string
  script?: string
  script_id?: string
}

const PageWrap: React.FC<PageWrapProps> = ({ children, title, script, script_id, ...rest }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <script id={script_id ? script_id : ''} src={script} />
      </Helmet>
      <Flex {...rest}>{children}</Flex>
    </>
  )
}

PageWrap.defaultProps = {
  p: 4,
  flex: 1,
  pt: 'calc(64px + 1rem)',
  height: '100%',
  flexDir: 'column',
  minHeight: '100vh',
  align: 'flex-start',
  justify: 'flex-start'
}

export default PageWrap
