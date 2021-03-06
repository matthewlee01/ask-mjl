import React from "react";
import { parseJSON, format } from "date-fns";
import useSWR from "swr";

export type PostProps = {
  id: string;
  question: string;
  answer: string | null;
  askerEmail: string | null;
  createdAt: Date;
};

const fetcher = (arg) => fetch(arg).then((res) => res.json());

export function usePosts() {
  const { data, error, mutate } = useSWR("/api/post/", fetcher);
  return {
    posts: data,
    mutate: mutate,
    isLoading: !error && !data,
    isError: error,
  };
}

export const Answer: React.FC<{ answer: string }> = ({ answer }) => {
  answer = answer ? answer : "<p>this question hasn't been answered yet!</p>";
  return <div dangerouslySetInnerHTML={{ __html: answer }} />;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  return (
    <div>
      <h2>{post.question}</h2>
      <Answer answer={post.answer} />
      <time>{format(parseJSON(post.createdAt), "LLLL d, yyyy")}</time>
    </div>
  );
};

export const deletePost = async (id, apiKey, refreshCallback) => {
  console.log(`deleting ${id}`);
  await fetch("/api/post/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Apikey ${apiKey}`,
    },
    body: JSON.stringify({
      id: id,
    }),
  });
  await refreshCallback();
};

export const updatePost = async (id, data, apiKey, refreshCallback) => {
  console.log(`updating ${id}`);
  await fetch("/api/post/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Apikey ${apiKey}`,
    },
    body: JSON.stringify({
      id: id,
      data: data,
    }),
  });
  await refreshCallback();
};

export const PostList: React.FC<{ posts; mutateCallback; setActivePost; apiKey }> = ({
  posts,
  mutateCallback,
  setActivePost,
  apiKey
}) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>question</th>
          <th>answer</th>
          <th>delete!</th>
        </tr>
        {posts.map((post) => (
          <tr key={post.question}>
            <td>{post.question}</td>
            <td onClick={() => setActivePost(post)}>{post.answer}</td>
            <td onClick={() => deletePost(post.id, apiKey, mutateCallback)}>delete</td>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        * {
          margin: 0.2rem;
          padding: 0.2rem;
        }
        td {
          vertical-align: top;
          background-color: #32302f;
        }
      `}</style>
    </table>
  );
};

export default PostList;
