type Data = {
  title: string;
  answers: HighlightAnswer[]; // probably rename it to items
};

type HighlightAnswer = {
  id?: string;
  text: string;
  isAnswer: boolean;
};

// This type is used only on client-side
type HighlightSubmitAnswer = HighlightAnswer & {
  isSelected?: boolean;
  isCorrect?: boolean;
};
