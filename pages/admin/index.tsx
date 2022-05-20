import React from "react";
import Link from "next/link";
import { PostList, PostProps, updatePost, usePosts } from "components/Post";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HyperLink from "@tiptap/extension-link";
import EditorMenu from "components/admin/EditorMenu";

export async function getServerSideProps(context) {
  return {
    props: {apiKey: process.env.API_KEY}, 
  }
}

const SaveButton: React.FC<{
  post: PostProps;
  editor: Editor;
  apiKey: string;
  mutateCallback: Function;
}> = ({ post, editor, apiKey, mutateCallback }) => {
  return post ? (
    <div
      onClick={() =>
        updatePost(post.id, { answer: editor.getHTML() }, apiKey, mutateCallback)
      }
    >
      save! {post.question}
    </div>
  ) : (
    <div>no post selected</div>
  );
};

const Admin: React.FC<{ apiKey: string }> = ({ apiKey }) => {
  const [activePost, setActivePost] = React.useState<PostProps>(null);
  const { posts, isLoading, mutate } = usePosts();
  const editor: Editor = useEditor({
    extensions: [StarterKit, HyperLink],
    content: "",
  });
  React.useEffect(() => {
    editor?.commands.setContent(activePost?.answer);
  }, [activePost, editor]);

  const setLink = React.useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
        target: url.includes(window.location.hostname) ? "_self" : "_blank",
      })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <h1>admin</h1>
      <EditorMenu editor={editor} setLink={setLink} />
      <EditorContent editor={editor} />
      <SaveButton post={activePost} editor={editor} apiKey={apiKey} mutateCallback={mutate} />
      <PostList
        setActivePost={setActivePost}
        posts={isLoading ? [] : posts.list}
        mutateCallback={mutate}
        apiKey={apiKey}
      />
      <footer>
        <Link href="/">home</Link>
      </footer>
    </div>
  );
};

export default Admin;
