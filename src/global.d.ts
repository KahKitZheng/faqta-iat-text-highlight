type HighlightAnswer = {
  id?: string;
  text: string;
  isAnswer: boolean;
};

// Client only
type HighlightSubmitAnswer = HighlightAnswer & {
  isSelected?: boolean;
  isCorrect?: boolean;
};

type Data = {
  title: string;
  answers: HighlightAnswer[]; // probably rename it to items
};
