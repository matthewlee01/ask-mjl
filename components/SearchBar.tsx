import React, { useEffect } from "react";

const updateAnswer = (callback) => {
  callback(document.getElementById("searchbar").innerText);
};

const submitNewQuestion = async (query) => {
  console.log(`submitting new: ${query}`);
  document.getElementById("searchbar").innerHTML = "question submitted!"
  await fetch("/api/post/create", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      question: query
    })
  });
  document.getElementById("searchbar").innerHTML = ""
}

const operandSearch = async (query) => {
  console.log(`operanding: ${query}`);
  const data = await (await fetch(`/api/post/search?q=${query}`)).json();
  console.log('received operand data:');
  console.log(data);
  return data;
}

const SearchBar: React.FC<{ setSimilarPosts : Function }> = ({
  setSimilarPosts,
}) => {
  const [ query, setQuery ] = React.useState("");
    React.useEffect(() => {
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
    }, [query, setSimilarPosts ] );
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
          if (e.key == 'Enter') {
            e.preventDefault();
            submitNewQuestion(query);
          }
        }}
      ></div>
    </>
  );
};

export default SearchBar;
