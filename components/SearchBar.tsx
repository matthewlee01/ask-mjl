import { ReactElement } from "react";

const SearchBar = ({
  setQuery,
  submit,
  query,
  contentBelow,
}: {
  setQuery: Function;
  submit: Function;
  query: string;
  contentBelow: boolean;
}): ReactElement => {
  return (
    <div
      id={"searchBar"}
      className={contentBelow ? "content-below" : ""}
      contentEditable={true}
      onInput={() => {
        setQuery(document.getElementById("searchBar").innerText);
      }}
      onKeyPress={(e) => {
        if (e.key == "Enter" && !contentBelow) {
          e.preventDefault();
          submit();
        }
      }}
    />
  );
};

export default SearchBar;
