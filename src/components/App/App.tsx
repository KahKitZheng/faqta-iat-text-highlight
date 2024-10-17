import { useState } from "react";
import TextHighlight from "../TextHighlight/TextHighlight";
import TextHighlightLayout from "../TextHighlightLayout/TextHighlightLayout";
import "./App.scss";

function App() {
  const [isEditing, setIsEditing] = useState(!true);
  const [data, setData] = useState<Data>({
    title: "Voeg hier een leuke title toe",
    answers: [
      {
        id: "6b4MBC6HPK",
        text: "Lorem",
        isAnswer: true,
      },
      {
        id: "WiPE8Q9mhP",
        text: "ipsum",
        isAnswer: false,
      },
      {
        id: "o5H8ZphMCy",
        text: "dolor",
        isAnswer: false,
      },
      {
        id: "PlgJX94g29",
        text: "mit",
        isAnswer: false,
      },
      {
        id: "Zo8uhH2GJW",
        text: "amet",
        isAnswer: false,
      },
    ],
  });
  const [controlledAnswers, setControlledAnswers] = useState<
    HighlightSubmitAnswer[]
  >([]);

  return (
    <>
      <header>
        <div>
          <input
            type="radio"
            id="is-not-editing"
            checked={isEditing}
            onChange={() => setIsEditing(true)}
          />
          <label htmlFor="is-not-editing">Content developer</label>
        </div>
        <div>
          <input
            type="radio"
            id="is-editing"
            checked={!isEditing}
            onChange={() => setIsEditing(false)}
          />
          <label htmlFor="is-editing">Teacher & students</label>
        </div>
      </header>
      <main>
        {isEditing ? (
          <TextHighlight data={data} setData={setData} />
        ) : (
          <TextHighlightLayout
            data={data}
            controlledAnswers={controlledAnswers}
            setControlledAnswers={setControlledAnswers}
          />
        )}
      </main>
    </>
  );
}

export default App;
