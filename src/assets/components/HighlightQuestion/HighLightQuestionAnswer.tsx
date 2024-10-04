import "./HighLightQuestionAnswer.scss";

type HighLightQuestionAnswerProps = {
  answerIndex: number;
  answer: Answer;
  isDeleteMode: boolean;
  handleOnClickAnswer: (answerIndex: number) => void;
};

export default function HighLightQuestionAnswer(
  props: Readonly<HighLightQuestionAnswerProps>
) {
  const { answerIndex, answer, isDeleteMode, handleOnClickAnswer } = props;

  function handleSpaceStyle(text: string) {
    if (text === " " && isDeleteMode) {
      return "space-delete";
    }
    if (text === " ") {
      return "space";
    }
    return null;
  }

  return (
    <button
      key={answerIndex}
      className={`answer-option ${answer.isAnswer ? "selected" : ""} ${
        isDeleteMode ? "delete" : ""
      } ${handleSpaceStyle(answer.text)}`}
      onClick={() => handleOnClickAnswer(answerIndex)}
    >
      {answer.text}
    </button>
  );
}
