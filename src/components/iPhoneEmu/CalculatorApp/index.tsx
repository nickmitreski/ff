import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, op: string): number => {
    switch (op) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const inputPercent = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const formatDisplay = (value: string) => {
    // Add comma formatting for large numbers
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      
      {/* Display */}
      <div className="flex-1 bg-black px-4 pb-4">
        <div className="h-full flex flex-col justify-end">
          {/* Display Screen */}
          <div className="text-right text-white text-4xl font-light mb-6 pr-2 min-h-[60px] flex items-end justify-end">
            {formatDisplay(display)}
          </div>
          
          {/* Calculator Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 - Functions */}
            <button
              onClick={clear}
              className="h-16 rounded-full bg-gray-400 text-black text-xl font-medium active:bg-gray-300 transition-colors"
            >
              AC
            </button>
            <button
              onClick={toggleSign}
              className="h-16 rounded-full bg-gray-400 text-black text-xl font-medium active:bg-gray-300 transition-colors"
            >
              +/-
            </button>
            <button
              onClick={inputPercent}
              className="h-16 rounded-full bg-gray-400 text-black text-xl font-medium active:bg-gray-300 transition-colors"
            >
              %
            </button>
            <button
              onClick={() => performOperation('÷')}
              className={`h-16 rounded-full text-white text-2xl font-light active:bg-white active:text-orange-500 transition-colors ${
                operation === '÷' ? 'bg-white text-orange-500' : 'bg-orange-500'
              }`}
            >
              ÷
            </button>

            {/* Row 2 */}
            <button
              onClick={() => inputDigit('7')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              7
            </button>
            <button
              onClick={() => inputDigit('8')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              8
            </button>
            <button
              onClick={() => inputDigit('9')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              9
            </button>
            <button
              onClick={() => performOperation('×')}
              className={`h-16 rounded-full text-white text-2xl font-light active:bg-white active:text-orange-500 transition-colors ${
                operation === '×' ? 'bg-white text-orange-500' : 'bg-orange-500'
              }`}
            >
              ×
            </button>

            {/* Row 3 */}
            <button
              onClick={() => inputDigit('4')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              4
            </button>
            <button
              onClick={() => inputDigit('5')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              5
            </button>
            <button
              onClick={() => inputDigit('6')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              6
            </button>
            <button
              onClick={() => performOperation('-')}
              className={`h-16 rounded-full text-white text-2xl font-light active:bg-white active:text-orange-500 transition-colors ${
                operation === '-' ? 'bg-white text-orange-500' : 'bg-orange-500'
              }`}
            >
              −
            </button>

            {/* Row 4 */}
            <button
              onClick={() => inputDigit('1')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              1
            </button>
            <button
              onClick={() => inputDigit('2')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              2
            </button>
            <button
              onClick={() => inputDigit('3')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              3
            </button>
            <button
              onClick={() => performOperation('+')}
              className={`h-16 rounded-full text-white text-2xl font-light active:bg-white active:text-orange-500 transition-colors ${
                operation === '+' ? 'bg-white text-orange-500' : 'bg-orange-500'
              }`}
            >
              +
            </button>

            {/* Row 5 */}
            <button
              onClick={() => inputDigit('0')}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors col-span-2 flex items-center justify-start pl-6"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="h-16 rounded-full bg-gray-700 text-white text-2xl font-light active:bg-gray-600 transition-colors"
            >
              .
            </button>
            <button
              onClick={() => performOperation('=')}
              className="h-16 rounded-full bg-orange-500 text-white text-2xl font-light active:bg-white active:text-orange-500 transition-colors"
            >
              =
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalculatorApp; 