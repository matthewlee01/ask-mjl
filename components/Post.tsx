import React from "react";
import { parseJSON, format } from 'date-fns'
import useSWR, { mutate } from 'swr'

export type PostProps = {
  id: string;
  question: string;
  answer: string | null;
  askerEmail: string | null;
  approved: boolean;
  createdAt: Date;
};

const fetcher = (arg) => fetch(arg).then(res => res.json())

export function usePosts () {
  const { data, error, mutate } = useSWR("/api/post/", fetcher) 
  console.log(data)
  return {
    posts: data,
    mutate: mutate,
    isLoading: !error && !data,
    isError: error
  }
}

export function usePost (id) {
  const { data, error } = useSWR(`/api/post/${id}`, fetcher)
  if (data) console.log(`recieved data: ${data.answer}`)
  return {
    post: data,
    isLoading: !error && !data,
    isError: error
  }
}

const Answer: React.FC<{ answer: string }> = ({ answer }) => {
  answer = answer ? answer : "<p>this question hasn't been answered yet!</p>"
  return (
    <div dangerouslySetInnerHTML={{__html: answer}} />
  )
}

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  return (
    <div>
      <h2>{post.question}</h2>
      <Answer answer={post.answer} />
      <time>{format(parseJSON(post.createdAt), 'LLLL d, yyyy')}</time>
    </div>
  );
};

const deletePost = async (id, refreshCallback) => {
  console.log(`deleting ${id}`);
  await fetch("/api/post/delete", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      id: id
    })
  })
  await refreshCallback();
}

const updatePost = async (id, data, refreshCallback) => {
  console.log(`updating ${id}`);
  await fetch("/api/post/update", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      id: id,
      data: data
    })
  })
  await refreshCallback();
}

export const PostList: React.FC = () => {
  const { posts, mutate, isLoading } = usePosts()
  return (isLoading ?
    (<div>loading...</div>) :
    (<table>
      <tr>
        <th>question</th>
        <th>answer</th>
        <th>approved?</th>
        <th>delete!</th>
      </tr>
      {posts.list.map((post) => (
        <tr key={post.question}>
          <td>{post.question}</td>
          <td>{post.answer}</td>
          <td onClick={() => updatePost(post.id, {approved: !post.approved}, mutate)}>{post.approved.toString()}</td>
          <td onClick={() => deletePost(post.id, mutate)}>delete</td>
        </tr>
      ))}
    </table>))
}

export default Post;
