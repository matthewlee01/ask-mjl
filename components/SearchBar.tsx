import React, { useEffect } from "react";
import { Trie } from "mnemonist";

const updateAnswer = (callback) => {
  callback(document.getElementById("searchbar").innerText);
};

const submitNewQuestion = async (query) => {
  console.log(`submitting new: ${query}`);
  document.getElementById("searchbar").innerHTML = "question submitted!";
  await fetch("/api/post/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: query,
    }),
  });
  document.getElementById("searchbar").innerHTML = "";
};

const operandSearch = async (query) => {
  console.log(`operanding: ${query}`);
  const data = await (await fetch(`/api/post/search?q=${query}`)).json();
  console.log("received operand data:");
  console.log(data);
  return data;
};

const operandPing = (query, setSimilarPosts) => {
  console.log(query);
  let currentQuery = query;
  if (currentQuery.length == 0) {
    setSimilarPosts("");
    return;
  }
  const delayed = setTimeout(async () => {
    const res = await operandSearch(query);
    if (currentQuery === query) {
      setSimilarPosts(res);
    }
  }, 180);
  return () => clearTimeout(delayed);
};

const SearchBar: React.FC<{
  setSimilarPosts: Function;
  trie: Trie<string>;
}> = ({ setSimilarPosts, trie }) => {
  const [query, setQuery] = React.useState<string>("");
  React.useEffect(() => {
    setMatches(
      query == ""
        ? []
        : trie
            .find(query.trim())
            .slice(0, 5)
            .filter((match) => match != query)
    );
  }, [query, trie]);
  const [matches, setMatches] = React.useState<string[]>([]);
  return (
    <>
      search v
      <div
        id="searchbar"
        contentEditable={true}
        onInput={() => {
          updateAnswer(setQuery);
        }}
        onKeyPress={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            submitNewQuestion(query);
          }
        }}
      />
      {matches.map((match) => (
        <div
          key={match}
          onClick={() => {
            setQuery(match);
            document.getElementById("searchbar").innerHTML = match;
          }}
        >
          {match}
        </div>
      ))}
      <div
        onClick={() => {
          operandPing(query, setSimilarPosts);
        }}
      >
        operand search
      </div>
    </>
  );
};

export default SearchBar;
