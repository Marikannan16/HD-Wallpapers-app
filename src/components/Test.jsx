import React, { useState, useEffect, useRef } from 'react';
import { ant, cap, consoleicon, dbstack, love, pie, puzzle, slash, smile, trophy, tube } from './icons';
import confetti from 'canvas-confetti';
import { sentences } from './Sentences';
import Alertsound from '../assets/Audio/alert.mp3'
import Cheering from '../assets/Audio/cheering.mp3'
import { spread } from 'axios';
function TypingTest() {
  const [text, setText] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [result, setResult] = useState({ message: '', accuracy: 0, wpm: 0 });
  const [randomIcon, setRandomIcon] = useState(null);
  const icons = [cap, tube, slash, ant, pie, dbstack, consoleicon, smile, love, puzzle, trophy];
  const inputRef = useRef(null);

  // Alert sound
  const alertSound = new Audio(Alertsound); // Use your own sound file path
  const cheeringSound = new Audio(Cheering); // Use your own sound file path

  useEffect(() => {
    setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)]);
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    setRandomIcon(icons[randomIndex]);
  }, []);

  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning]);

  const handleStartTest = () => {
    setTestStarted(true);
    setTestEnded(false);
    setText('');
    setTime(0);
    setTimerRunning(true);
    setResult({ message: '', accuracy: 0, wpm: 0 });
    setCurrentSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setText(input);

    // Check if the current character is incorrect
    const inputChar = input[input.length - 1]; // Get the last character typed
    const correctChar = currentSentence[input.length - 1];

    // Play alert sound if the character is incorrect
    if (inputChar && inputChar !== correctChar) {
      alertSound.play();
    }
  };

  const handleSubmitTest = () => {
    setTimerRunning(false);
    setTestEnded(true);
    cheeringSound.play()

    // Calculate accuracy and WPM
    const correctChars = text.split('').filter((char, i) => char === currentSentence[i]).length;
    const totalChars = currentSentence.length;
    const accuracy = ((correctChars / totalChars) * 100).toFixed(2);

    const wpm = ((correctChars / 5) / (time / 60)).toFixed(2);

    const message =
      text === currentSentence
        ? 'Congratulations! You typed the sentence correctly.'
        : 'Oops! There were some mistakes in your typing.';

    setResult({ message, accuracy, wpm });
    confetti({
      spread:500,
      particleCount: 1050,
      origin: { y: 1 }
    });
  };

  const handleRestartTest = () => {
    setTestStarted(false);
    setTestEnded(false);
    setText('');
    setTime(0);
    setTimerRunning(false);
    setResult({ message: '', accuracy: 0, wpm: 0 });
  };

  const getStyledText = () => {
    return currentSentence.split('').map((char, index) => {
      const inputChar = text[index];
      const isCorrect = inputChar === char;
      const isEntered = inputChar !== undefined;

      return (
        <span
          key={index}
          style={{
            backgroundColor: isEntered
              ? isCorrect
                ? 'lightgreen'
                : 'lightcoral'
              : 'transparent',
            color: 'black',
            padding: '2px',
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div>
      <div className='bg-white w-full h-14 flex shadow-md border justify-between border-gray-200 pe-10'>
        <div className='flex gap-7'>
          <span className='border border-black h-9 w-9 rounded-full flex justify-center items-center ms-2 mt-2'>
            {randomIcon}
          </span>
          <div className='w-56 h-10 mt-2'>
            <p className='text-base font-semibold text-black'>Typing Test</p>
            <p className='-mt-0.5 text-black text-sm'>{timerRunning ? 'typing...' : 'online'}</p>
          </div>
        </div>
        {testStarted && 
        <div className='flex justify-center items-center gap-5'>
          <p className='items-center '>Your time {time}</p>
          <button onClick={handleRestartTest} className='h-10 w-36  rounded-md text-white bg-red-500'>
            Restart Test
          </button>
        </div>
}
      </div>
      <div className='mt-5'>
        {!testStarted && (
          <button onClick={handleStartTest} className='bg-green-600 text-white p-2 rounded-md shadow-md ms-5'>
            Start Test
          </button>
        )}
        {testStarted && (
          <div>
            <p className='text-lg bg-blue-100 border border-gray-200 shadow-md rounded-lg w-96 p-2 ms-5 mt-1 '>
              Hi, your time starts now. <br />Type this sentence
            </p>
            <div className='text-lg border border-gray-200 shadow-md rounded-lg w-11/12 p-4 ms-5 bg-green-100 mt-2'>
              {getStyledText()}
            </div>
            {text && (
              <div className='flex justify-end pe-5 mt-2'>
                <p className='bg-green-100 border border-gray-200 shadow-md rounded-lg w-11/12 lg:w-8/12 p-2 ms-5'>
                  You: {text}
                </p>
                <br />
              </div>
            )}
            {testEnded && (
              <div className='text-lg bg-blue-100 border border-gray-200 shadow-md rounded-lg w-7/12 p-2 ms-5 mt-3'>
                <p>
                  <strong>Result:</strong> {result.message}
                </p>
                <p>
                  <strong>Accuracy:</strong> {result.accuracy}%
                </p>
                <p>
                  <strong>Words Per Minute (WPM):</strong> {result.wpm}
                </p>
                <p>
                  <strong>Total Time:</strong> {time} seconds
                </p>
                <button onClick={handleRestartTest} className='h-10 w-36  rounded-md text-white bg-red-500'>
                  Restart Test
                </button>
              </div>
            )}

            <div className='flex w-full ps-6 pe-10 my-3 gap-6'>
              <textarea
                ref={inputRef}
                rows='1'
                value={text}
                onChange={handleInputChange}
                placeholder='Start typing here...'
                className='w-full border border-black ps-3 pt-1.5 rounded-md placeholder:text-start'
              />
              <button
                onClick={handleSubmitTest}
                className='bg-green-600 text-white rounded-full h-10 w-10 flex justify-center items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-6'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypingTest;
