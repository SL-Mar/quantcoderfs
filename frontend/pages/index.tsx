// pages/index.tsx

import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/coding',
      permanent: false,  // set to true if this will never change
    },
  }
}

export default function IndexPage() {
  return null
}
