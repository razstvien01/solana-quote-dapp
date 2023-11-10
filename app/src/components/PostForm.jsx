import { FC, ReactNode, useState } from "react";
import { Button } from "src/components/Button";
import { useBlog } from "src/context/Blog";

export const PostForm = (props) => {
  const { user } = useBlog();
  const {
    onSubmit,
    postTitle,
    postContent,
    setPostContent,
    setPostTitle,
    formHeader,
    buttonText = "Add Quote",
  } = props;
  const [loading, setLoading] = useState(false);

  return (
    <div className="rounded-lg py-4 px-6 bg- flex flex-col ">
      {formHeader}
      <h1 className="font-bold text-xl">Add Quote</h1>
      <span className="pt-5 pb-5">
        {
          "Quotes provide us with condensed wisdom, inspire us, provoke thought, and can offer guidance or a fresh perspective on life and various situations."
        }
      </span>
      <input
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        type="text"
        placeholder="Input Author"
        className="bg-white rounded-3xl h-10 px-4 black"
      />
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        name="content"
        id="content-area"
        rows={3}
        placeholder="Input the quote here..."
        className="bg-white rounded-xl px-4 py-2 mt-3 black"
      ></textarea>
      <Button
        className="mt-3"
        disabled={!user}
        loading={loading}
        onClick={async () => {
          setLoading(true);
          await onSubmit();
          setLoading(false);
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};
