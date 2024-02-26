import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
 
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "code"],
    ["clean"],
  ],
};
 
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "code",
];
 
interface OnChangeHandler {
  (e: any): void;
}
 
type textEditorProps = {
  enteredText: string;
  placeholder: string;
  onTyping: OnChangeHandler;
};
 
export const TextEditor: React.FC<textEditorProps> = ({enteredText,placeholder,onTyping}) => {
    // console.log(enteredText)
  return (
    <>
      <ReactQuill
        
        theme="snow"
        value={enteredText || ""}
        modules={modules}
        formats={formats}
        onChange={onTyping}
        placeholder={placeholder}
      /> 

    </>
  );
};
 
