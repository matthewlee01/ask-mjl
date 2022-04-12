import React from 'react'
import Layout from 'components/Layout'
import Link from 'next/link'
import { PostList } from 'components/Post'

const Admin: React.FC = () => {
  return (
    <Layout>
      <h1>admin</h1>
      <PostList />
      <footer>
        <Link href="/">home</Link>
      </footer>
    </Layout>
  )
}

export default Admin