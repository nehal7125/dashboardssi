// src/components/Counter.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
} from '../../features/counter/counterSlice';

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div>
      <h1>{count}</h1>
      <button
        className="bg-primary m-2 border-white border-x border-y p-2 rounded-lg font-semibold text-white hover:bg-blue-300 hover:text-black"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <button
        className="bg-primary m-2 border-white border-x border-y p-2 rounded-lg font-semibold text-white hover:bg-blue-300 hover:text-black"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
      <button
        className="bg-primary m-2 border-white border-x border-y p-2 rounded-lg font-semibold text-white hover:bg-blue-300 hover:text-black"
        onClick={() => dispatch(incrementByAmount(5))}
      >
        Increment by 5
      </button>
      <button
        className="bg-primary m-2 border-white border-x border-y p-2 rounded-lg font-semibold text-white hover:bg-blue-300 hover:text-black"
        onClick={() => dispatch(decrementByAmount(5))}
      >
        Decrement by 5
      </button>
    </div>
  );
};

export default Counter;
