import { useCallback, useState } from "react";
import { FaPlus, FaScissors, FaTrash } from "react-icons/fa6";
import TextFormatPopup from "./TextFormatPopup";
import HighLightQuestionAnswer from "./HighLightQuestionAnswer";
import TextArea from "../TextArea/TextaArea";
import { randomId } from "../../utils";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { createPortal } from "react-dom";
import "./HighlightQuestion.scss";

const exampleText =
  "De kat is gisteren naar huis gelopen. Dat vond Mimi persoonlijk niet zo leuk. Zij wilde liever nog even met de kat op het parkbankje zitten.";

export default function HighlightQuestion() {
  const [title, setTitle] = useState("");
  const [textToFormat, setTextToFormat] = useState("");
  const [answers, setAnswers] = useState<HighlightAnswer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");

  const [mode, setMode] = useState<"default" | "delete" | "sort">("default");
  const [isTextFormatPopupOpen, setIsTextFormatPopupOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | undefined>();

  const isDeleteMode = mode === "delete";

  const itemIds = answers.map((answer) => answer?.id ?? "");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200, // need to differentiate between click and drag
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    setMode("sort");
  }, []);

  const handleDragOver = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setAnswers((answers) => {
          const oldIndex = itemIds.indexOf(active.id.toString());
          const newIndex = itemIds.indexOf(over.id.toString());

          return arrayMove(answers, oldIndex, newIndex);
        });
      }
    },
    [itemIds]
  );

  const handleDragEnd = useCallback(() => {
    setActiveDragId(undefined);
    setMode("default");
  }, []);

  function addAnswer() {
    const newAnswers = [...answers];

    newAnswers.push({
      id: randomId(),
      text: newAnswer === " " ? newAnswer : newAnswer.trim(),
      isAnswer: false,
    });

    setAnswers(newAnswers);
  }

  function updateAnswer(answerIndex: number, newAnswer: string) {
    const newAnswers = [...answers];
    newAnswers[answerIndex].text = newAnswer;
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
        id: randomId(),
        text: letter,
        isAnswer: false,
      }));
      setAnswers([...answers, ...newAnswers]);
    } else {
      const formattedText = textToFormat.replace(/([.,!?])/g, " $1");

      const newAnswers = formattedText.split(" ").map((word) => ({
        id: randomId(),
        text: word,
        isAnswer: false,
      }));

      setAnswers([...answers, ...newAnswers]);
    }

    setTextToFormat("");
    setIsTextFormatPopupOpen(false);
  }

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
        <TextArea
          placeholder="Type hier wat tekst of kopieer een alinea aan tekst, voor automatische transformatie..."
          value={textToFormat}
          onChange={(e) => setTextToFormat(e.target.value)}
          grow
          isWhite
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
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragEnd}
          collisionDetection={pointerWithin}
          modifiers={[restrictToFirstScrollableAncestor]}
        >
          <SortableContext items={itemIds}>
            {itemIds.map((answerId, index) => (
              <HighLightQuestionAnswer
                key={answerId}
                answer={answers[index]}
                answerIndex={index}
                answerId={answerId}
                handleOnClickAnswer={handleOnClickAnswer}
                updateAnswer={updateAnswer}
                deleteAnswer={deleteAnswer}
                mode={mode}
              />
            ))}
          </SortableContext>

          {createPortal(
            <DragOverlay adjustScale={true} dropAnimation={null}>
              {activeDragId ? (
                <HighLightQuestionAnswer
                  answer={answers[itemIds.indexOf(activeDragId.toString())]}
                  answerId={activeDragId}
                  answerIndex={itemIds.indexOf(activeDragId.toString())}
                  isDragged
                  handleOnClickAnswer={handleOnClickAnswer}
                  updateAnswer={updateAnswer}
                  deleteAnswer={deleteAnswer}
                  mode={mode}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>

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
          onClick={() => setMode(isDeleteMode ? "default" : "delete")}
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
