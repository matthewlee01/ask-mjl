import { setQuarter } from "date-fns";
import { ReactElement } from "react";

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
        placeholder={" "}
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
      <div className={"autocomplete"}>
        {(autocomplete ??= "")}
        {autocomplete ? (
          <span className={"enter-icon"}>
            {" "}
            ↵
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
