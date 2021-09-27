import * as React from 'react'

import { Image, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import { useMediaQuery } from 'react-responsive'

import CardFooter from '../CardFooter'

import { Card } from '../../index'
import { Category } from '../../../generated/graphql'

type CategoryCardProps = FlexProps & {
  category: Category
  key: string
  handleClick: (id: string) => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, handleClick }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Card
      m={2}
      width={isTabletOrMobile ? '170px' : '300px'}
      height={isTabletOrMobile ? '150px' : '300px'}
      onClick={() => handleClick(category.id)}
    >
      <Image
        mr={5}
        width="100%"
        height={isTabletOrMobile ? '120px' : '270px'}
        src={category.categoryImage?.url || ''}
      />
      <CardFooter bg="white" height="30px" alignItems="center" justifyContent="center">
        <Text fontSize="12px">{category.name}</Text>
      </CardFooter>
    </Card>
  )
}

export default CategoryCard
