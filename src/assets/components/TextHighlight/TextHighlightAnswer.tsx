import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./TextHighlightAnswer.scss";

type TextHighlightAnswerProps = {
  mode: "default" | "delete" | "sort";
  answer: HighlightAnswer;
  answerId: string;
  answerIndex: number;
  handleOnClickAnswer: (answerIndex: number) => void;
  updateAnswer: (answerIndex: number, newAnswer: string) => void;
  deleteAnswer(answerIndex: number): void;
  isDragged?: boolean;
};

export default function HighLightQuestionAnswer(
  props: Readonly<TextHighlightAnswerProps>
) {
  const {
    answer,
    answerId, // separate, because you need to pass id separately to DragOverlay
    answerIndex,
    handleOnClickAnswer,
    updateAnswer,
    deleteAnswer,
    isDragged,
    mode,
  } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    activeIndex,
    index,
  } = useSortable({ id: answerId });

  const [isEditing, setIsEditing] = useState(false);

  const isDeleteMode = mode === "delete";
  const isSortMode = mode === "sort";

  function handleSpaceStyle(text: string) {
    if (text === " " && isDeleteMode) {
      return "space-delete";
    }
    if (text === " ") {
      return "space";
    }
    return null;
  }

  function dragOpacity() {
    if (isDragged) {
      return 0;
    }
    if (index >= 0 && activeIndex === index) {
      return 0.5;
    }
    return 1;
  }

  function handleFinishEditing(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && answer.text === "") {
      return;
    }
    if (e.key === "Enter" && answer.text === "") {
      return deleteAnswer(answerIndex);
    }
    if (e.key === "Enter") {
      return setIsEditing(false);
    }
  }

  return isEditing ? (
    <input
      type="text"
      className="answer-option-update"
      value={answer.text}
      onChange={(e) => updateAnswer(answerIndex, e.target.value)}
      onKeyDown={handleFinishEditing}
    />
  ) : (
    <button
      ref={setNodeRef}
      className={`answer-option ${answer.isAnswer ? "selected" : ""} ${
        isDeleteMode ? "delete" : ""
      } ${handleSpaceStyle(answer.text)}`}
      style={{
        opacity: dragOpacity(),
        transform: CSS.Translate.toString(transform),
        transition: transition,
      }}
      onClick={() => handleOnClickAnswer(answerIndex)}
      onDoubleClick={() => setIsEditing(true)}
      {...(isSortMode ? attributes : {})}
      {...(isDeleteMode ? {} : listeners)}
    >
      {answer.text}
    </button>
  );
}
