import { ReactElement } from "react";

const Typeahead = ({
  query,
  autocomplete,
}: {
  query: string;
  autocomplete: string;
}): ReactElement => {
  return autocomplete ? (
    <div className={"typeahead"}>
      <span className="hidden">{query}</span>
      <span>{autocomplete.slice(query.length)}</span>
      <span className={"enter-icon"}> ↵</span>
    </div>
  ) : null;
};

const SearchBar = ({
  setQuery,
  submit,
  query,
  contentBelow,
  autocomplete,
}: {
  setQuery: Function;
  submit: Function;
  query: string;
  contentBelow: boolean;
  autocomplete: string;
}): ReactElement => {
  return (
    <div className={"search-container"}>
      <input
        className={
          "traversable search-bar" + (contentBelow ? " content-below" : "")
        }
        value={(query ??= "")}
        placeholder={"ask matthew anything..."}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key == "Enter" && !contentBelow) {
            e.preventDefault();
            if (autocomplete) {
              setQuery(autocomplete);
            } else {
              submit();
            }
          }
        }}
      />
      <Typeahead query={query} autocomplete={autocomplete} />
    </div>
  );
};

export default SearchBar;
