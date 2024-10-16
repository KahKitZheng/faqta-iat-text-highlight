import { useState } from "react";
import TextHighlight from "../TextHighlight/TextHighlight";
import "./App.scss";

function App() {
  const [isEditing, setIsEditing] = useState(true);
  const [data, setData] = useState("");

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
      <main>{isEditing ? <TextHighlight /> : <p>test</p>}</main>
    </>
  );
}

export default App;
