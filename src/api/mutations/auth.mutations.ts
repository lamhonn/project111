import { gql } from '@apollo/client';

export const VERIFY_TABLET_PIN = gql`
  mutation VerifyTabletPin($input: VerifyTabletPinInput!) {
    verifyTabletPin(input: $input) {
      code
      success
      message
      token
      tablet {
        id
        userId
        tableNumber
        created
      }
    }
  }
`;
