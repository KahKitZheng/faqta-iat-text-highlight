type HighlightAnswer = {
  id?: string;
  text: string;
  isAnswer: boolean;
};

type HighlightQuestion = {
  format: "letter" | "word";
  textToFormat: string;
};
