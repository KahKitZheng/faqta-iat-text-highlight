import { useEffect, useState } from "react";
import { FaPlus, FaScissors, FaTrash } from "react-icons/fa6";
import TextFormatPopup from "./TextFormatPopup";
import "./HighlightQuestion.scss";
import HighLightQuestionAnswer from "./HighLightQuestionAnswer";

const exampleText =
  "De kat is gisteren naar huis gelopen. Dat vond Mimi persoonlijk niet zo leuk. Zij wilde liever nog even met de kat op het parkbankje zitten.";

export default function HighlightQuestion() {
  const [title, setTitle] = useState("");
  const [textToFormat, setTextToFormat] = useState(exampleText);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");

  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [isTextFormatPopupOpen, setIsTextFormatPopupOpen] = useState(false);

  function addAnswer() {
    const newAnswers = [...answers];

    newAnswers.push({
      text: newAnswer === " " ? newAnswer : newAnswer.trim(),
      isAnswer: false,
    });

    setAnswers(newAnswers);
  }

  function deleteAnswer(answerIndex: number) {
    const newAnswers = [...answers];
    newAnswers.splice(answerIndex, 1);
    setAnswers(newAnswers);
  }

  function deleteAllAnswers() {
    setAnswers([]);
  }

  function markTextAsAnswer(answerIndex: number) {
    const newAnswers = [...answers];
    newAnswers[answerIndex].isAnswer = !newAnswers[answerIndex].isAnswer;
    setAnswers(newAnswers);
  }

  function handleOnClickAnswer(answerIndex: number) {
    if (answers[answerIndex].text === " " && isDeleteMode) {
      return deleteAnswer(answerIndex);
    }
    if (answers[answerIndex].text === " ") {
      return;
    }

    return isDeleteMode
      ? deleteAnswer(answerIndex)
      : markTextAsAnswer(answerIndex);
  }

  function generateAnswers(format: string) {
    if (format === "letter") {
      const newAnswers = textToFormat.split("").map((letter) => ({
        text: letter,
        isAnswer: false,
      }));
      setAnswers(newAnswers);
    } else {
      // insert space before punctuation
      const formattedText = textToFormat.replace(/([.,!?])/g, " $1");

      // get all words
      const newAnswers = formattedText.split(" ").map((word) => ({
        text: word,
        isAnswer: false,
      }));

      setAnswers(newAnswers);
    }

    setTextToFormat("");
    setIsTextFormatPopupOpen(false);
  }

  useEffect(() => {
    setIsDeleteMode(answers.length === 0 ? false : isDeleteMode);
  }, [answers, isDeleteMode]);

  return (
    <div className="assignment-wrapper">
      <div>
        <p className="assignment-type">Markeervraag</p>
      </div>
      <input
        type="text"
        className="assignment-title-input"
        placeholder="Kies hier een leuke titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="assignment-text">
        <input
          type="text"
          className="assignment-text-input"
          placeholder="Type hier wat tekst of kopieer een alinea aan tekst, voor automatische transformatie..."
          value={textToFormat}
          onChange={(e) => setTextToFormat(e.target.value)}
        />
        <button
          className="assignment-btn-text-generate"
          onClick={() => setIsTextFormatPopupOpen(true)}
          disabled={!textToFormat}
        >
          <FaScissors />
        </button>
      </div>
      <div className="assignment-answer-options">
        {answers.map((answer, index) => (
          <HighLightQuestionAnswer
            key={index}
            answerIndex={index}
            answer={answer}
            isDeleteMode={isDeleteMode}
            handleOnClickAnswer={handleOnClickAnswer}
          />
        ))}
        <div className="add-answer">
          <button className="external-link-upload-icon" onClick={addAnswer}>
            <FaPlus />
          </button>
          <input
            placeholder="Nieuw antwoord"
            className="text-input external-url-input"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addAnswer();
                setNewAnswer("");
              }
            }}
          />
        </div>
      </div>
      <div className="assignment-actions">
        <button
          className={`btn ${isDeleteMode ? "delete" : ""}`}
          onClick={() => setIsDeleteMode(!isDeleteMode)}
          disabled={answers.length === 0}
        >
          <FaTrash /> Selectie verwijderen
        </button>
        <button
          className="btn"
          onClick={deleteAllAnswers}
          disabled={answers.length === 0}
        >
          <FaTrash /> Alles verwijderen
        </button>
      </div>

      <TextFormatPopup
        isOpen={isTextFormatPopupOpen}
        onClose={() => setIsTextFormatPopupOpen(false)}
        handleOnClickOption={generateAnswers}
      />
    </div>
  );
}
