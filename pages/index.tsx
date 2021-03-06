import type { GetServerSideProps } from "next";
import Head from "next/head";
import prisma from "../lib/prisma";
import React from "react";
import SearchPanel from "../components/SearchPanel";
import Layout from "../components/Layout";
import { Trie } from "mnemonist";
import Hand from "components/Hand";

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({
    where: {
      answer: {
        not: null,
      },
    },
    select: {
      question: true,
    },
  });
  return {
    props: {
      questions: posts.map((post) => post.question),
    },
  };
};

type Props = {
  questions: string[];
};

const Home: React.FC<Props> = (props) => {
  const trie = Trie.from(props.questions);
  return (
    <Layout>
      <Head>
        <title>ask matthew anything!</title>
        <meta name="description" content="matth's personal wiki" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="searchPanel">
        <SearchPanel trie={trie} />
      </div>
      <div className="handPanel">
        <Hand />
      </div>
      <footer></footer>
      <style jsx>{`
        .searchPanel {
          width: 70%;
          height: 100%;
          padding-top: 2.5rem;
        }

        .handPanel {
          height: 75%;
          width: 30%;
        }

        @media (max-width: 600px) {
          .searchPanel {
            width: 100%;
          }

          .handPanel {
            width: 0%;
          }
      `}</style>
    </Layout>
  );
};

export default Home;
