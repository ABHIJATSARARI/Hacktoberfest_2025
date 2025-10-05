# ⭕ Tic-Tac-Toe Game

A classic Tic-Tac-Toe game implementation in Python with both Player vs Player and Player vs Computer modes.

## 📸 Screenshot

```
     |     |     
  X  |  O  |  X  
     |     |     
-----|-----|-----
     |     |     
  O  |  X  |  O  
     |     |     
-----|-----|-----
     |     |     
  X  |     |     
     |     |     
```

## 🎮 Game Description

The classic game of Tic-Tac-Toe (also known as Noughts and Crosses) brought to your terminal! Play against a friend or challenge the computer AI with three difficulty levels.

## 🎯 Features

- **Two game modes**: Player vs Player and Player vs Computer
- **Three difficulty levels** for AI opponent:
  - Easy: Random moves
  - Medium: Mix of strategic and random moves
  - Hard: Smart AI that blocks and finds winning moves
- **Clean terminal interface** with clear board display
- **Input validation** to prevent invalid moves
- **Position guide** to help players choose moves
- **Play again option** for continuous fun
- **Well-commented code** for easy understanding and modification

## 📋 Requirements

- Python 3.6 or higher
- No external libraries needed! (Uses only standard library)

## 🚀 Installation

No installation needed! Just Python.

1. **Verify Python is installed**:
   ```bash
   python --version
   ```
   or
   ```bash
   python3 --version
   ```

2. **Navigate to the game directory**:
   ```bash
   cd python/tic_tac_toe
   ```

## 🎲 How to Run

1. Run the game:
   ```bash
   python tic_tac_toe.py
   ```
   
   Or:
   ```bash
   python3 tic_tac_toe.py
   ```

2. Follow the on-screen prompts to:
   - Choose your game mode
   - Select difficulty (if playing against computer)
   - Make your moves

## 🕹️ How to Play

1. The game displays a 3x3 grid
2. Players take turns placing their mark (X or O)
3. To make a move, enter a number 1-9 corresponding to the position:
   ```
   1 | 2 | 3
   ---------
   4 | 5 | 6
   ---------
   7 | 8 | 9
   ```
4. Get three in a row (horizontally, vertically, or diagonally) to win!
5. If all spaces are filled with no winner, it's a tie

## 📖 Game Rules

- **X always goes first**
- Players alternate turns
- A player wins by getting three marks in a row:
  - Horizontally (rows)
  - Vertically (columns)
  - Diagonally
- If the board fills up with no winner, the game is a tie

## 🤖 AI Difficulty Levels

### Easy
- Makes random moves
- Good for beginners or young players

### Medium
- 50% chance of making a smart move
- 50% chance of making a random move
- Provides a balanced challenge

### Hard
- Always makes the best possible move
- Will block you from winning
- Will take winning moves when available
- Prefers strategic positions (center, corners)

## 🏆 Tips & Strategy

1. **Control the center**: The center square (5) is the most strategic position
2. **Take corners**: Corners (1, 3, 7, 9) create more winning opportunities
3. **Block your opponent**: Always watch for opponent's potential winning moves
4. **Create forks**: Try to create situations where you have two ways to win
5. **Think ahead**: Plan your next move while your opponent is playing

## 🛠️ Code Structure

The game is organized into three main classes:

- **TicTacToe**: Main game logic, board management, and win detection
- **ComputerPlayer**: AI implementation with different difficulty levels
- **Helper functions**: Display, input validation, and game flow

## 🔧 Customization

You can easily customize the game by editing the code:

- Change player symbols: Modify 'X' and 'O' in the code
- Adjust AI behavior: Edit the `ComputerPlayer` class methods
- Change board display: Modify the `display_board()` method
- Add new features: Score tracking, time limits, etc.

## 📚 Learning Resources

This game demonstrates several programming concepts:

- **Object-Oriented Programming**: Classes and methods
- **Game Logic**: Win condition checking, turn management
- **AI Algorithms**: Minimax-like strategy for computer player
- **Input Validation**: Handling user input safely
- **Type Hints**: Modern Python type annotations

## 🐛 Troubleshooting

**Problem**: Screen doesn't clear properly
- **Solution**: This depends on your terminal. The game uses standard clear commands that work on most systems.

**Problem**: Input not recognized
- **Solution**: Make sure to enter numbers 1-9 only

**Problem**: Game closes unexpectedly
- **Solution**: Check your Python version (3.6+ required)

## 🤝 Contributing

Contributions welcome! Ideas for improvements:

- Add score tracking across multiple games
- Implement a 4x4 or 5x5 board option
- Add colorful terminal output (using colorama)
- Create a GUI version with tkinter or pygame
- Add sound effects
- Implement online multiplayer
- Add game statistics and history

## 📝 License

This project is part of Hacktoberfest 2025 contributions.

## 👨‍💻 Credits

Created for Hacktoberfest 2025
