# 🎮 Game Setup Guide - Hacktoberfest 2025

Complete guide for setting up and running all games in this repository.

## Table of Contents
- [Python Games Setup](#python-games-setup)
- [JavaScript Games Setup](#javascript-games-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing Your Own Game](#contributing-your-own-game)

---

## Python Games Setup

### Prerequisites

#### 1. Install Python
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **macOS**: `brew install python3` or download from python.org
- **Linux**: Usually pre-installed, or use `sudo apt install python3`

Verify installation:
```bash
python3 --version
# Should show Python 3.6 or higher
```

#### 2. Install pip (Python Package Manager)
Usually comes with Python, verify:
```bash
pip3 --version
```

### Installing Pygame (For Snake Game, Racing Game)

```bash
# Install pygame globally
pip3 install pygame

# Or using requirements.txt
cd python/snake_game
pip3 install -r requirements.txt
```

### Running Python Games

#### Snake Game
```bash
cd python/snake_game
python3 snake_game.py
```

**Controls:**
- Arrow Keys or WASD: Move snake
- ESC: Quit
- SPACE: Restart

#### Tic-Tac-Toe
```bash
cd python/tic_tac_toe
python3 tic_tac_toe.py
```

**Controls:**
- Enter numbers 1-9 to make moves
- Follow on-screen prompts

#### Racing Game
```bash
cd python/racing_game
python3 racing_game.py
```

---

## JavaScript Games Setup

### Prerequisites

All you need is a **modern web browser**:
- Google Chrome (recommended)
- Mozilla Firefox
- Safari
- Microsoft Edge

### Method 1: Direct File Opening (Simplest)

1. Navigate to the game folder
2. Double-click the `.html` file
3. Game opens in your default browser

**Example:**
```
javascript/pong_game/pong.html → Double-click to play
```

### Method 2: Local Server (Recommended for Development)

Running a local server prevents CORS issues and provides better performance.

#### Using Python (Easiest)

**Python 3:**
```bash
cd javascript/pong_game
python3 -m http.server 8000
```

**Python 2:**
```bash
cd javascript/pong_game
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000/pong.html`

#### Using Node.js

**With http-server:**
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
cd javascript/pong_game
http-server -p 8000
```

**With npx (no installation needed):**
```bash
cd javascript/pong_game
npx http-server -p 8000
```

#### Using PHP
```bash
cd javascript/pong_game
php -S localhost:8000
```

### Running JavaScript Games

#### Pong Game
```bash
cd javascript/pong_game
python3 -m http.server 8000
# Open: http://localhost:8000/pong.html
```

**Controls:**
- Mouse: Move paddle
- W/S Keys: Alternative controls
- P: Pause/Resume

#### Memory Game
```bash
cd javascript
python3 -m http.server 8000
# Open: http://localhost:8000/memory.html
```

#### Space Shooter
```bash
cd space_shooter_game
python3 -m http.server 8000
# Open: http://localhost:8000/index.html
```

---

## Troubleshooting

### Python Issues

#### Problem: "python: command not found"
**Solution:**
```bash
# Try python3 instead
python3 --version

# On Windows, verify Python is in PATH
# Or reinstall Python with "Add to PATH" checked
```

#### Problem: "ModuleNotFoundError: No module named 'pygame'"
**Solution:**
```bash
# Install pygame
pip3 install pygame

# If pip3 doesn't work, try:
python3 -m pip install pygame

# On macOS with permission issues:
pip3 install --user pygame
```

#### Problem: Pygame display issues
**Solution:**
- Update graphics drivers
- Update pygame: `pip3 install --upgrade pygame`
- Try running with admin/sudo permissions

#### Problem: Virtual environment issues
**Solution:**
```bash
# Create new virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install packages
pip install pygame
```

### JavaScript Issues

#### Problem: Game doesn't load
**Solution:**
- Check if both HTML and JS files are in the same folder
- Try using a local server instead of direct file opening
- Check browser console (F12) for errors

#### Problem: CORS errors
**Solution:**
- Use a local server (see Method 2 above)
- Don't open files directly from file:// protocol

#### Problem: Controls not working
**Solution:**
- Click on the game canvas to focus it
- Ensure browser supports the required features
- Try a different browser

#### Problem: Game runs too fast/slow
**Solution:**
- Check monitor refresh rate settings
- Clear browser cache
- Close other tabs/applications

### General Issues

#### Problem: Port 8000 already in use
**Solution:**
```bash
# Use a different port
python3 -m http.server 8080
# Or find and kill the process using port 8000

# Linux/macOS:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

#### Problem: Permission denied errors
**Solution:**
```bash
# Linux/macOS: Add execute permissions
chmod +x script_name.py

# Or use sudo (not recommended for pip)
sudo pip3 install package_name
```

---

## Contributing Your Own Game

### For Python Games

1. **Create game folder:**
   ```bash
   mkdir -p python/your_game_name
   cd python/your_game_name
   ```

2. **Create your game file:**
   ```bash
   touch your_game.py
   ```

3. **Add documentation:**
   - Create `README.md` with setup instructions
   - Add `requirements.txt` if using external libraries
   - Include screenshots in `assets/carousel/`

4. **Test your game:**
   ```bash
   python3 your_game.py
   ```

### For JavaScript Games

1. **Create game folder:**
   ```bash
   mkdir -p javascript/your_game_name
   cd javascript/your_game_name
   ```

2. **Create your game files:**
   ```bash
   touch game.html
   touch game.js
   touch game.css
   ```

3. **Add documentation:**
   - Create `README.md` with instructions
   - Include screenshots in `assets/carousel/`

4. **Test your game:**
   ```bash
   python3 -m http.server 8000
   # Open in browser
   ```

### Documentation Checklist

Every game should include:

- [ ] **README.md** with:
  - Game description
  - Features list
  - Installation instructions
  - How to run
  - Controls
  - Game rules
  - Troubleshooting section
  - Screenshots (optional)

- [ ] **Code quality:**
  - Clear comments
  - Modular structure
  - Error handling
  - Input validation

- [ ] **Testing:**
  - Runs without errors
  - All features work
  - Controls are responsive
  - Compatible with target platforms

- [ ] **Assets:**
  - Screenshot added to `assets/carousel/`
  - Named as `sample-game-X.png` (next available number)

### Submission Process

1. Fork the repository
2. Create your game in appropriate folder
3. Add documentation
4. Test thoroughly
5. Add screenshot to carousel
6. Create pull request
7. Wait for review

---

## Quick Command Reference

### Python
```bash
# Check Python version
python3 --version

# Install package
pip3 install package_name

# Run Python script
python3 script.py

# Create virtual environment
python3 -m venv venv
source venv/bin/activate
```

### JavaScript/Web
```bash
# Start Python HTTP server
python3 -m http.server 8000

# Start Node HTTP server
npx http-server -p 8000

# Open browser to
http://localhost:8000
```

### General
```bash
# Navigate directories
cd folder_name
cd ..

# List files
ls -la

# Create folder
mkdir folder_name

# Copy files
cp source destination
```

---

## Useful Resources

### Python
- [Python Official Docs](https://docs.python.org/3/)
- [Pygame Documentation](https://www.pygame.org/docs/)
- [Python Tutorial](https://docs.python.org/3/tutorial/)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [HTML5 Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

### Game Development
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Pygame Tutorials](https://www.pygame.org/wiki/tutorials)
- [JavaScript Game Development](https://developer.mozilla.org/en-US/docs/Games)

---

## Need Help?

- 📖 Check game-specific README files
- 💬 [Open an issue](https://github.com/Nitesh-Badgujar-28906/Hacktoberfest_2025/issues)
- 🤝 [Join discussions](https://github.com/Nitesh-Badgujar-28906/Hacktoberfest_2025/discussions)
- 📧 Contact maintainers

---

**Happy Gaming! 🎮**
*Hacktoberfest 2025*
