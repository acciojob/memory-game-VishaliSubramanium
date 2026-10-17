import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './../styles/App.css';

function LandingPage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');

  const handleStartGame = () => {
    navigate(`/${difficulty}`);
  };

  return (
    <div className="landing-page">
      <h1>Memory Game</h1>
      <div className="levels_container">
        <label>
          <input 
            type="radio" 
            id="easy" 
            name="difficulty" 
            value="easy" 
            checked={difficulty === 'easy'} 
            onChange={(e) => setDifficulty(e.target.value)} 
          />
          Easy (4 pairs)
        </label>
        <label>
          <input 
            type="radio" 
            id="normal" 
            name="difficulty" 
            value="normal" 
            checked={difficulty === 'normal'} 
            onChange={(e) => setDifficulty(e.target.value)} 
          />
          Normal (8 pairs)
        </label>
        <label>
          <input 
            type="radio" 
            id="hard" 
            name="difficulty" 
            value="hard" 
            checked={difficulty === 'hard'} 
            onChange={(e) => setDifficulty(e.target.value)} 
          />
          Hard (16 pairs)
        </label>
      </div>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
}

function GameBoard({ pairCount, modeName }) {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [firstSelection, setFirstSelection] = useState(null);
  const [secondSelection, setSecondSelection] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [pairCount]);

  const initializeGame = () => {
    let numbers = [];
    for (let i = 1; i <= pairCount; i++) {
      numbers.push(i, i);
    }
    // Shuffle
    numbers.sort(() => Math.random() - 0.5);
    
    const initializedTiles = numbers.map((num, index) => ({
      id: index,
      value: num,
      isFlipped: false,
      isMatched: false,
    }));

    setTiles(initializedTiles);
    setFirstSelection(null);
    setSecondSelection(null);
    setAttempts(0);
    setMatches(0);
    setIsChecking(false);
  };

  const handleTileClick = (tile) => {
    if (isChecking || tile.isFlipped || tile.isMatched) return;

    const updatedTiles = tiles.map((t) => 
      t.id === tile.id ? { ...t, isFlipped: true } : t
    );
    setTiles(updatedTiles);

    if (!firstSelection) {
      setFirstSelection(tile);
    } else if (!secondSelection && tile.id !== firstSelection.id) {
      setSecondSelection(tile);
      setAttempts((prev) => prev + 1);
      setIsChecking(true);

      if (firstSelection.value === tile.value) {
        setTiles((prevTiles) =>
          prevTiles.map((t) =>
            t.value === tile.value ? { ...t, isMatched: true, isFlipped: true } : t
          )
        );
        setMatches((prev) => prev + 1);
        resetTurn();
      } else {
        setTimeout(() => {
          setTiles((prevTiles) =>
            prevTiles.map((t) =>
              t.id === firstSelection.id || t.id === tile.id
                ? { ...t, isFlipped: false }
                : t
            )
          );
          resetTurn();
        }, 800);
      }
    }
  };

  const resetTurn = () => {
    setFirstSelection(null);
    setSecondSelection(null);
    setIsChecking(false);
  };

  const isCompleted = matches === pairCount;

  return (
    <div className={`game-board ${modeName}`}>
      <h2>{modeName.toUpperCase()} Mode</h2>
      <p>Attempts: {attempts}</p>
      <p>Pairs Matched: {matches} / {pairCount}</p>

      <div className="cells_container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '10px' }}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`tile ${tile.isFlipped || tile.isMatched ? 'flipped' : ''}`}
            onClick={() => handleTileClick(tile)}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: tile.isFlipped || tile.isMatched ? '#fff' : '#333',
              color: tile.isFlipped || tile.isMatched ? '#000' : '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              cursor: 'pointer',
              border: '1px solid #ccc'
            }}
          >
            {tile.isFlipped || tile.isMatched ? tile.value : '?'}
          </div>
        ))}
      </div>

      {isCompleted && (
        <div className="completion-message">
          <h3>Congratulations! You completed the game in {attempts} attempts.</h3>
        </div>
      )}

      <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
        Back to Home
      </button>
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <div id="main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/easy" element={<GameBoard pairCount={4} modeName="easy" />} />
          <Route path="/normal" element={<GameBoard pairCount={8} modeName="normal" />} />
          <Route path="/hard" element={<GameBoard pairCount={16} modeName="hard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
