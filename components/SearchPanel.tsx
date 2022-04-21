import React, { useEffect } from "react";
import { Trie } from "mnemonist";
import SearchBar from "components/SearchBar";
import { match } from "assert";

const submitNewQuestion = async (query, setQuery) => {
  document.getElementById("searchbar").innerHTML = "question submitted!";
  await fetch("/api/post/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: query,
    }),
  });
  document.getElementById("searchbar").innerHTML = "";
  setQuery("");
};

const findPost = async (query, setMatchedPost) => {
  const data = await (await fetch(`/api/post/${query}`)).json();
  if (data.post) {
    setMatchedPost(data.post);
  } else {
    setMatchedPost(null);
  }
};

const operandSearch = async (query) => {
  return await (await fetch(`/api/post/search?q=${query}`)).json();
};

const SearchPanel: React.FC<{
  trie: Trie<string>;
}> = ({ trie }) => {
  const [query, setQuery] = React.useState<string>("");
  const [similarPosts, setSimilarPosts] = React.useState([]);
  const [matches, setMatches] = React.useState<string[]>([]);
  const [matchedPost, setMatchedPost] = React.useState(null);
  useEffect(() => {
    findPost(query, setMatchedPost);
    setMatches(
      query == ""
        ? []
        : trie
            .find(query.trim())
            .slice(0, 8)
            .filter((match) => match != query)
    );
  }, [query, trie]);
  useEffect(() => {
    let currentQuery = query;
    if (currentQuery.length == 0) {
      setSimilarPosts([]);
      return;
    }
    const delayed = setTimeout(async () => {
      const res = await operandSearch(query);
      if (currentQuery === query) {
        setSimilarPosts(
          res.filter((post) => !matches.find((match) => match == post.title))
        );
      }
    }, 180);
    return () => clearTimeout(delayed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const MatchList = () => (
    <div id={"autocompletes"}>
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
      <style jsx>{`
        #autocompletes {
          padding: 0.2rem;
          border-left: 0.2rem solid #fabd2f;
        }

        #autocompletes:empty {
          display: none;
        }
      `}</style>
    </div>
  );
  const MatchedPostPanel = () => (
    <div
      id={"matched-post"}
      dangerouslySetInnerHTML={{ __html: matchedPost.answer }}
    ></div>
  );

  return (
    <>
      <SearchBar
        setQuery={setQuery}
        submitNewQuestion={submitNewQuestion}
        query={query}
      />
      {matchedPost ? <MatchedPostPanel /> : <MatchList />}
      <div id={"similars"}>
        {similarPosts.map((post) => {
          return (
            <div
              key={post.title}
              onClick={() => {
                setQuery(post.title);
                document.getElementById("searchbar").innerHTML = post.title;
              }}
            >
              {post.title}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        #similars {
          padding: 0.2rem;
          border-radius: 0.2rem;
          border-left: 0.2rem solid #fe8019;
        }

        #similars:empty {
          display: none;
        }
      `}</style>
    </>
  );
};

export default SearchPanel;
