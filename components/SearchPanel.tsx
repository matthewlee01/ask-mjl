import React, { ReactElement, useEffect } from "react";
import { Trie } from "mnemonist";
import SearchBar from "components/SearchBar";

interface Post {
  question: string;
  answer: string;
}

const submitNewQuestion = async (
  query: string,
  setQuery: Function
): Promise<void> => {
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

const findPost = async (
  query: string,
  setMatchedPost: Function,
  setRelatedPosts: Function
): Promise<void> => {
  const data = await (await fetch(`/api/post/${query}`)).json();
  if (data.post) {
    setMatchedPost(data.post);
    setRelatedPosts(data.related);
  } else {
    setMatchedPost(null);
  }
};

const operandPing = (
  query: string,
  setSimilarPosts: Function
): (() => void) => {
  let currentQuery = query;
  if (currentQuery.length == 0) {
    setSimilarPosts([]);
    return;
  }
  const delayed = setTimeout(async () => {
    const res = await (await fetch(`/api/post/search?q=${query}`)).json();
    if (currentQuery === query) {
      setSimilarPosts(res);
    }
  }, 180);
  return () => clearTimeout(delayed);
};

const searchTrie = (query: string, trie: Trie<string>): string[] => {
  if (query == "") {
    return [];
  } else {
    return trie
      .find(query.trim())
      .slice(0, 8)
      .sort((x, y) => x.length - y.length)
      .filter((match) => match != query);
  }
};

const PostListItem = ({
  question,
  callback,
}: {
  question: string;
  callback: Function;
}): ReactElement => (
  <div>
    <span
      onClick={() => {
        callback(question);
        document.getElementById("searchBar").innerHTML = question;
      }}
    >
      {question}
    </span>
  </div>
);

const MatchedPostPanel = ({
  matchedPost,
  relatedPosts,
  setQuery,
}: {
  matchedPost: Post;
  relatedPosts: Post[];
  setQuery: Function;
}): ReactElement => (
  <>
    <div
      className={"found-post"}
      dangerouslySetInnerHTML={{ __html: matchedPost.answer }}
    ></div>
    <div className={"related post-list"}>
      {relatedPosts.map((post) => (
        <PostListItem
          key={post.question}
          question={post.question}
          callback={setQuery}
        />
      ))}
    </div>
  </>
);

const MatchList = ({
  matches,
  similarPosts,
  setQuery,
}: {
  matches: string[];
  similarPosts: Post[];
  setQuery: Function;
}): ReactElement => (
  <>
    <div className={"matches post-list"}>
      {matches.map((match) => (
        <PostListItem key={match} question={match} callback={setQuery} />
      ))}
    </div>
    <div className={"similar post-list"}>
      {similarPosts
        .filter((post) => !matches.find((match) => match == post.question))
        .map((post) => (
          <PostListItem
            key={post.question}
            question={post.question}
            callback={setQuery}
          />
        ))}
    </div>
  </>
);

const SearchPanel = ({ trie }): ReactElement => {
  const [query, setQuery] = React.useState<string>("");
  const [similarPosts, setSimilarPosts] = React.useState([]);
  const [matches, setMatches] = React.useState<string[]>([]);
  const [matchedPost, setMatchedPost] = React.useState(null);
  const [relatedPosts, setRelatedPosts] = React.useState(null);

  useEffect(() => {
    findPost(query, setMatchedPost, setRelatedPosts);
    setMatches(searchTrie(query, trie));
    return operandPing(query, setSimilarPosts);
  }, [query, trie]);

  return (
    <>
      <SearchBar
        setQuery={setQuery}
        submitNewQuestion={submitNewQuestion}
        query={query}
        matchedPost={matchedPost}
      />
      {matchedPost ? (
        <MatchedPostPanel
          matchedPost={matchedPost}
          relatedPosts={relatedPosts}
          setQuery={setQuery}
        />
      ) : (
        <MatchList
          similarPosts={similarPosts}
          matches={matches}
          setQuery={setQuery}
        />
      )}
    </>
  );
};

export default SearchPanel;
