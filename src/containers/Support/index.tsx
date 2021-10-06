import * as React from 'react'

import { ArrowLeft } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { Text, Button, Grid, Flex, Divider } from '@chakra-ui/core'

import { images, theme } from '../../theme'
import { H5 } from '../../typography'
import { PageWrap } from '../../layouts'
import { Faq, Maybe } from '../../generated/graphql'
import { zendeskWidgetScriptUrl } from '../../constants'
import { useHistory } from 'react-router-dom'
import { useFetchFaQsQuery } from '../../generated/graphql'
import { InfoPage } from '../../components'
import { useScript } from '../../hooks'

type UserSupportProps = {}
type FAQOpion = Pick<Faq, 'id' | 'Question' | 'Answer'>
type KnowledgeBaseFAQProps = {
  FAQ: Maybe<FAQOpion>
  isWebView: boolean
}
type SupportPageButtonProps = {
  onClick: () => void
}

const SupportPageButton: React.FC<SupportPageButtonProps> = ({ children, onClick }) => {
  return (
    <Button
      onClick={onClick}
      mt={4}
      width="100%"
      border={`1px solid ${theme.colors.brand[500]}`}
      background="white"
    >
      <Text fontSize="12px">{children}</Text>
    </Button>
  )
}
const KnowledgeBaseFAQs: React.FC<KnowledgeBaseFAQProps> = ({ FAQ, isWebView }) => {
  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      justify="space-between"
      border={`1px solid ${theme.colors.dimText}`}
      borderRadius={5}
      p={4}
      mb={4}
      background={theme.colors.accent[50]}
    >
      <Text fontWeight={600}>{FAQ?.Question}</Text>
      <Divider
        width={isWebView ? '30%' : '80%'}
        color={theme.colors.dimText}
        orientation="horizontal"
      />
      <Text color={theme.colors.dimText} fontSize={12}>
        {FAQ?.Answer}
      </Text>
    </Flex>
  )
}

const UserSupport: React.FC<UserSupportProps> = () => {
  const history = useHistory()
  const [currentPage, setCurrentPage] = React.useState<string>()
  const isWebView = useMediaQuery({ query: '(min-width: 40em)' })
  useScript(zendeskWidgetScriptUrl)

  const setPage = (page: string) => {
    setCurrentPage(page)
  }
  const knowledge = currentPage === 'knowledge'
  const handleBackArrow = () => {
    if (knowledge) {
      setCurrentPage(undefined)
    } else {
      history.push('/')
    }
  }
  const { data: faqsData } = useFetchFaQsQuery()

  return (
    <PageWrap m={10} title="Support Page" width="100%" alignSelf="center">
      <Flex onClick={handleBackArrow} mb={4}>
        <ArrowLeft />
        <Text ml={3} fontWeight={600}>
          {knowledge ? 'Support' : 'Home'}
        </Text>
      </Flex>
      {currentPage ? (
        knowledge && faqsData?.faqs?.length ? (
          faqsData?.faqs?.map((faq: Maybe<FAQOpion>, index: number) => (
            <Flex
              margin="auto"
              key={`${index}_faq`}
              flexDirection="column"
              justify="space-between"
              width={isWebView ? '70%' : '100%'}
            >
              <KnowledgeBaseFAQs FAQ={faq} isWebView={isWebView} />
            </Flex>
          ))
        ) : (
          <InfoPage
            image={images.emptyWishlist}
            header="No FAQS set up"
            caption={`
                              The admin has not set up FAQs, use the help button for further assistance`}
          />
        )
      ) : (
        <Grid margin="auto" gridTemplateRows="70px 70px 100%" justifyItems="center">
          <H5 mt={5} fontWeight={600}>
            How can we help you?
          </H5>
          <Text color={theme.colors.dimText} textAlign="center" fontSize={14}>
            Please check out our Frequently Asked Questions (FAQs) below or click on the help icon
            for live chat
          </Text>
          <Grid gridTemplateRows="50px 50px 50px">
            <SupportPageButton onClick={() => setPage('knowledge')}>FAQs</SupportPageButton>
          </Grid>
        </Grid>
      )}
    </PageWrap>
  )
}

export default UserSupport
