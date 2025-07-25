import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Stack } from 'expo-router';

// Create a custom blueprint for flashcard
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

  /* For when user selects to start quiz:
  - Can only be clicked if there's at least one question and answer set
  */
  const whenQuizStart = () => {
    if (cards.length > 0) {
      setStartQuiz(true);
    }
  };

  if (quizStart) {
    return <QuizScreen cards={cards} goBack={() => setStartQuiz(false) } />;
  }

// Area where user will input their questions and answers  
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

/* On screen, picks a random flashcard and show question. 
- Allows the user click to show answer 
- Gives user ability to view next question card 
- Animation to "flip" card to view answer
*/
function QuizScreen({ cards, goBack }: {cards: Card[], goBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * cards.length));
  const [flipAnimation] = useState(new Animated.Value(0));
  const [flipped, setFlipped] = useState(false);

  const frontCard = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backCard = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const nextCard = () => {
    setFlipped(false);
    flipAnimation.setValue(0);
    const next = Math.floor(Math.random() * cards.length);
    setCurrentIndex(next);
  };

  const flipCard = () => {
    if (flipped) {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setFlipped(false));
    } else {
      Animated.timing(flipAnimation, {
        toValue: 180,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setFlipped(true));
    }
  }

  const card = cards[currentIndex];

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard</Text>
      <TouchableOpacity onPress={flipCard}>
        <View>
          <Animated.View
            style={[
              styles.flashcard,
              {
                transform: [{ rotateY: frontCard }],
                backfaceVisibility: "hidden",
                position: "absolute",
              },
            ]}
          >
            <Text style={styles.cardText}>{card.question}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.flashcard,
              {
                transform: [{ rotateY: backCard }],
                backfaceVisibility: "hidden",
              },
            ]}
          >
            <Text style={styles.cardAnswer}>{card.answer}</Text>
          </Animated.View>
        </View>                   
      </TouchableOpacity>
      <View style={{marginTop: 40}}>
       <Button title="Next Question" onPress={nextCard} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Button title="Back to Main" onPress={goBack} color="#888" />
      </View>
    </View>
  );
}

// Styles act as css for mobile app
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
    width: 350,
    height: 200,
    backgroundColor: "#fff9f9ff",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginVertical: 20,
  },
  cardText: {
    fontSize: 30,
    textAlign: "center",
  },
  cardAnswer: {
    color: "#4433e0ff",
    fontSize: 50,
    textAlign: "center",
  },
});