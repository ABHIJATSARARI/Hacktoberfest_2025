# 🏓 Pong Game

A classic Pong game implementation with smooth gameplay and AI opponent.

## 📸 Screenshot

![Pong Game](screenshot.png)

## 🎮 Game Description

Relive the classic arcade experience! Play Pong against an intelligent computer opponent. Control your paddle to hit the ball and score points. First player to reach 5 points wins!

## 🎯 Features

- **Smooth gameplay** with 60 FPS animation
- **Intelligent AI opponent** with adjustable difficulty
- **Three difficulty levels**: Easy, Medium, Hard
- **Mouse or keyboard controls** for flexible gameplay
- **Beautiful UI** with gradient backgrounds and glow effects
- **Responsive design** that works on different screen sizes
- **Score tracking** with win condition
- **Pause/Resume** functionality

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies needed!

## 🚀 How to Play

### Option 1: Direct File Opening
1. Navigate to the `javascript/pong_game/` directory
2. Double-click `pong.html` to open it in your default browser

### Option 2: Local Server (Recommended)
1. Navigate to the game directory:
   ```bash
   cd javascript/pong_game
   ```

2. Start a local server:
   
   **Using Python 3:**
   ```bash
   python -m http.server 8000
   ```
   
   **Using Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```
   
   **Using Node.js (with http-server):**
   ```bash
   npx http-server -p 8000
   ```

3. Open your browser and go to: `http://localhost:8000/pong.html`

## 🕹️ Controls

### Mouse Control (Primary)
- **Move Mouse**: Control your paddle position
- Simply move your mouse up and down over the game area

### Keyboard Control (Alternative)
- **W**: Move paddle up
- **S**: Move paddle down
- **P**: Pause/Resume game

## 🎲 Gameplay

1. Click the **START GAME** button
2. Choose your difficulty level (Easy, Medium, or Hard)
3. Control your paddle (left side) to hit the ball
4. Score points when the ball passes the computer's paddle
5. First to 5 points wins!
6. The ball speeds up slightly with each hit for added challenge

## ⚙️ Difficulty Levels

- **Easy**: Slower computer paddle, slower ball
- **Medium**: Balanced gameplay (default)
- **Hard**: Fast computer paddle, faster ball - a real challenge!

## 🏆 Tips & Strategy

- **Anticipate the ball's trajectory** instead of chasing it
- **Hit the ball with the edge of your paddle** to create sharper angles
- **Use the top and bottom edges** to surprise the computer
- **Keep the ball moving** - speed increases with each hit
- **Practice makes perfect** - start with Easy mode if you're new!

## 🛠️ Technical Details

- **Pure JavaScript** - No frameworks required
- **HTML5 Canvas** for rendering
- **RequestAnimationFrame** for smooth animation
- **Collision detection** with realistic physics
- **Responsive design** with CSS Flexbox

## 🔧 Customization

You can easily customize the game by editing `pong.js`:

- Change paddle size: Modify `paddleWidth` and `paddleHeight`
- Adjust ball speed: Edit values in the `difficulties` object
- Change winning score: Modify `winningScore`
- Update colors: Edit the color values in drawing functions

## 🐛 Troubleshooting

**Problem**: Game doesn't load
- **Solution**: Make sure both `pong.html` and `pong.js` are in the same directory

**Problem**: Controls not responding
- **Solution**: Make sure the game window is focused (click on it)

**Problem**: Game runs too fast/slow
- **Solution**: This might be due to monitor refresh rate - try a different browser

## 🤝 Contributing

Contributions are welcome! Ideas for improvements:
- Add sound effects
- Create power-ups
- Add multiplayer mode
- Implement different ball types
- Create tournament mode
- Add particle effects

## 📝 License

This project is part of Hacktoberfest 2025 contributions.

## 👨‍💻 Credits

Created for Hacktoberfest 2025
Inspired by the original Pong (1972)
