import gql from 'graphql-tag';

export const buildGql = (value) =>
  gql`
    ${value}
  `;
