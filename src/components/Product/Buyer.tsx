import * as React from 'react';
import { 
    Text,
    Grid
} from '@chakra-ui/core';

const BuyerBadgeIcon = () => (
    <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.0197 0C12.7364 2.70608 16.3048 4.01029 20 4.95105C19.8246 13.5111 16.3128 20.6495 9.99344 23C6.70212 21.8636 4.21676 19.4738 2.53687 16.2203C0.900254 13.0507 0.0870856 9.09283 0 4.97552C3.88468 4.34573 7.35423 2.86147 10.0197 0Z" fill="black"/>
        <path d="M8.26847 16.9999C8.4944 16.9999 8.67756 16.7867 8.67756 16.5237C8.67756 16.2607 8.4944 16.0475 8.26847 16.0475C8.04253 16.0475 7.85938 16.2607 7.85938 16.5237C7.85938 16.7867 8.04253 16.9999 8.26847 16.9999Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.7685 16.9999C12.9944 16.9999 13.1776 16.7867 13.1776 16.5237C13.1776 16.2607 12.9944 16.0475 12.7685 16.0475C12.5425 16.0475 12.3594 16.2607 12.3594 16.5237C12.3594 16.7867 12.5425 16.9999 12.7685 16.9999Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 7H6.63636L7.73273 13.3762C7.77014 13.5955 7.8726 13.7924 8.02218 13.9326C8.17176 14.0727 8.35892 14.1472 8.55091 14.1429H12.5273C12.7193 14.1472 12.9064 14.0727 13.056 13.9326C13.2056 13.7924 13.308 13.5955 13.3455 13.3762L14 9.38097H7.04545" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BuyerBadge = () => (
    <Grid mt={2} gridTemplateColumns="28px 1fr">
        <BuyerBadgeIcon />
        <Text fontSize="12px" fontWeight={600} mt={1}>
            Buyer
        </Text>
    </Grid>
);

export default BuyerBadge;
