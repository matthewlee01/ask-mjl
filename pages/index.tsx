import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import prisma from '../lib/prisma';
import React from "react"
import { PostProps } from '../components/Post';
import SearchBar from '../components/SearchBar';
import Layout from '../components/Layout'
import Spiller from '../components/Spiller'
import { Trie } from 'mnemonist'

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({
    where: {
      answer: {
        not: null
      }
    },
    select: {
      question: true
    }
  })
  return {
    props: {
      questions: posts.map((post) => post.question)
    }
  }
}

type Props = {
  questions: string[]
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
    (<div id="answer" dangerouslySetInnerHTML={{__html: answer}}></div>)
  );
  return (
    <>
      <div>{question}</div>
      {answerHtml}
    </>
  )
}

const Home: React.FC<Props> = (props) => {
  const [similarPosts, setSimilarPosts] = React.useState();
  const trie = Trie.from(props.questions)
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
          <SearchBar setSimilarPosts={setSimilarPosts} trie={trie} />
          {topPost(similarPosts)}
        </div>
      </main>
      <footer>
      </footer>
    </Layout>
  )
}

export default Home
