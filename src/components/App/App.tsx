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
        id: "hcaGChPooi",
        text: "L",
        isAnswer: true,
      },
      {
        id: "ivzTxfFFoz",
        text: "o",
        isAnswer: true,
      },
      {
        id: "Jt4n7YP1A5",
        text: "r",
        isAnswer: false,
      },
      {
        id: "AnLrmOZTsE",
        text: "e",
        isAnswer: false,
      },
      {
        id: "TGESJp9hl3",
        text: "m",
        isAnswer: false,
      },
      {
        id: "VRNc40vJV8",
        text: " ",
        isAnswer: false,
      },
      {
        id: "QePZDjcR5G",
        text: "i",
        isAnswer: false,
      },
      {
        id: "KOiteXS6W7",
        text: "p",
        isAnswer: false,
      },
      {
        id: "WS3z6dsMwM",
        text: "s",
        isAnswer: false,
      },
      {
        id: "00CPE9woeO",
        text: "u",
        isAnswer: false,
      },
      {
        id: "FERRSpLZhZ",
        text: "m",
        isAnswer: false,
      },
      {
        id: "k2wwdLPHTo",
        text: " ",
        isAnswer: false,
      },
      {
        id: "30FaH6b8OZ",
        text: "d",
        isAnswer: false,
      },
      {
        id: "pJXiwbtGpV",
        text: "o",
        isAnswer: false,
      },
      {
        id: "Q8IRsHLP6w",
        text: "l",
        isAnswer: false,
      },
      {
        id: "G9Gahve1dg",
        text: "o",
        isAnswer: false,
      },
      {
        id: "2IdWozo9yn",
        text: "r",
        isAnswer: false,
      },
      {
        id: "erVQ2A0gFX",
        text: " ",
        isAnswer: false,
      },
      {
        id: "rjuRCXTtIr",
        text: "m",
        isAnswer: false,
      },
      {
        id: "m1h5jT6VeU",
        text: "i",
        isAnswer: false,
      },
      {
        id: "49ulym8JBQ",
        text: "t",
        isAnswer: false,
      },
      {
        id: "cHl4JDlvru",
        text: " ",
        isAnswer: false,
      },
      {
        id: "N4BXmBbZuq",
        text: "a",
        isAnswer: false,
      },
      {
        id: "6zxZZjNWsr",
        text: "m",
        isAnswer: false,
      },
      {
        id: "kQbbx87qOk",
        text: "e",
        isAnswer: false,
      },
      {
        id: "I4baqyZAUe",
        text: "t",
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
