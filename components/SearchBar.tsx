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
    <input
      className={"search-bar" + (contentBelow ? " content-below" : "")}
      value={query ??= ""}
      placeholder={" "}
      onChange={(event) => {
        console.log(event.target.value)
        setQuery(event.target.value);
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
