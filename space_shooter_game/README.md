# 🚀 Space Shooter Game

A classic arcade-style space shooter game built with HTML5 Canvas, CSS3, and vanilla JavaScript. Defend Earth from incoming asteroids and rack up your high score!

## 🎮 Game Overview

Space Shooter is an exciting arcade game where you control a spaceship and must destroy incoming asteroids before they hit you. The game features smooth animations, particle effects, and progressively increasing difficulty.

## 📁 Project Structure

```
space-shooter-game/
│
├── index.html          # Main HTML file
├── style.css           # All styling and animations
├── script.js           # Game logic and mechanics
└── README.md           # This file
```

## ✨ Features

- **Smooth Controls**: Responsive keyboard controls for precise movement
- **Dynamic Gameplay**: Asteroids spawn randomly with varying speeds
- **Scoring System**: Earn 10 points for each asteroid destroyed
- **Lives System**: Start with 3 lives - survive as long as you can!
- **Visual Effects**: 
  - Explosion particle effects
  - Twinkling star background
  - Glowing neon UI elements
- **Game Over Screen**: Displays final score with restart option

## 🎯 How to Play

### Controls
- **Arrow Left** (←): Move spaceship left
- **Arrow Right** (→): Move spaceship right
- **Spacebar**: Fire bullets

### Objective
- Destroy incoming asteroids by shooting them with your bullets
- Avoid letting asteroids hit your spaceship
- Survive as long as possible and get the highest score!

### Scoring
- Each asteroid destroyed: **+10 points**
- You start with **3 lives**
- Game ends when all lives are lost

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A text editor (optional, for customization)

### Installation

1. **Download the project files**
   - Create a new folder for your game (e.g., `space-shooter-game`)
   - Download or create these three files in the folder:
     - `index.html`
     - `style.css`
     - `script.js`

2. **File structure**
   - Make sure all three files are in the same directory
   - The file names must match exactly as referenced in the HTML

### Running the Game

1. Navigate to the folder containing your game files
2. Double-click `index.html` to open it in your default browser
   - OR right-click `index.html` and select "Open with" your preferred browser
3. Start playing immediately!

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Structure and Canvas element
- **CSS3**: Styling, animations, and visual effects
- **JavaScript (ES6)**: Game logic, collision detection, and rendering

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Performance
- Target frame rate: 60 FPS
- Optimized collision detection
- Efficient particle system
- Canvas-based rendering

## 🎨 Game Mechanics

### Player Ship
- Width: 50px
- Height: 50px
- Speed: 7 pixels per frame
- Collision detection with asteroids

### Bullets
- Dimensions: 4x15 pixels
- Fired from ship's center
- Speed: 8 pixels per frame
- Auto-removed when off-screen

### Asteroids
- Size: 40x40 pixels
- Random spawn position at top
- Speed: 2-4 pixels per frame (random)
- Rotating animation effect

### Difficulty
The game naturally increases in difficulty over time as more asteroids spawn, requiring faster reflexes and better accuracy.

## 🎯 Tips & Strategy

1. **Stay Mobile**: Keep moving to avoid asteroid clusters
2. **Aim Ahead**: Shoot where asteroids will be, not where they are
3. **Don't Spam**: Controlled shooting is more accurate than rapid fire
4. **Use Full Width**: Don't stay in the center - use the entire width
5. **Prioritize**: Focus on asteroids closest to your ship first

## 🔧 Customization

### Easy Modifications

You can easily customize the game by modifying these variables in `script.js`:

#### Change Player Speed
```javascript
player.speed = 7; // Increase for faster movement (line 14)
```

#### Change Starting Lives
```javascript
let lives = 3; // Change to any number (line 9)
```

#### Adjust Asteroid Spawn Rate
```javascript
if (Math.random() < 0.02) // Increase 0.02 for more asteroids (line 223)
```

#### Modify Score Value
```javascript
score += 10; // Change points per asteroid (line 182)
```

#### Change Colors
Edit colors in `style.css`:
```css
border: 3px solid #00d4ff; /* Change border color */
color: #00d4ff; /* Change UI text color */
```

Or in `script.js`:
```javascript
ctx.fillStyle = '#00d4ff'; // Player ship color (line 57)
ctx.fillStyle = '#ffff00'; // Bullet color (line 86)
```

## 📝 Code Structure

### index.html
- Basic HTML structure
- Links to CSS and JavaScript files
- Canvas element for game rendering
- UI elements for score and lives
- Game over screen

### style.css
- Responsive layout and centering
- Game container styling
- UI styling with glow effects
- Button hover effects
- Star animation keyframes

### script.js
- **Game State**: Variables for score, lives, and game status
- **Player Object**: Ship properties and movement
- **Game Objects**: Arrays for bullets, asteroids, and particles
- **Rendering Functions**: Draw player, bullets, asteroids, and effects
- **Game Logic**: Collision detection, scoring, and game flow
- **Event Handlers**: Keyboard controls and restart functionality
- **Game Loop**: Main animation loop using requestAnimationFrame

## 📝 Future Enhancements

Potential features to add:

### Gameplay
- [ ] Multiple asteroid types with different sizes
- [ ] Power-ups (shields, rapid fire, extra lives)
- [ ] Boss battles at certain score milestones
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Enemy spaceships that shoot back

### Features
- [ ] High score leaderboard with local storage
- [ ] Sound effects and background music
- [ ] Pause functionality
- [ ] Mobile touch controls
- [ ] Multiple levels with different backgrounds

### Visual
- [ ] Better graphics and sprites
- [ ] More particle effects
- [ ] Screen shake on collisions
- [ ] Different space backgrounds

## 🐛 Troubleshooting

### Game doesn't start
- Ensure all three files are in the same folder
- Check that file names match exactly (case-sensitive)
- Try opening the browser's console (F12) to check for errors

### Controls not working
- Click on the game canvas to focus it
- Make sure you're using arrow keys and spacebar
- Check if another program is intercepting keyboard input

### Performance issues
- Close other browser tabs
- Update your browser to the latest version
- Try a different browser

## 📄 License

This game is free to use, modify, and distribute. No attribution required. Feel free to use it for learning, teaching, or just for fun!

## 🙏 Credits

Created as an educational project to demonstrate:
- HTML5 Canvas game development
- CSS3 animations and effects
- JavaScript game logic and event handling
- Clean code organization and structure

---

## 🎮 Quick Start Guide

1. Download all three files: `index.html`, `style.css`, `script.js`
2. Put them in the same folder
3. Open `index.html` in your browser
4. Use arrow keys to move, spacebar to shoot
5. Destroy asteroids and beat your high score!

**Have fun and may your aim be true!** 🚀✨

---

## 💡 Learning Resources

If you're new to game development, this project demonstrates:
- Canvas API basics
- Game loop implementation
- Collision detection
- Particle systems
- Event handling
- Modular code organization

Feel free to experiment and modify the code to learn!