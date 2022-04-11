import { usePost } from "../components/Post";
import React, { useEffect } from "react";

const updateAnswer = (callback, answerCallback, post) => {
  callback(document.getElementById("searchbar").innerText);
};

const SearchBar: React.FC<{ answerCallback: Function }> = ({
  answerCallback,
}) => {
  const [ input, setInput ] = React.useState();
  const { post, isLoading } = usePost(encodeURIComponent(input));
  useEffect(() => {
    if (post) answerCallback(post.answer)
  })
  return (
    <div
      id="searchbar"
      contentEditable={true}
      onInput={(e) => {
        updateAnswer(setInput, answerCallback, post);
      }}
    ></div>
  );
};

export default SearchBar;
