import { useState } from 'react';
import { Button } from '../ui/Button';
import styles from './RecoveryAssessment.module.css';

const questions = [
  {
    id: 1,
    question: "After a stressful meeting, what helps you most?",
    options: [
      { text: "Calling a friend to vent", scores: { social: 3, solo: 0, physical: 1, mental: 1 } },
      { text: "Taking a quiet walk alone", scores: { social: 0, solo: 2, physical: 2, mental: 1 } },
      { text: "A quick workout or stretches", scores: { social: 0, solo: 1, physical: 3, mental: 1 } },
      { text: "Closing my eyes and breathing", scores: { social: 0, solo: 2, physical: 0, mental: 3 } },
    ],
  },
  {
    id: 2,
    question: "Your ideal lunch break involves:",
    options: [
      { text: "Eating with colleagues", scores: { social: 3, solo: 0, physical: 0, mental: 0 } },
      { text: "Reading or listening to a podcast", scores: { social: 0, solo: 2, physical: 0, mental: 3 } },
      { text: "A walk outside", scores: { social: 0, solo: 1, physical: 3, mental: 1 } },
      { text: "Just some quiet time", scores: { social: 0, solo: 3, physical: 0, mental: 2 } },
    ],
  },
  {
    id: 3,
    question: "When you feel drained, you crave:",
    options: [
      { text: "Human connection and conversation", scores: { social: 3, solo: 0, physical: 0, mental: 0 } },
      { text: "Complete silence and solitude", scores: { social: 0, solo: 3, physical: 0, mental: 2 } },
      { text: "Moving your body", scores: { social: 0, solo: 0, physical: 3, mental: 1 } },
      { text: "Stepping away from screens", scores: { social: 0, solo: 1, physical: 1, mental: 3 } },
    ],
  },
  {
    id: 4,
    question: "Your perfect weekend recharge includes:",
    options: [
      { text: "Social gatherings or group activities", scores: { social: 3, solo: 0, physical: 1, mental: 0 } },
      { text: "Time alone with hobbies", scores: { social: 0, solo: 3, physical: 0, mental: 1 } },
      { text: "Sports, hiking, or physical activities", scores: { social: 1, solo: 0, physical: 3, mental: 1 } },
      { text: "Unplugging completely from tech", scores: { social: 0, solo: 2, physical: 1, mental: 3 } },
    ],
  },
];

const styleNames = {
  social: "Social Recharger",
  solo: "Solo Decompressor",
  physical: "Physical Resetter",
  mental: "Mental Unplugger",
};

const styleDescriptions = {
  social: "You draw energy from connection. Social breaks—even brief ones—help you recharge and reset.",
  solo: "You need quiet time to process and recover. Solitude is your superpower for restoration.",
  physical: "Movement is your medicine. Physical activity clears your mind and restores your energy.",
  mental: "Stepping away from stimulation helps you recover. You benefit from unplugging and simplifying.",
};

export function RecoveryAssessment({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (allAnswers) => {
    const scores = { social: 0, solo: 0, physical: 0, mental: 0 };

    allAnswers.forEach((answerIndex, questionIndex) => {
      const option = questions[questionIndex].options[answerIndex];
      Object.entries(option.scores).forEach(([key, value]) => {
        scores[key] += value;
      });
    });

    const winner = Object.entries(scores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    setResult({
      style: styleNames[winner],
      description: styleDescriptions[winner],
      scores,
    });
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete(result.style);
  };

  if (showResult) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.resultIcon}>
          {result.style === "Social Recharger" && "👥"}
          {result.style === "Solo Decompressor" && "🧘"}
          {result.style === "Physical Resetter" && "🏃"}
          {result.style === "Mental Unplugger" && "🌿"}
        </div>
        <h2 className={styles.resultTitle}>You're a</h2>
        <h3 className={styles.resultStyle}>{result.style}</h3>
        <p className={styles.resultDescription}>{result.description}</p>
        <Button onClick={handleContinue} size="lg" fullWidth>
          Continue to Work Setup
        </Button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className={styles.assessment}>
      <div className={styles.questionHeader}>
        <span className={styles.questionNumber}>
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <h2 className={styles.question}>{question.question}</h2>

      <div className={styles.options}>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={styles.optionButton}
            onClick={() => handleAnswer(index)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
