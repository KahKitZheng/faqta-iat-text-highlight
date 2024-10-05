import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./HighLightQuestionAnswer.scss";

type HighLightQuestionAnswerProps = {
  mode: "default" | "delete" | "sort";
  answer: HighlightAnswer;
  answerId: string;
  answerIndex: number;
  handleOnClickAnswer: (answerIndex: number) => void;
  isDragged?: boolean;
};

export default function HighLightQuestionAnswer(
  props: Readonly<HighLightQuestionAnswerProps>
) {
  const {
    answer,
    answerId, // separate, because you need to pass id separately to DragOverlay
    answerIndex,
    handleOnClickAnswer,
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

  return (
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
      {...(isSortMode ? attributes : {})}
      {...(isDeleteMode ? {} : listeners)}
    >
      {answer.text}
    </button>
  );
}
