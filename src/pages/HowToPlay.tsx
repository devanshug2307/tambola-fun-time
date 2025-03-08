import React from "react";

const HowToPlay = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
      <header className="mb-8 text-center">
        <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            How to Play Tambola
          </h1>
        </div>
        <p className="mt-4 text-gray-600 italic">
          Revolutionize game nights with our next-generation Housie experience
        </p>
      </header>

      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-purple-500 transform transition hover:scale-[1.01]">
          <div className="flex items-center mb-4">
            <div className="bg-purple-500 rounded-full p-2 mr-3">
              <div className="w-8 h-8 flex items-center justify-center text-white font-bold">
                1
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Game Overview
            </h2>
          </div>
          <div className="pl-4 border-l-2 border-purple-200 ml-5">
            <p className="text-gray-700">
              Tambola (also known as Housie or Indian Bingo) is a fun and
              exciting multiplayer game where players mark numbers on their
              tickets as they are called out. Create epic rooms, invite your
              squad, and turn every moment into a celebration of wins!
            </p>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-pink-400 transform transition hover:scale-[1.01]">
          <div className="flex items-center mb-4">
            <div className="bg-pink-400 rounded-full p-2 mr-3">
              <div className="w-8 h-8 flex items-center justify-center text-white font-bold">
                2
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Getting Started
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-5 rounded-lg shadow">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
                  C
                </div>
                <h3 className="font-bold text-lg text-purple-700">
                  Create a Room
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700 pl-4">
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-purple-300 mt-1 mr-2"></span>
                  <span>Click the "Create Room" button on the homepage</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-purple-300 mt-1 mr-2"></span>
                  <span>You'll receive a 6-digit room code (like XPX67M)</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-purple-300 mt-1 mr-2"></span>
                  <span>Share the code with friends to invite them</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-purple-300 mt-1 mr-2"></span>
                  <span>Set the number interval (3-15 seconds)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-50 p-5 rounded-lg shadow">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold mr-3">
                  J
                </div>
                <h3 className="font-bold text-lg text-pink-700">Join a Room</h3>
              </div>
              <ul className="space-y-2 text-gray-700 pl-4">
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-pink-300 mt-1 mr-2"></span>
                  <span>Click "Join Room" on the homepage</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-pink-300 mt-1 mr-2"></span>
                  <span>Enter the 6-digit code shared with you</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-pink-300 mt-1 mr-2"></span>
                  <span>Enter your name to join the game</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-pink-300 mt-1 mr-2"></span>
                  <span>Wait for the host to start the game</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Gameplay Section */}
        <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-purple-500 transform transition hover:scale-[1.01]">
          <div className="flex items-center mb-6">
            <div className="bg-purple-500 rounded-full p-2 mr-3">
              <div className="w-8 h-8 flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              How to Play
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-400">
              <h3 className="font-bold text-lg text-purple-700 mb-2">
                Gameplay Flow
              </h3>
              <p className="text-gray-700 mb-4">
                Once the game starts, numbers will be called automatically
                according to the selected interval.
              </p>
              <div className="flex flex-wrap justify-center gap-4 my-3">
                <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md w-24">
                  <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold mb-2">
                    1
                  </div>
                  <span className="text-sm text-center">Number Called</span>
                </div>
                <div className="flex items-center text-purple-500">→</div>
                <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md w-24">
                  <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold mb-2">
                    2
                  </div>
                  <span className="text-sm text-center">Check Ticket</span>
                </div>
                <div className="flex items-center text-purple-500">→</div>
                <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md w-24">
                  <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold mb-2">
                    3
                  </div>
                  <span className="text-sm text-center">Mark Number</span>
                </div>
                <div className="flex items-center text-purple-500">→</div>
                <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-md w-24">
                  <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold mb-2">
                    4
                  </div>
                  <span className="text-sm text-center">Claim Prize</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-50 p-5 rounded-lg shadow">
                <h3 className="font-bold text-lg text-purple-700 mb-3">
                  Your Ticket
                </h3>
                <div className="pl-3 border-l-2 border-purple-300">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      Each ticket contains 15 numbers arranged in a 3×9 grid
                    </li>
                    <li>
                      Numbers are distributed according to column rules:
                      <ul className="ml-4 mt-1 space-y-1 text-sm">
                        <li>Column 1: Numbers 1-9</li>
                        <li>Column 2: Numbers 10-19</li>
                        <li>And so on...</li>
                      </ul>
                    </li>
                    <li>Each row contains 5 numbers and 4 blank spaces</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-100 to-purple-50 p-5 rounded-lg shadow">
                <h3 className="font-bold text-lg text-pink-700 mb-3">
                  Number Tracking
                </h3>
                <div className="pl-3 border-l-2 border-pink-300">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      The game shows:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>Current number called (highlighted)</li>
                        <li>Numbers marked on your ticket</li>
                        <li>Total numbers called so far</li>
                        <li>Remaining numbers to be called</li>
                        <li>Countdown timer for next number</li>
                      </ul>
                    </li>
                    <li>Tap numbers on your ticket to mark them</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Winning Patterns Section */}
        <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-pink-400 transform transition hover:scale-[1.01]">
          <div className="flex items-center mb-6">
            <div className="bg-pink-500 rounded-full p-2 mr-3">
              <div className="w-8 h-8 flex items-center justify-center text-white font-bold">
                4
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Winning Patterns
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col bg-gradient-to-br from-pink-500 to-pink-400 text-white p-5 rounded-lg shadow-md transform transition hover:scale-105">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-white text-pink-500 flex items-center justify-center font-bold mr-3">
                  5
                </div>
                <h3 className="font-bold text-lg">Early Five</h3>
              </div>
              <p className="text-white">
                First to mark any five numbers on your ticket
              </p>
              <div className="mt-auto flex justify-end">
                <div className="mt-3 bg-white text-pink-500 text-xs px-3 py-1 rounded-full">
                  Fastest Win
                </div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-400 text-white p-5 rounded-lg shadow-md transform transition hover:scale-105">
                <h3 className="font-bold text-lg mb-2">Top Line</h3>
                <p className="text-white text-sm">
                  Complete the first row of your ticket
                </p>
                <div className="mt-3 flex">
                  <div className="mt-1 bg-white text-blue-500 text-xs px-2 py-1 rounded-full">
                    Row 1
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-400 text-white p-5 rounded-lg shadow-md transform transition hover:scale-105">
                <h3 className="font-bold text-lg mb-2">Middle Line</h3>
                <p className="text-white text-sm">
                  Complete the middle row of your ticket
                </p>
                <div className="mt-3 flex">
                  <div className="mt-1 bg-white text-purple-500 text-xs px-2 py-1 rounded-full">
                    Row 2
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-400 text-white p-5 rounded-lg shadow-md transform transition hover:scale-105">
                <h3 className="font-bold text-lg mb-2">Bottom Line</h3>
                <p className="text-white text-sm">
                  Complete the bottom row of your ticket
                </p>
                <div className="mt-3 flex">
                  <div className="mt-1 bg-white text-indigo-500 text-xs px-2 py-1 rounded-full">
                    Row 3
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-5 rounded-lg shadow-md transform transition hover:scale-[1.02]">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold mr-3">
                  <span className="text-lg">🏆</span>
                </div>
                <h3 className="font-bold text-xl">Full House</h3>
              </div>
              <p className="text-white ml-12">
                Mark all 15 numbers on your ticket to win the grand prize!
              </p>
              <div className="mt-3 flex justify-end">
                <div className="bg-white text-purple-600 text-sm px-3 py-1 rounded-full font-bold">
                  Grand Prize
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Claiming Wins Section */}
        <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border-t-4 border-purple-500 transform transition hover:scale-[1.01]">
          <div className="flex items-center mb-6">
            <div className="bg-purple-500 rounded-full p-2 mr-3">
              <div className="w-8 h-8 flex items-center justify-center text-white font-bold">
                5
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Claiming Wins
            </h2>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-purple-50 p-5 rounded-lg">
            <ol className="space-y-4">
              <li className="flex">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
                  1
                </div>
                <div>
                  <p className="font-semibold text-purple-700">
                    Complete a Pattern
                  </p>
                  <p className="text-gray-600 text-sm">
                    Mark all required numbers for a specific winning pattern
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
                  2
                </div>
                <div>
                  <p className="font-semibold text-purple-700">
                    Click Claim Button
                  </p>
                  <p className="text-gray-600 text-sm">
                    Select the appropriate prize button (Early 5, Full House,
                    etc.)
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
                  3
                </div>
                <div>
                  <p className="font-semibold text-purple-700">
                    Automatic Verification
                  </p>
                  <p className="text-gray-600 text-sm">
                    The system will verify your claim instantly
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
                  4
                </div>
                <div>
                  <p className="font-semibold text-purple-700">
                    Win Announcement
                  </p>
                  <p className="text-gray-600 text-sm">
                    All players will be notified of your win
                  </p>
                </div>
              </li>
            </ol>

            <div className="mt-6 bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-400 flex">
              <div className="text-yellow-600 text-xl mr-3">💡</div>
              <div>
                <p className="font-semibold text-yellow-800">Pro Tip:</p>
                <p className="text-yellow-700">
                  Keep an eye on the countdown timer and be ready to mark
                  numbers quickly as they are called!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Play Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 md:p-8 rounded-xl shadow-lg text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Play?
          </h2>
          <p className="mb-6 text-lg">
            Join the fun and excitement with friends and family!
          </p>
          {/* <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl">
              Create Room
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:bg-opacity-20 transform transition hover:scale-105">
              Join Room
            </button>
          </div> */}
        </section>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Questions? Check out our FAQ or contact support for assistance.</p>
      </footer>
    </div>
  );
};

export default HowToPlay;
