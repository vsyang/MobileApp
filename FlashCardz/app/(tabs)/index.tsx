import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';

// Create a custom blueprint for Card
type Card = {
  id: string;
  question: string;
  answer: string;
};

// Homescreen function where user can input questions and answers that will be saved
export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [quizStart, setStartQuiz] = useState(false);

  // New card from user input
  const newCard = () => {
    if (question.trim() && answer.trim()) {
      setCards([...cards, { question, answer, id: Date.now().toString() }]);
      setQuestion('');
      setAnswer('');
    }
  };

  //When user selects start quiz; can only be clicked if there's at least one question and answer set
  const whenQuizStart = () => {
    if (cards.length > 0) {
      setStartQuiz(true);
    }
  };

  if (quizStart) {
    return <QuizScreen cards={cards} />;
  }

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Stack.Screen options={{ title: 'Flashcards'}} />
          <Text style={styles.title}>Are You Ready?</Text>
        
          <TextInput
            style={styles.input}
            placeholder="Enter Your Question"
            value={question}
            onChangeText={setQuestion}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter The Answer"
            value={answer}
            onChangeText={setAnswer}
          />
          <Button title="Add Card" onPress={newCard}/>
        </>
      } 
      renderItem={({ item }) => (
        <Text style={styles.cardItem}>Q: {item.question}</Text>
      )}
      ListFooterComponent={
      <View style={{marginTop: 20}}>
        <Button title="Start Quiz" onPress={whenQuizStart} disabled={cards.length === 0} />
      </View>
      }
      contentContainerStyle={styles.container}
      />    
  );
}

// On screen, picks a random flashcard and show question. Let the user click to show answer. Gives user ability to view next card
function QuizScreen({ cards }: {cards: Card[] }) {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * cards.length));
  const [showAnswer, setShowAnswer] = useState(false);

  const nextCard = () => {
    setShowAnswer(false);
    const next = Math.floor(Math.random() * cards.length);
    setCurrentIndex(next);
  };

  const card = cards[currentIndex];

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard</Text>
      <TouchableOpacity onPress={() => setShowAnswer(!showAnswer)}>
        <Text style={styles.flashcard}>
          {showAnswer ? card.answer : card.question}
        </Text>
      </TouchableOpacity>
      <Button title="Next Question" onPress={nextCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  cardItem: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    marginVertical: 4,
  },
  flashcard: {
    fontSize: 28,
    textAlign: 'center',
    padding: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 20,
  },
});