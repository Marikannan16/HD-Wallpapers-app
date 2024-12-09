import React, { useState, useEffect, useRef } from 'react';
import { ant, cap, consoleicon, dbstack, love, pie, puzzle, slash, smile, trophy, tube } from './icons';
import confetti from 'canvas-confetti';
import { sentences } from './Sentences';
import Alertsound from '../assets/Audio/alert.mp3';
import Cheering from '../assets/Audio/cheering.mp3';

function TypingTest() {
  const [user, setUser] = useState("");
  const [text, setText] = useState('');
  const [difficulty, setDifficulty] = useState(""); // Default difficulty
  const [currentSentence, setCurrentSentence] = useState('');
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [result, setResult] = useState({ message: '', accuracy: 0, wpm: 0 });
  const [randomIcon, setRandomIcon] = useState(null);
  const icons = [cap, tube, slash, ant, pie, dbstack, consoleicon, smile, love, puzzle, trophy];
  const inputRef = useRef(null);

  const cheeringSound = new Audio(Cheering);

  // Select a random sentence from the chosen difficulty
  const selectRandomSentence = () => {
    if (sentences[difficulty] && sentences[difficulty].length > 0) {
      return sentences[difficulty][Math.floor(Math.random() * sentences[difficulty].length)];
    }
    return ""; // Fallback if no sentence is available
  };

  useEffect(() => {
    setCurrentSentence(selectRandomSentence());
  }, [difficulty]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    setRandomIcon(icons[randomIndex]);
  }, []);

  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
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
    setCurrentSentence(selectRandomSentence());
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmitTest = () => {
    setTimerRunning(false);
    setTestEnded(true);
    cheeringSound.play();
    setText("");
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
      spread: 500,
      particleCount: 1050,
      origin: { y: 1 },
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
      <div className="bg-white w-full h-full flex shadow-md border lg:justify-between gap-2 border-gray-200 pe-5 flex-wrap py-2 justify-center">
        <div className="flex gap-5">
          <span className="border border-black h-9 w-9 rounded-full flex justify-center items-center ms-2 mt-2">
            {randomIcon}
          </span>
          <div className="w-44 h-full mt-2">
            <p className="text-base font-semibold text-black">{user === "" ? "Typing Speed Test" : user}</p>
            <p className="-mt-0.5 text-black text-sm">{timerRunning ? "typing..." : "online"}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'><p>Difficulty : {difficulty}</p> <span className={`${difficulty === "Easy" ? 'bg-green-700' : difficulty === "Medium" ? 'bg-yellow-500' : difficulty === "Hard" ? 'bg-red-600' : 'bg-white'} w-5 h-5 rounded-full flex items-center`}></span></div>
        {testStarted && (
          <div className="flex justify-center items-center gap-5">
            <p>Your time : {time}</p>
            {!testEnded &&
              <div className="w-10 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
                <span className="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]">
                </span>
              </div>
            }
            <button
              onClick={handleRestartTest}
              class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-red-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            >
              <svg
                class="w-8 h-8 justify-end group-hover:-rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-0"
                viewBox="0 0 16 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                  class="fill-gray-800 group-hover:fill-gray-800"
                ></path>
              </svg>
              Restart Test
            </button>
            {/* <button onClick={handleRestartTest} className="h-10 w-36 rounded-md text-white bg-red-500">
              Restart Test
            </button> */}



          </div>
        )}
      </div>

      {!testStarted && (<div className=' items-center mt-16 flex flex-col gap-3 border border-slate-400 rounded-3xl shadow-2xl w-80 h-[400px] mx-auto p-5'>
        <span className='border border-black h-16 w-16 rounded-full flex justify-center items-center ms-2 mt-2'>
          {randomIcon}
        </span> <br />
        <label className="text-black text-md font-semibold mb-1" htmlFor="unique-input">UserName</label>
        <input className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-100" placeholder="Enter text here" type="text" id="unique-input" value={user} onChange={(e) => setUser(e.target.value)} />
        <label className="text-black text-md font-semibold mb-1" htmlFor="unique-select">Select Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} id="unique-select" className="text-sm custom-input w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-300 hover:shadow-lg hover:border-blue-300 bg-gray-100">
          <option value=""  >Select Difficulty</option>
          <option value="Easy"  >Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>

        </select>
        <br />
        <button
          onClick={handleStartTest}
          class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
        >
          Start Test
          <svg
            class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
            viewBox="0 0 16 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
              class="fill-gray-800 group-hover:fill-gray-800"
            ></path>
          </svg>
        </button>
      </div>
      )}
      {testStarted && (
        <div className=' mt-5 lg:h-[490px] h-[430px] overflow-y-scroll'>
          <p className="text-lg bg-blue-100 border border-gray-200 shadow-md rounded-lg w-96 p-2 ms-5 mt-1">
            Type this sentence:
          </p>
          <div className="text-lg border border-gray-200 shadow-md rounded-lg w-11/12 p-4 ms-5 bg-green-100 mt-2">
            {getStyledText()}
          </div>
          {testEnded && (
            <div className="text-lg bg-blue-100 border border-gray-200 shadow-md rounded-lg w-7/12 p-2 ms-5 mt-3">
              <p>
                <strong>Result:</strong><br /> {result.message}
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
              <br />
              <div className='flex justify-center lg:w-6/12 w-full flex-wrap gap-3'>
              <button
                onClick={handleRestartTest}
                class="flex  gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-red-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
              >
                <svg
                  class="w-8 h-8 justify-end group-hover:-rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-0"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    class="fill-gray-800 group-hover:fill-gray-800"
                  ></path>
                </svg>
                Restart Test
              </button>
              
              <button
                onClick={handleStartTest}
                class="flex  gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-green-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
              >
                <svg
                  class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-0"
                  viewBox="0 0 16 19"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                    class="fill-gray-800 group-hover:fill-gray-800"
                  ></path>
                </svg>
                Try Another
              </button>
              
              </div>
            </div>
          )}


        </div>
      )}
      {testStarted &&
        <div className="flex w-full h-16 ps-6 pe-10 my-3 gap-3 place-items-end">
          <textarea
            ref={inputRef}
            rows="2"
            value={text}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="w-full border border-black ps-3 pt-1.5 rounded-md placeholder:text-start"
          />
          <button onClick={handleSubmitTest} className="flex items-center bg-green-500 text-white gap-1 px-4 py-2 cursor-pointer font-semibold tracking-widest rounded-md hover:bg-green-400 duration-300 hover:gap-2 hover:translate-x-3">
            <svg className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </button>
          {/* <button
              onClick={handleSubmitTest}
              className="bg-green-600 text-white rounded-full h-10 w-10 flex justify-center items-center"
            >
              Submit
            </button> */}
        </div>
      }
    </div>
  );
}

export default TypingTest;
