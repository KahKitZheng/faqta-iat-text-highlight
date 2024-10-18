import { useEffect, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import "./TextHighlightLayout.scss";

type TextHighlightLayoutProps = {
  data: Data;
  controlledAnswers: HighlightSubmitAnswer[];
  setControlledAnswers: React.Dispatch<
    React.SetStateAction<HighlightSubmitAnswer[]>
  >;
};

export default function TextHighlightLayout(
  props: Readonly<TextHighlightLayoutProps>
) {
  const { data, controlledAnswers, setControlledAnswers } = props;

  // extend the data with fields that are used on the client-side
  const givenAnswers: HighlightSubmitAnswer[] = data.answers.map((answer) => ({
    ...answer,
    isSelected: undefined,
    isCorrect: undefined,
  }));

  const [selectedAnswers, setSelectedAnswers] = useState(givenAnswers);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [correctTotalAnswersCount, setCorrectTotalAnswersCount] = useState(0);
  const [submitButtonLabel, setSubmitButtonLabel] = useState<JSX.Element>(
    <>Inleveren</>
  );

  function handleOnClickAnswer(answerIndex: number) {
    const updatedAnswers = [...selectedAnswers];

    if (
      updatedAnswers[answerIndex].isCorrect !== undefined &&
      updatedAnswers[answerIndex].isSelected === undefined
    ) {
      updatedAnswers[answerIndex].isSelected = false;
    } else {
      updatedAnswers[answerIndex].isSelected =
        !updatedAnswers[answerIndex].isSelected;
    }

    setSelectedAnswers(updatedAnswers);
  }

  function resetAnswers() {
    setSelectedAnswers(givenAnswers);
    setControlledAnswers([]);
  }

  function handleSubmit() {
    let correctAnswers = 0;
    let correctTotalAnswers = 0;

    const copySelectedAnswers = [...selectedAnswers];

    // if everything is correct, then finish the assignment.
    // There is no need to update the status of each answers anymore.
    setIsFinished(
      [...selectedAnswers].every((answer) => {
        return answer.isSelected === undefined
          ? answer.isAnswer === false
          : answer.isAnswer === answer.isSelected;
      })
    );

    // Update each answer with the correct status
    copySelectedAnswers.forEach((answer) => {
      const index = copySelectedAnswers.findIndex(
        (controlledAnswer) => controlledAnswer.id === answer.id
      );

      // count the correct and total correct answers
      if (answer.isAnswer) {
        correctTotalAnswers++;
      }
      if ((answer.isAnswer && answer.isSelected) || answer.isCorrect) {
        correctAnswers++;
        copySelectedAnswers[index].isCorrect = true;
      }
      // if an answer is selected, verify it's result
      if (answer.isSelected !== undefined) {
        copySelectedAnswers[index].isCorrect = answer.isSelected
          ? answer.isSelected && answer.isAnswer
          : undefined;
      }

      // reset the selected status of incorrect answers so the correct styling can be applied
      if (!copySelectedAnswers[index].isCorrect) {
        copySelectedAnswers[index].isSelected = undefined;
      }
    });

    setCorrectAnswersCount(correctAnswers);
    setCorrectTotalAnswersCount(correctTotalAnswers);
    setControlledAnswers(copySelectedAnswers);
  }

  function getSubmitAnswerStyling(answerIndex: number) {
    const isSubmitted = controlledAnswers.length;
    const isSelected = controlledAnswers[answerIndex]?.isSelected !== undefined;
    const isCorrectAnswer = controlledAnswers[answerIndex]?.isCorrect;

    if (isSubmitted && isCorrectAnswer) {
      return "correct";
    }
    if (isSubmitted && isCorrectAnswer === false && !isSelected) {
      return "incorrect";
    }
    return "";
  }

  // Render the correct submit button
  useEffect(() => {
    if (!controlledAnswers.length) {
      return setSubmitButtonLabel(<>Inleveren</>);
    }

    if (controlledAnswers.length && isFinished) {
      return setSubmitButtonLabel(
        <>
          Helemaal goed <FaCheck />
        </>
      );
    }
    if (controlledAnswers.length && !isFinished) {
      return setSubmitButtonLabel(
        <>
          {correctAnswersCount}/{correctTotalAnswersCount} goeie antwoorden
          gevonden <IoWarning />
        </>
      );
    }
  }, [
    controlledAnswers.length,
    correctAnswersCount,
    correctTotalAnswersCount,
    isFinished,
  ]);

  return (
    <div className="text-place-layout">
      <div className="question-area">
        <p className="title">{data.title}</p>
        <div className="text">
          {selectedAnswers.map((answer, index) => (
            <button
              key={index}
              className={`answer ${
                answer.isSelected ? "selected" : ""
              } ${getSubmitAnswerStyling(index)} ${
                answer.text === " " ? "space" : ""
              }`}
              onClick={() => handleOnClickAnswer(index)}
              disabled={isFinished || controlledAnswers[index]?.isCorrect}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
      <div className="footer">
        <button
          className="button reset"
          onClick={resetAnswers}
          disabled={isFinished}
        >
          Opnieuw proberen
        </button>
        <button
          className={`button submit ${
            controlledAnswers.length ? "incorrect" : ""
          } ${controlledAnswers.length && isFinished ? "correct" : ""}`}
          onClick={handleSubmit}
          disabled={isFinished}
        >
          {submitButtonLabel}
        </button>
      </div>
    </div>
  );
}
