import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import prisma from '../lib/prisma';
import React from "react"
import { PostProps } from '../components/Post';
import SearchBar from '../components/SearchBar';
import Layout from '../components/Layout'

export const getServerSideProps: GetServerSideProps = async () => {
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

const topPost = (operandResponse) => {
  if (!operandResponse) return
  console.log(operandResponse)
  const topPost = operandResponse.groups[operandResponse.atoms[0].groupId];
  console.log(topPost)
  const question = topPost.metadata.title;
  const answer = topPost.metadata.html;
  const answerHtml = ((answer == question) ?
    (<div>
      this question has not been answered yet!
    </div>) :
    (<div dangerouslySetInnerHTML={{__html: answer}}></div>)
  );
  return (
    <>
      <div>{question}</div>
      {answerHtml}
    </>
  )
}

const Home: React.FC<Props> = () => {
  const [similarPosts, setSimilarPosts] = React.useState();
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
          <SearchBar setSimilarPosts={setSimilarPosts}/>
          {topPost(similarPosts)}
        </div>
      </main>
      <footer>
        <Link href="/admin">admin</Link>
      </footer>
    </Layout>
  )
}

export default Home
