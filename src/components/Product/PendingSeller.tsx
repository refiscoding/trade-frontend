import * as React from 'react'
import { Text, Grid } from '@chakra-ui/core'

import { theme } from '../../theme'

const PendingBadgeIcon = () => (
  <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.0197 0C12.7364 2.70608 16.3048 4.01029 20 4.95105C19.8246 13.5111 16.3128 20.6495 9.99344 23C6.70212 21.8636 4.21676 19.4738 2.53687 16.2203C0.900254 13.0507 0.0870856 9.09283 0 4.97552C3.88468 4.34573 7.35423 2.86147 10.0197 0Z"
      fill={theme.colors.blueText}
    />
    <path
      d="M9.2275 16.1448C9.2275 16.3716 9.30889 16.5891 9.45376 16.7495C9.59863 16.9099 9.79512 17 10 17C10.2049 17 10.4014 16.9099 10.5462 16.7495C10.6911 16.5891 10.7725 16.3716 10.7725 16.1448C10.7725 16.0325 10.7525 15.9213 10.7137 15.8175C10.6749 15.7138 10.618 15.6195 10.5462 15.5401C10.4745 15.4607 10.3893 15.3977 10.2956 15.3547C10.2019 15.3117 10.1014 15.2896 10 15.2896C9.89855 15.2896 9.7981 15.3117 9.70438 15.3547C9.61065 15.3977 9.52549 15.4607 9.45376 15.5401C9.38203 15.6195 9.32512 15.7138 9.2863 15.8175C9.24748 15.9213 9.2275 16.0325 9.2275 16.1448V16.1448ZM11.3613 12.9166C12.448 12.2541 13 11.2934 13 10.0621C13 7.94736 11.4932 7 10 7C8.54575 7 7 8.16988 7 10.3386C7 10.5588 7.07902 10.77 7.21967 10.9257C7.36032 11.0814 7.55109 11.1689 7.75 11.1689C7.94891 11.1689 8.13968 11.0814 8.28033 10.9257C8.42098 10.77 8.5 10.5588 8.5 10.3386C8.5 9.18532 9.27775 8.66058 10 8.66058C10.5602 8.66058 11.5 8.84241 11.5 10.0621C11.5 10.4947 11.3972 10.9995 10.6382 11.4628C10.1222 11.7758 9.25 12.5887 9.25 13.6423C9.25 13.8625 9.32902 14.0737 9.46967 14.2294C9.61032 14.3851 9.80109 14.4726 10 14.4726C10.1989 14.4726 10.3897 14.3851 10.5303 14.2294C10.671 14.0737 10.75 13.8625 10.75 13.6423C10.75 13.4879 11.0463 13.1084 11.3613 12.9166V12.9166Z"
      fill="white"
    />
  </svg>
)

const PendingVerificationBadge = () => (
  <Grid mt={2} gridTemplateColumns="28px 1fr">
    <PendingBadgeIcon />
    <Text fontSize="12px" fontWeight={600} color={theme.colors.blueText} mt={1}>
      Seller Pending Verification
    </Text>
  </Grid>
)

export default PendingVerificationBadge
