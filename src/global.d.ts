type HighlightAnswer = {
  id?: string;
  text: string;
  isAnswer: boolean;
};

type HighlightSubmitAnswer = HighlightAnswer & {
  isSelected?: boolean;
  isCorrect?: boolean;
};

type Data = {
  title: string;
  answers: HighlightAnswer[];
};
