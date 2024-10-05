import React, { useEffect, useRef } from "react";
import "./TextArea.scss";

type TextAreaProps = {
  // Mandatory
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // Basic options
  placeholder?: string;
  hideScrollbar?: boolean;
  baseHeight?: string;
  baseWidth?: string;
  // Size behavior
  grow?: boolean; // dynamic height depending on input
  // Character limit
  charLimit?: { softLimit?: number; hardLimit?: number };
  // Styling
  isWhite?: boolean;
  isDisabled?: boolean;
};

export default function TextArea(props: Readonly<TextAreaProps>) {
  const {
    value,
    onChange,
    placeholder,
    baseHeight = "40px",
    baseWidth,
    grow,
    charLimit,
    hideScrollbar,
    isWhite,
    isDisabled,
  } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleTyping(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = e.target.value;

    // If there is no char limit, update value
    if (charLimit?.hardLimit === undefined) {
      return onChange(e);
    }

    const hasExceededHardLimit = inputValue.length > charLimit?.hardLimit;
    const hasExceededStoreData = inputValue.length > value?.length;

    // If there is a limit, prevent user from adding text if it's not
    // within the hard limit. The user can remove text though.
    if (hasExceededHardLimit && hasExceededStoreData) {
      return;
    }

    onChange(e);
  }

  // Change the height of the textarea depending on the text
  function growTextArea() {
    if (textAreaRef.current === null) {
      return;
    }

    if (grow === true) {
      // Set the initial height to get the correct scrollHeight for textarea
      textAreaRef.current.style.height = baseHeight ?? "auto";

      // Grow the height of the element along with the text
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }

  // Expand textarea vertically if `grow` prop is set to true
  useEffect(() => {
    growTextArea();

    window.addEventListener("resize", growTextArea);
    return () => window.removeEventListener("resize", growTextArea);
  }, [textAreaRef?.current, value]);

  return (
    <div className="textarea-wrapper">
      <div className="textarea-editor" style={{ width: baseWidth }}>
        <textarea
          ref={textAreaRef}
          style={{ height: baseHeight || "auto" }}
          className={`textarea ${isWhite ? "bg-white" : ""} ${
            hideScrollbar ? "hide-scrollbar" : ""
          }`}
          value={value}
          onChange={handleTyping}
          placeholder={placeholder}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
