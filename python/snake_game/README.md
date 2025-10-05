# 🐍 Snake Game

A classic Snake game implementation in Python using Pygame.

## 📸 Screenshot

![Snake Game](screenshot.png)

## 🎮 Game Description

Navigate a growing snake around the screen, eating food to grow longer while avoiding colliding with yourself. The snake wraps around the screen edges for continuous play.

## 🎯 Features

- Classic snake gameplay
- Score tracking
- Smooth controls (Arrow keys or WASD)
- Grid-based movement
- Game over and restart functionality
- Visual feedback with color-coded snake head and body

## 📋 Requirements

- Python 3.6 or higher
- Pygame library

## 🚀 Installation

1. **Install Python** (if not already installed):
   - Download from [python.org](https://www.python.org/downloads/)
   - Make sure to add Python to your PATH during installation

2. **Install Pygame**:
   ```bash
   pip install pygame
   ```

   Or if you're using Python 3 specifically:
   ```bash
   pip3 install pygame
   ```

## 🎲 How to Run

1. Navigate to the game directory:
   ```bash
   cd python/snake_game
   ```

2. Run the game:
   ```bash
   python snake_game.py
   ```

   Or:
   ```bash
   python3 snake_game.py
   ```

## 🕹️ Controls

- **Arrow Keys** or **WASD**: Move the snake
  - ↑ / W: Move up
  - ↓ / S: Move down
  - ← / A: Move left
  - → / D: Move right
- **ESC**: Quit the game
- **SPACE**: Restart after game over

## 📖 Game Rules

1. Control the snake to eat the red food
2. Each food eaten increases your score by 10 points
3. The snake grows longer with each food eaten
4. Don't collide with your own body
5. The snake wraps around screen edges

## 🏆 Tips

- Plan your path ahead to avoid trapping yourself
- Use the screen wrapping to your advantage
- Try to keep the snake in open areas when it gets long

## 🛠️ Troubleshooting

**Problem**: `ModuleNotFoundError: No module named 'pygame'`
- **Solution**: Install pygame using `pip install pygame`

**Problem**: Game runs too fast or too slow
- **Solution**: Adjust the `FPS` constant in the code (default is 10)

**Problem**: Display issues
- **Solution**: Make sure you have the latest graphics drivers and pygame version

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new features (power-ups, obstacles, levels)
- Improve the graphics
- Add sound effects
- Optimize the code
- Fix bugs

## 📝 License

This project is part of Hacktoberfest 2025 contributions.

## 👨‍💻 Credits

Created for Hacktoberfest 2025
