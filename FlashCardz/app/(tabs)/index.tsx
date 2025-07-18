// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';

type Card = {
  id: string;
  question: string;
  answer: string;
};

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [quizStart, setStartQuiz] = useState(false);

  const newCard = () => {
    if (question.trim() && answer.trim()) {
      setCards([...cards, { question, answer, id: Date.now().toString() }]);
      setQuestion('');
      setAnswer('');
    }
  };

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
      <View style={{backgroundColor: "lightblue", marginTop: 20}}>
        <Button title="Start Quiz" onPress={whenQuizStart} disabled={cards.length === 0} />
      </View>
      }
      contentContainerStyle={styles.container}
      />    
  );
}

function QuizScreen({ cards}: {cards: Card[] }) {
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