import React from "react";

const HowToPlay = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        How to Play Tambola
      </h1>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Game Overview</h2>
          <p className="text-gray-700">
            Tambola, also known as Housie or Indian Bingo, is a fun and engaging
            multiplayer game where players mark numbers on their tickets as they
            are called out.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Game Rules</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>
              Each player gets one or more tickets with numbers arranged in a
              3x9 grid
            </li>
            <li>
              Each ticket contains 15 numbers randomly distributed across the
              grid
            </li>
            <li>Numbers are called out one at a time by the host</li>
            <li>
              Players mark off numbers on their tickets as they are called
            </li>
            <li>The game continues until all winning patterns are achieved</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Winning Patterns</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <h3 className="font-semibold">Early Five</h3>
              <p>First player to mark off any five numbers on their ticket</p>
            </div>
            <div>
              <h3 className="font-semibold">Top Line</h3>
              <p>Complete the first line of the ticket</p>
            </div>
            <div>
              <h3 className="font-semibold">Middle Line</h3>
              <p>Complete the middle line of the ticket</p>
            </div>
            <div>
              <h3 className="font-semibold">Bottom Line</h3>
              <p>Complete the bottom line of the ticket</p>
            </div>
            <div>
              <h3 className="font-semibold">Full House</h3>
              <p>Mark off all numbers on the ticket</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Tips</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>Pay attention to the numbers being called</li>
            <li>Mark your numbers clearly and quickly</li>
            <li>Keep track of winning patterns you're close to completing</li>
            <li>
              Don't forget to call out when you complete a winning pattern
            </li>
            <li>Have fun and enjoy the game!</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default HowToPlay;
