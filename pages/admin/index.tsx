import React from "react";
import Link from "next/link";
import { PostList, PostProps, updatePost, usePosts } from "components/Post";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HyperLink from "@tiptap/extension-link";
import EditorMenu from "components/admin/EditorMenu";

const SaveButton: React.FC<{
  post: PostProps;
  editor: Editor;
  mutateCallback: Function;
}> = ({ post, editor, mutateCallback }) => {
  return post ? (
    <div
      onClick={() =>
        updatePost(post.id, { answer: editor.getHTML() }, mutateCallback)
      }
    >
      save!
    </div>
  ) : (
    <div>no post selected</div>
  );
};
const AdminPanel: React.FC = () => {
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
      <SaveButton post={activePost} editor={editor} mutateCallback={mutate} />
      <PostList
        setActivePost={setActivePost}
        posts={isLoading ? [] : posts.list}
        mutateCallback={mutate}
      />
      <footer>
        <Link href="/">home</Link>
      </footer>
    </div>
  );
};

const Admin: React.FC = () => {
  return <AdminPanel />;
};
export default Admin;
