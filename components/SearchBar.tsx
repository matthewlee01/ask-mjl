import { ReactElement } from "react";

const Typeahead = ({
  queryLength,
  autocomplete,
}: {
  queryLength: number;
  autocomplete: string;
}): ReactElement => {
  return autocomplete ? (
    <div className={"typeahead"}>
      <span className="hidden">{autocomplete.slice(0, queryLength)}</span>
      <span>{autocomplete.slice(queryLength)}</span>
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
      <Typeahead queryLength={query.length} autocomplete={autocomplete} />
    </div>
  );
};

export default SearchBar;
