import { usePost } from "../components/Post";
import React, { useEffect } from "react";

const updateAnswer = (callback) => {
  callback(document.getElementById("searchbar").innerText);
};

const submitQuestion = () => {
  let question: string = document.getElementById("searchbar").innerText;
  console.log(`submitting ${question}`);
  fetch("/api/post/create", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      question: question
    })
  })
}
const SearchBar: React.FC<{ answerCallback: Function }> = ({
  answerCallback,
}) => {
  const [ input, setInput ] = React.useState();
  const { post } = usePost(encodeURIComponent(input));
  useEffect(() => {
    if (post) answerCallback(post.answer)
  })
  return (
    <>
      search v
      <div
        id="searchbar"
        contentEditable={true}
        onInput={() => {
          updateAnswer(setInput);
        }}
        onKeyPress={(e) => {
          if (e.key == 'Enter') {
            e.preventDefault();
            submitQuestion();
          }
        }}
      ></div>
    </>
  );
};

export default SearchBar;
