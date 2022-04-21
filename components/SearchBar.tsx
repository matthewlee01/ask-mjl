import React from "react";

const SearchBar: React.FC<{ setQuery; submitNewQuestion; query }> = ({
  setQuery,
  submitNewQuestion,
  query,
}) => {
  return (
    <div>
      <div
        id="searchbar"
        contentEditable={true}
        onInput={() => {
          setQuery(document.getElementById("searchbar").innerText);
        }}
        onKeyPress={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            submitNewQuestion(query, setQuery);
          }
        }}
      />
      <style jsx>{`
        #searchbar {
          border: 0.2rem solid #b8bb26;
          border-radius: 0.2rem;
          padding: 0.2rem;
        }

        #searchbar:focus-within {
          outline: 0px solid transparent;
        }

        #searchbar:empty {
          border-color: #cc241d;
        }

        .matched {
          border-color: #83a598;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
