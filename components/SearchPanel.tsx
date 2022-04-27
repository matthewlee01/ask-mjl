import React, { useEffect } from "react";
import { Trie } from "mnemonist";
import SearchBar from "components/SearchBar";

const submitNewQuestion = async (query, setQuery) => {
  document.getElementById("searchBar").innerHTML = "question submitted!";
  await fetch("/api/post/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: query,
    }),
  });
  document.getElementById("searchBar").innerHTML = "";
  setQuery("");
};

const findPost = async (query, setMatchedPost, setRelatedPosts) => {
  const data = await (await fetch(`/api/post/${query}`)).json();
  if (data.post) {
    setMatchedPost(data.post);
    setRelatedPosts(data.related);
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
  const [relatedPosts, setRelatedPosts] = React.useState(null);
  useEffect(() => {
    findPost(query, setMatchedPost, setRelatedPosts);
    setMatches(
      query == ""
        ? []
        : trie
            .find(query.trim())
            .slice(0, 8)
            .sort((x, y) => x.length - y.length)
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
          res.filter(
            (post) =>
              !matches.find((match) => match == post.title) &&
              post.title != query &&
              post.title != query + "?"
          )
        );
      }
    }, 180);
    return () => clearTimeout(delayed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const MatchList = () => (
    <>
      <div className={"matches post-list"}>
        {matches.map((match) => (
          <div
            key={match}
            onClick={() => {
              setQuery(match);
              document.getElementById("searchBar").innerHTML = match;
            }}
          >
            {match}
          </div>
        ))}
      </div>
      <div className={"similar post-list"}>
        {similarPosts.map((post) => {
          return (
            <div
              key={post.title}
              onClick={() => {
                setQuery(post.title);
                document.getElementById("searchBar").innerHTML = post.title;
              }}
            >
              {post.title}
            </div>
          );
        })}
      </div>
    </>
  );
  const MatchedPostPanel = () => (
    <>
      <div
        className={"found-post"}
        dangerouslySetInnerHTML={{ __html: matchedPost.answer }}
      ></div>
      <div className={"related post-list"}>
        {relatedPosts.map((post) => {
          return (
            <div
              key={post.title}
              onClick={() => {
                setQuery(post.title);
                document.getElementById("searchBar").innerHTML = post.title;
              }}
            >
              {post.title}
            </div>
          );
        })}
      </div>
    </>
  );
  return (
    <>
      <SearchBar
        setQuery={setQuery}
        submitNewQuestion={submitNewQuestion}
        query={query}
        matchedPost={matchedPost}
      />
      {matchedPost ? <MatchedPostPanel /> : <MatchList />}
    </>
  );
};

export default SearchPanel;
