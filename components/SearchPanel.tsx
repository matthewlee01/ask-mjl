import React, { ReactElement, useEffect, useRef } from "react";
import { Trie } from "mnemonist";
import SearchBar from "components/SearchBar";
import Submit from "components/Submit";

interface Post {
  question: string;
  answer: string;
}

const submitNewQuestion = async (
  query: string,
  email: string,
  setQuery: Function
): Promise<void> => {
  await fetch("/api/post/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: query,
      email: email,
    }),
  });
  setQuery("");
};

const fetchRelatedPosts = async (
  operandId: string,
  setRelatedPosts: Function
): Promise<void> => {
  const res = await (await fetch(`/api/post/related?q=${operandId}`)).json();
  setRelatedPosts(res);
};

const setURLQuery = (query: string): void => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("query", query);
  const newUrl =
    window.location.origin +
    window.location.pathname +
    "?" +
    urlParams.toString();
  window.history.replaceState({ path: newUrl }, "", newUrl);
};

const findPost = async (
  query: string,
  setMatchedPost: Function,
  setRelatedPosts: Function
): Promise<void> => {
  const data = await (
    await fetch(`/api/post/${encodeURIComponent(query)}`)
  ).json();
  if (data.post) {
    setMatchedPost(data.post);
    setRelatedPosts([]);
    fetchRelatedPosts(data.post.operandId, setRelatedPosts);
    setURLQuery(query);
  } else {
    setMatchedPost(null);
    setRelatedPosts([]);
  }
};

const operandPing = (
  query: string,
  setSimilarPosts: Function
): (() => void) => {
  let currentQuery = query;
  if (!currentQuery) {
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
  if (!query || query == "") {
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
}): ReactElement => {
  return (
    <div
      className="clickable post-list-item"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key == "Enter") callback(question);
      }}
      onClick={() => {
        callback(question);
      }}
    >
      {question}
    </div>
  );
};

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
      className={"found-post content-panel"}
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
      {matches.slice(1).map((match) => (
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
  const [query, setQuery] = React.useState<string>();
  const [similarPosts, setSimilarPosts] = React.useState<Post[]>([]);
  const [matches, setMatches] = React.useState<string[]>([]);
  const [matchedPost, setMatchedPost] = React.useState<Post>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<Post[]>([]);
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  useEffect(() => {
    if (query != undefined) findPost(query, setMatchedPost, setRelatedPosts);
    if (query == "") setSubmitting(false);
    setMatches(searchTrie(query, trie));
    return operandPing(query, setSimilarPosts);
  }, [query, trie]);
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const urlQuery = url.get("query");
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, []);
  useEffect(() => {
    if (matchedPost) setSubmitting(false);
  }, [matchedPost])

  return (
    <>
      <SearchBar
        setQuery={setQuery}
        submit={() => setSubmitting(true)}
        query={query}
        contentBelow={(matchedPost || submitting) as boolean}
        autocomplete={matches[0]}
      />
      {submitting ? (
        <Submit
          submitQuestion={(email) => submitNewQuestion(query, email, setQuery)}
          setSubmitting={setSubmitting}
        />
      ) : null}
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
