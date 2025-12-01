'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function DragRace() {
  // Words to type
  const words = [
    'quick',
    'brown',
    'fox',
    'jumps',
    'over',
    'the',
    'lazy',
    'dog',
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [speed, setSpeed] = useState(0); // pixels per second
  const [position, setPosition] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Move car
  useEffect(() => {
    if (finished) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPosition((prev) => prev + speed / 60); // update per frame (~60fps)
    }, 1000 / 60);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed, finished]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finished) return;
    const trimmed = input.trim();
    if (trimmed === words[currentWordIndex]) {
      // Correct word
      setCurrentWordIndex((i) => i + 1);
      setSpeed((s) => s + 10); // accelerate
      setInput('');
      if (currentWordIndex + 1 >= words.length) {
        setFinished(true);
      }
    } else {
      // Incorrect: reset speed
      setSpeed(0);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Drag Racing Typing Game</h2>
      <p className="mb-4">
        Type the words shown below as fast as you can. Each correct word increases your car&apos;s speed. The first car to finish the race wins.
      </p>
      <div className="relative h-32 bg-gray-200 rounded overflow-hidden mb-4">
        <div
          className={cn(
            'absolute top-1/2 left-0 transform -translate-y-1/2 bg-red-500 w-8 h-8 rounded-full',
            'transition-transform duration-0'
          )}
          style={{ transform: `translateX(${position}px)` }}
        />
      </div>
      <div className="mb-4">
        <span className="font-medium">Next word:</span>{' '}
        <span className="text-blue-600">{words[currentWordIndex]}</span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          disabled={finished}
          autoFocus
        />
        <Button type="submit" disabled={finished}>
          Submit
        </Button>
      </form>
      {finished && (
        <div className="mt-4 text-green-600 font-semibold">
          You finished the race! 🎉
        </div>
      )}
    </div>
  );
}
