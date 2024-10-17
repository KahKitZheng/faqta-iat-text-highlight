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

  const givenAnswers: HighlightSubmitAnswer[] = data.answers.map((answer) => ({
    ...answer,
    isSelected: undefined,
    isCorrect: undefined,
  }));

  const allCorrect = controlledAnswers.every(
    (answer) => answer.isAnswer === !!answer.isSelected
  );

  const [selectedAnswers, setSelectedAnswers] = useState(givenAnswers);
  const [submitButtonLabel, setSubmitButtonLabel] = useState<JSX.Element>(
    <>Inleveren</>
  );
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [correctTotalAnswersCount, setCorrectTotalAnswersCount] = useState(0);

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

  console.log("copySelectedAnswers", selectedAnswers);

  function handleSubmit() {
    const copySelectedAnswers = [...selectedAnswers];
    let correctAnswers = 0;
    let correctTotalAnswers = 0;

    setIsFinished(
      [...selectedAnswers].every(
        (answer) => answer.isAnswer === !!answer.isSelected
      )
    );

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
      // if ((answer.isAnswer && answer.isSelected) || answer.isCorrect) {
      // }
      // if an answer is selected, verify it's result
      if (answer.isSelected !== undefined) {
        copySelectedAnswers[index].isCorrect = answer.isSelected
          ? answer.isSelected && answer.isAnswer
          : undefined;
      }

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

    // if (
    //   (isSubmitted && !isCorrectAnswer && isSelected) ||
    //   (isSubmitted && !isCorrectAnswer && !isSelected)
    // ) {
    //   return "";
    // }
    if (isSubmitted && isCorrectAnswer) {
      return "correct";
    }
    if (isSubmitted && isCorrectAnswer === false && !isSelected) {
      return "incorrect";
    }
  }

  useEffect(() => {
    // const allCorrect = controlledAnswers.every((answer) => {
    //   return answer.isAnswer === answer.isSelected;
    // });

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
    allCorrect,
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
              } ${getSubmitAnswerStyling(index)}`}
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
