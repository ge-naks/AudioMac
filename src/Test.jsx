import './App.css'
import { useState, useEffect } from 'react';
import rightSound from "./right.mp3"
import wrongSound from "./wrong.mp3"

function Test() {
  let [realAns, setRealAns] = useState(0);
  let [givenAns, setGivenAns] = useState(-1)
  let [numCorrect, setNumCorrect] = useState(0);
  let [prevAns, setPrevAns] = useState(-1)
  let [msg, setMsg] = useState('')
  let [timeleft, setTime] = useState(120)
  let [timerId, setTimerId] = useState(null);
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
  const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
  const recognition = new SpeechRecognition();
  let right = new Audio(rightSound);
  let wrong = new Audio(wrongSound);
  const wordToNumber = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4,
    "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9
  };
  let operators = ['plus', 'minus', 'times', 'divided by']

  function genNumber() {
    function countdown() {
      setTime(prevTime => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timerId); // Stop the interval when countdown reaches 0
          setTimerId(null); // Clear the timerId
          return 0;
        }
        return newTime;
      });
    }

    if (realAns === 0) {
      setTime(120);
      setTimerId(setInterval(countdown, 1000)); // Set the timerId
    }

    if (timeleft > 0) {
    let num1Addition = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
    let num2Addition = Math.floor(Math.random() * (100 - 2 + 1)) + 2;

    let num1Multiplication = Math.floor(Math.random() * (12 - 2 + 1)) + 2;
    let num2Multiplication = Math.floor(Math.random() * (100 - 2 + 1)) + 2;


    let op = Math.floor(Math.random() * 4);
    if (op == 0) {
      setRealAns(num1Addition + num2Addition)
      speak(num1Addition, num2Addition, 0)
    } else if (op == 2) {
      setRealAns(num1Multiplication * num2Multiplication)
      speak(num1Multiplication, num2Multiplication, 2)
    } else if (op == 1) {
      if (num1Addition > num2Addition) {
        setRealAns(num1Addition - num2Addition)
        speak(num1Addition, num2Addition, 1)
      } else {
        setRealAns(num2Addition - num1Addition)
        speak(num2Addition, num1Addition, 1)
      }
    } else {
      if (num2Multiplication % num1Multiplication != 0) {
        while (num2Multiplication % num1Multiplication != 0) {
          num1Multiplication = Math.floor(Math.random() * (12 - 2 + 1)) + 2;
          num2Multiplication = Math.floor(Math.random() * (100 - 2 + 1)) + 2;
        }
        setRealAns(num2Multiplication / num1Multiplication)
        speak(num2Multiplication, num1Multiplication, 3)
      }

    }
    console.log('spoke');
  }
  }

  function time() {
    let hours = Math.floor(timeleft / 60);
    let minutes = timeleft % 60;
  
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
  
    return `${hours}:${minutes}`;
  }

  function speak(num1, num2, i) {
    let firstNum = new SpeechSynthesisUtterance(String(num1))
    speechSynthesis.speak(firstNum);

    let op = new SpeechSynthesisUtterance(operators[i])
    speechSynthesis.speak(op);

    let secondNum = new SpeechSynthesisUtterance(String(num2))
    speechSynthesis.speak(secondNum)
  }

  function listen() {
    recognition.start();

    const timeoutDuration = 5000; 
  const timeoutId = setTimeout(() => {
    recognition.stop(); 
    wrong.play();
    console.log("Time's up! No answer received.");
  }, timeoutDuration);



    recognition.onresult = (event) => {
      clearTimeout(timeoutId);
      const numericValue = wordToNumber[event.results[0][0].transcript];


      if (numericValue !== undefined) {
        console.log(numericValue)
        setGivenAns(numericValue)
        if (numericValue === realAns) {
          right.play()
          console.log("right")
          setNumCorrect(numCorrect + 1)
        } else {
          wrong.play()
          console.log("wrong")
        }
      } else {
        setGivenAns(event.results[0][0].transcript)
        console.log(event.results[0][0].transcript)
        if (parseInt(event.results[0][0].transcript) == realAns) {
          right.play()
          console.log("ye")
          setNumCorrect(numCorrect + 1)
        } else {
          wrong.play()
          console.log("nah")
        }
      }
    };
  }

  wrong.onplay= function nextQuestionWrong(){
    if(timeleft > 0){
      genNumber()
    }
    
  };
  right.onplay= function nextQuestion(){
    if(timeleft > 0){
      genNumber()
    }
  };

  useEffect(() => {
    if (realAns !== 0) {
      const delay = 3000; // Adjust the delay time in milliseconds (e.g., 2000ms = 2 seconds)
      setMsg('Speaking...')
      const timeoutId = setTimeout(() => {
        listen();
        setMsg('Listening...')
      }, delay);
      console.log(givenAns)
      return () => {
        clearTimeout(timeoutId); // Clear the timeout if the dependency changes before the delay is reached 
        setMsg('')
      };
    }
  }, [realAns]);

  function main() {
    const duration = 3000
    const timeoutId = setTimeout(() => {
      genNumber();
    }, duration);
    return () => {
      clearTimeout(timeoutId); // Clear the timeout if the dependency changes before the delay is reached 
      setMsg('')
    };
  }

  return (
    <>
      <button onClick={genNumber}>Begin Test!</button>
      <p>Number Correct: {numCorrect}</p>
      <p>Time remaining: {time()}</p>
    </>
  )
}

export default Test
