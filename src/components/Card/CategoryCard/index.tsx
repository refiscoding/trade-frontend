import * as React from 'react'

import { Image, Text } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import { useMediaQuery } from 'react-responsive'

import CardFooter from '../CardFooter'

import { Card } from '../../index'

type CategoryCardProps = FlexProps & {
  category: Record<string, any>
  key: string
  handleClick: (id: string) => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, key, handleClick }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <Card
      m={2}
      width={isTabletOrMobile ? '150px' : '250px'}
      height={isTabletOrMobile ? '130px' : '180px'}
      onClick={() => handleClick(key)}
    >
      <Image
        mr={5}
        width="100%"
        height={isTabletOrMobile ? '100px' : '150px'}
        src={category.categoryImage || ''}
      />
      <CardFooter bg="white" height="30px" alignItems="center" justifyContent="center">
        <Text fontSize="12px">{category.name}</Text>
      </CardFooter>
    </Card>
  )
}

export default CategoryCard
