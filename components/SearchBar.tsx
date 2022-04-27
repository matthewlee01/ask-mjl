import React from "react";

const SearchBar: React.FC<{
  setQuery;
  submitNewQuestion;
  query;
  matchedPost;
}> = ({ setQuery, submitNewQuestion, query, matchedPost }) => {
  return (
    <div
      id={"searchBar"}
      className={matchedPost ? "matched-query" : ""}
      contentEditable={true}
      onInput={() => {
        setQuery(document.getElementById("searchBar").innerText);
      }}
      onKeyPress={(e) => {
        if (e.key == "Enter") {
          e.preventDefault();
          submitNewQuestion(query, setQuery);
        }
      }}
    />
  );
};

export default SearchBar;
