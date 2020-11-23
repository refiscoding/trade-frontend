import { Flex } from '@chakra-ui/core'
import * as React from 'react'
import { Link } from 'react-router-dom'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { PRIVATE_ROUTES } from '../../navigation/routes'
import { Text } from '../../typography'

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(PRIVATE_ROUTES)
  const slicedBreadcrumbs = breadcrumbs.slice(2)
  return (
    <Flex>
      {slicedBreadcrumbs.map(({ breadcrumb, match }, index) => {
        const ml = index === 0 ? 0 : 2
        return (
          <React.Fragment key={match.url}>
            <Link to={match.url || ''}>
              <Text style={{ textTransform: 'capitalize' }} ml={ml} mr={2} mb={0}>
                {breadcrumb}
              </Text>
            </Link>
            {index < slicedBreadcrumbs.length - 1 && '  >  '}
          </React.Fragment>
        )
      })}
    </Flex>
  )
}

export default Breadcrumbs
