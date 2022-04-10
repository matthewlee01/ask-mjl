import React from "react";
import { parseJSON, format } from 'date-fns'

export type PostProps = {
  id: string;
  question: string;
  answer: string | null;
  askerEmail: string | null;
  approved: boolean;
  createdAt: Date;
};

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

export default Post;
