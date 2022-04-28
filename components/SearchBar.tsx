import { ReactElement } from "react";

const SearchBar = ({
  setQuery,
  submitNewQuestion,
  query,
  matchedPost,
}: {
  setQuery: Function;
  submitNewQuestion: Function;
  query: string;
  matchedPost: Object;
}): ReactElement => {
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
