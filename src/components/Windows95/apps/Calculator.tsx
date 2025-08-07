import React, { useState, useCallback, memo } from 'react';

/**
 * Calculator component that provides a simple calculator functionality
 * in the Windows 95 interface
 */
const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  /**
   * Handles number button clicks
   * @param num - The number that was clicked
   */
  const handleNumberClick = useCallback((num: string) => {
    if (display === '0' || resetDisplay) {
      setDisplay(num);
      setResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  }, [display, resetDisplay]);

  /**
   * Handles operation button clicks
   * @param op - The operation symbol (+, -, *, /)
   */
  const handleOperationClick = useCallback((op: string) => {
    setOperation(op);
    setPrevValue(parseFloat(display));
    setResetDisplay(true);
  }, [display]);

  /**
   * Handles equals button click to perform the calculation
   */
  const handleEqualsClick = useCallback(() => {
    if (operation && prevValue !== null) {
      let result = 0;
      const currentValue = parseFloat(display);
      
      switch (operation) {
        case '+':
          result = prevValue + currentValue;
          break;
        case '-':
          result = prevValue - currentValue;
          break;
        case '*':
          result = prevValue * currentValue;
          break;
        case '/':
          result = prevValue / currentValue;
          break;
      }
      
      setDisplay(result.toString());
      setOperation(null);
      setPrevValue(null);
    }
  }, [operation, prevValue, display]);

  /**
   * Handles clear button click to reset the calculator
   */
  const handleClearClick = useCallback(() => {
    setDisplay('0');
    setOperation(null);
    setPrevValue(null);
  }, []);

  return (
    <div style={{ padding: '5px' }}>
      <div className="calculator-display">{display}</div>
      <div className="calculator-grid">
        <button className="win95-button" onClick={() => handleNumberClick('7')}>7</button>
        <button className="win95-button" onClick={() => handleNumberClick('8')}>8</button>
        <button className="win95-button" onClick={() => handleNumberClick('9')}>9</button>
        <button className="win95-button" onClick={() => handleOperationClick('/')}>/</button>
        
        <button className="win95-button" onClick={() => handleNumberClick('4')}>4</button>
        <button className="win95-button" onClick={() => handleNumberClick('5')}>5</button>
        <button className="win95-button" onClick={() => handleNumberClick('6')}>6</button>
        <button className="win95-button" onClick={() => handleOperationClick('*')}>*</button>
        
        <button className="win95-button" onClick={() => handleNumberClick('1')}>1</button>
        <button className="win95-button" onClick={() => handleNumberClick('2')}>2</button>
        <button className="win95-button" onClick={() => handleNumberClick('3')}>3</button>
        <button className="win95-button" onClick={() => handleOperationClick('-')}>-</button>
        
        <button className="win95-button" onClick={() => handleNumberClick('0')}>0</button>
        <button className="win95-button" onClick={() => handleNumberClick('.')}>.</button>
        <button className="win95-button" onClick={handleEqualsClick}>=</button>
        <button className="win95-button" onClick={() => handleOperationClick('+')}>+</button>
        
        <button className="win95-button" style={{ gridColumn: 'span 4' }} onClick={handleClearClick}>Clear</button>
      </div>
    </div>
  );
};

export default memo(Calculator);