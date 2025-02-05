import { useEffect, useState } from 'react';
import fruitItems from './fruits.json';
import './App.css';

function Card({ fruit, flipped, chooseCard }) {
  const cardClickHandle = () => {
    chooseCard(fruit);
  };

  return (
    <div className={`card ${flipped ? 'matched' : ''}`} onClick={cardClickHandle}>
      <img style={{ transform: 'rotateY(180deg)' }} src={fruit.src} alt={fruit.name} />
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"></path>
        <line x1="12" y1="19" x2="12" y2="19.01"></line>
      </svg>
    </div>
  );
}

function App() {
  const [fruits, setFruits] = useState([]);
  const [fruitOne, setFruitOne] = useState(null);
  const [fruitTwo, setFruitTwo] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);

  const chooseCard = (fruit) => {
    fruitOne ? setFruitTwo(fruit) : setFruitOne(fruit);
  };

  const initGame = () => {
    const allFruits = [...fruitItems, ...fruitItems]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({ ...item, id: Math.random() }));
    setFruits(allFruits);
    setGameFinished(false);
  };

  const resetGame = () => {
    setFruits((prevFruits) => {
      return prevFruits.map((item) => {
        if (item.matched) {
          return { ...item, matched: false };
        }
        return item;
      });
    });

    setFruitOne(null);
    setFruitTwo(null);

    setTimeout(() => {
      initGame();
    }, 500);
  };

  useEffect(() => {
    if (fruitOne && fruitTwo) {
      if (fruitOne.src === fruitTwo.src) {
        setFruits((prevFruits) => {
          return prevFruits.map((item) => {
            if (item.src === fruitOne.src) {
              return { ...item, matched: true };
            } else {
              return item;
            }
          });
        });
      }

      setTimeout(() => {
        setFruitOne(null);
        setFruitTwo(null);
        checkGameStatus();
      }, 500);
    }
  }, [fruitTwo, fruitOne]);

  const checkGameStatus = () => {
    const allMatched = fruits.every((fruit) => fruit.matched);
    if (allMatched) {
      setGameFinished(true);
    }
  };

  useEffect(() => {
    if (gameFinished) {
      alert('Congratulations! You won the game!');
    }
  }, [gameFinished]);

  return (
    <>
      <h1>Memory Game</h1>
      {gameFinished ? (
        <>
          <p>Success! You've matched all the cards.</p>
          <button className="start-game" onClick={initGame}>Start Game Again</button>
        </>
      ) : (
        fruits.length ? (
          <>
            <button className="reset" onClick={resetGame}>
              Reset Game
            </button>
            <div className="game-block">
              {fruits.map((fruit, key) => {
                return <Card key={key} chooseCard={chooseCard} flipped={fruit === fruitOne || fruit === fruitTwo || fruit.matched} fruit={fruit} />;
              })}
            </div>
          </>
        ) : (
          <button className="start-game" onClick={initGame}>Start Game</button>
        )
      )}
    </>
  );
}

export default App;
