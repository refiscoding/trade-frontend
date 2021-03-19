import * as React from 'react';
import { 
    Text,
    Grid,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody
} from '@chakra-ui/core';

const color = "#355EC0";

const VerifiedBadgeIcon = () => (
    <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0197 0C12.7364 2.70608 16.3048 4.01029 20 4.95105C19.8246 13.5111 16.3128 20.6495 9.99344 23C6.70212 21.8636 4.21676 19.4738 2.53687 16.2203C0.900254 13.0507 0.0870856 9.09283 0 4.97552C3.88468 4.34573 7.35423 2.86147 10.0197 0ZM14.4805 7.66434L8.36119 13.3776L5.55883 10.3916L4.37234 11.6573L8.28253 15.8287L15.5883 9.01049L14.4805 7.66434Z" fill="#63C035"/>
    </svg>
);

const VerifiedBadge = () => (
    <Popover closeOnEsc closeOnBlur placement="top-start" trigger="hover">
        <PopoverTrigger>
            <Grid mt={2} gridTemplateColumns="28px 1fr">
                <VerifiedBadgeIcon />
                <Text fontSize="12px" fontWeight={600} color="#63C035" mt={1}>
                    Verified Seller
                </Text>
            </Grid>
        </PopoverTrigger>
        <PopoverContent bg={color} color="white">
            <PopoverArrow bg={color} />
            <PopoverBody>
                <Text fontSize="12px">
                    This badge is to indicate that the seller has gone through a verification process to sell items on TradeFed’s platform.
                </Text>
            </PopoverBody>
        </PopoverContent>
    </Popover>
);

export default VerifiedBadge;
