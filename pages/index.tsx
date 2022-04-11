import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import prisma from '../lib/prisma';
import React from "react"
import { PostList, PostProps, usePost } from '../components/Post';
import SearchBar from '../components/SearchBar';
import Layout from '../components/Layout'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const feed = await prisma.post.findMany({
    where: { approved: true },
  })
  feed.map((post) => {
    post.createdAt = JSON.parse(JSON.stringify(post.createdAt))
    return post;
  });
  return {
    props: {
      feed
    }
  }
}

type Props = {
  feed: PostProps[]
}

const Home: React.FC<Props> = (props) => {
  const [answer, setAnswer] = React.useState();
  return (
    <Layout>
      <Head>
        <title>hey matth!</title>
        <meta name="description" content="matth's personal wiki" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          hey matth!
        </h1>
        <div>
          <SearchBar answerCallback={setAnswer}/>
          <div dangerouslySetInnerHTML={{__html: answer}}></div>
        </div>
        <div>
          <PostList />
        </div>
      </main>
      <footer>
      </footer>
    </Layout>
  )
}

export default Home
