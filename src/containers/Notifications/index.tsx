import * as React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { get } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import { Flex, Image, Grid, useToast } from '@chakra-ui/core'

import InfoPage from '../../components/InfoPage'

import { Text } from '../../typography'
import { PageWrap } from '../../layouts'
import { theme, images } from '../../theme'
import { ApolloError } from 'apollo-boost'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../constants'
import {
  useFetchUserNotificationsQuery,
  Notification,
  Enum_Notification_Type as enumNoificationType,
  useMarkNotificationAsReadMutation
} from '../../generated/graphql'

dayjs.extend(relativeTime)

type NotificationsPageProps = {}

const NotificationsPage: React.FC<NotificationsPageProps> = () => {
  const toast = useToast()
  const isWebViewport = useMediaQuery({
    query: '(min-width: 75em)'
  })

  const conatinerWidth = !isWebViewport ? '340px' : '600px'

  const containerGrid = !isWebViewport ? `40px 260px 20px` : `40px 500px 20px`

  const { data: userNotifications, refetch: refetchNotifications } = useFetchUserNotificationsQuery(
    {
      onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST })
    }
  )

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation({
    onError: (err: ApolloError) => toast({ description: err.message, ...ERROR_TOAST }),
    onCompleted: async ({ markNotificationAsRead }) => {
      toast({
        description: `${markNotificationAsRead?.payload}`,
        ...SUCCESS_TOAST
      })
      refetchNotifications()
    },
    awaitRefetchQueries: true
  })

  const notificationsArray = get(userNotifications, 'findUserNotifications.payload')

  const handleReadNotificationClicked = async (notification: string) => {
    await markNotificationAsRead({
      variables: {
        input: {
          notification
        }
      }
    })
  }

  React.useEffect(() => {
    refetchNotifications()
  }, [refetchNotifications])

  return (
    <PageWrap mt={10} title="Notifications" alignSelf="center">
      <Flex marginX="auto" flexDirection="column" width="100%">
        {!notificationsArray?.length && (
          <InfoPage
            image={images.emptyWishlist}
            header="No new notifications"
            caption={`
                          You don’t have any new notifications. You are up to date!`}
          />
        )}
        {notificationsArray?.map((notification: Notification, index: number) => {
          const type = notification?.type
          const readNotification = notification?.read
          const iconTypeInfo = type === enumNoificationType.Info
          const iconTypeSuccess = type === enumNoificationType.Success
          const iconTypeError = type === enumNoificationType.Error
          const icon = iconTypeError
            ? images.notifications.error
            : iconTypeInfo
            ? images.notifications.info
            : iconTypeSuccess && images.notifications.success
          if (!readNotification) {
            return (
              <Grid
                key={`${index}_notification`}
                p={5}
                mt={5}
                borderRadius={5}
                width={conatinerWidth}
                gridTemplateColumns={containerGrid}
                boxShadow={theme.boxShadowMedium}
                background={theme.colors.accent[50]}
              >
                <Flex mr={4}>
                  <Image src={icon} />
                </Flex>
                <Flex flexDirection="column" justify="space-between">
                  <Text mb={2} fontSize={14} fontWeight={600}>
                    {notification?.title}
                  </Text>
                  <Flex
                    overflowWrap="break-word"
                    maxWidth={isWebViewport ? '390px' : '300px'}
                    display="inline-block"
                  >
                    <Text fontSize={14}>{notification?.message}</Text>
                  </Flex>
                  <Text mt={2} fontSize={11}>
                    {dayjs(notification?.created_at).fromNow()}
                  </Text>
                </Flex>
                <Flex cursor="pointer">
                  <Text
                    onClick={() => handleReadNotificationClicked(notification?.id)}
                    fontSize={14}
                  >
                    X
                  </Text>
                </Flex>
              </Grid>
            )
          }
        })}
      </Flex>
    </PageWrap>
  )
}

export default NotificationsPage
