"""
Snake Game - A Classic Python Game
===================================
A simple implementation of the classic Snake game using pygame.

Controls:
- Arrow Keys or WASD: Move the snake
- ESC: Quit the game
- SPACE: Restart after game over

Author: Hacktoberfest 2025 Contributors
"""

import pygame
import random
import sys
from enum import Enum

# Initialize Pygame
pygame.init()

# Game Constants
WINDOW_WIDTH = 640
WINDOW_HEIGHT = 480
GRID_SIZE = 20
GRID_WIDTH = WINDOW_WIDTH // GRID_SIZE
GRID_HEIGHT = WINDOW_HEIGHT // GRID_SIZE

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
DARK_GREEN = (0, 155, 0)
BLUE = (0, 0, 255)

# Game Settings
FPS = 10


class Direction(Enum):
    """Enum for snake movement directions"""
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)


class Snake:
    """Snake class to handle snake logic"""
    
    def __init__(self):
        """Initialize the snake at the center of the screen"""
        self.length = 3
        start_x = GRID_WIDTH // 2
        start_y = GRID_HEIGHT // 2
        self.positions = [(start_x, start_y)]
        self.direction = Direction.RIGHT
        self.grow_pending = False
    
    def get_head_position(self):
        """Get the position of the snake's head"""
        return self.positions[0]
    
    def update(self):
        """Update snake position based on current direction"""
        cur_x, cur_y = self.get_head_position()
        dx, dy = self.direction.value
        new_head = ((cur_x + dx) % GRID_WIDTH, (cur_y + dy) % GRID_HEIGHT)
        
        # Check if snake collided with itself
        if new_head in self.positions[1:]:
            return False
        
        self.positions.insert(0, new_head)
        
        if not self.grow_pending:
            self.positions.pop()
        else:
            self.grow_pending = False
            self.length += 1
        
        return True
    
    def change_direction(self, new_direction):
        """Change snake direction if valid (not opposite direction)"""
        # Prevent moving in opposite direction
        opposite_directions = {
            Direction.UP: Direction.DOWN,
            Direction.DOWN: Direction.UP,
            Direction.LEFT: Direction.RIGHT,
            Direction.RIGHT: Direction.LEFT
        }
        
        if new_direction != opposite_directions[self.direction]:
            self.direction = new_direction
    
    def grow(self):
        """Mark snake to grow on next update"""
        self.grow_pending = True
    
    def draw(self, surface):
        """Draw the snake on the game surface"""
        for i, position in enumerate(self.positions):
            x, y = position
            rect = pygame.Rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
            
            # Draw head in a different shade
            color = GREEN if i == 0 else DARK_GREEN
            pygame.draw.rect(surface, color, rect)
            pygame.draw.rect(surface, BLACK, rect, 1)  # Border


class Food:
    """Food class to handle food logic"""
    
    def __init__(self):
        """Initialize food at a random position"""
        self.position = (0, 0)
        self.randomize_position()
    
    def randomize_position(self, snake_positions=None):
        """Generate a new random position for food"""
        while True:
            new_pos = (random.randint(0, GRID_WIDTH - 1),
                      random.randint(0, GRID_HEIGHT - 1))
            
            # Ensure food doesn't spawn on snake
            if snake_positions is None or new_pos not in snake_positions:
                self.position = new_pos
                break
    
    def draw(self, surface):
        """Draw the food on the game surface"""
        x, y = self.position
        rect = pygame.Rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        pygame.draw.rect(surface, RED, rect)
        pygame.draw.rect(surface, BLACK, rect, 1)  # Border


class Game:
    """Main game class to handle game loop and logic"""
    
    def __init__(self):
        """Initialize game components"""
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption('Snake Game - Hacktoberfest 2025')
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        self.reset_game()
    
    def reset_game(self):
        """Reset game to initial state"""
        self.snake = Snake()
        self.food = Food()
        self.food.randomize_position(self.snake.positions)
        self.score = 0
        self.game_over = False
    
    def handle_input(self):
        """Handle user input"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return False
                
                if self.game_over and event.key == pygame.K_SPACE:
                    self.reset_game()
                
                # Handle direction changes
                if not self.game_over:
                    if event.key in (pygame.K_UP, pygame.K_w):
                        self.snake.change_direction(Direction.UP)
                    elif event.key in (pygame.K_DOWN, pygame.K_s):
                        self.snake.change_direction(Direction.DOWN)
                    elif event.key in (pygame.K_LEFT, pygame.K_a):
                        self.snake.change_direction(Direction.LEFT)
                    elif event.key in (pygame.K_RIGHT, pygame.K_d):
                        self.snake.change_direction(Direction.RIGHT)
        
        return True
    
    def update(self):
        """Update game state"""
        if not self.game_over:
            # Update snake
            if not self.snake.update():
                self.game_over = True
                return
            
            # Check if snake ate food
            if self.snake.get_head_position() == self.food.position:
                self.snake.grow()
                self.score += 10
                self.food.randomize_position(self.snake.positions)
    
    def draw(self):
        """Draw all game elements"""
        self.screen.fill(BLACK)
        
        # Draw grid lines (optional, for better visibility)
        for x in range(0, WINDOW_WIDTH, GRID_SIZE):
            pygame.draw.line(self.screen, (40, 40, 40), (x, 0), (x, WINDOW_HEIGHT))
        for y in range(0, WINDOW_HEIGHT, GRID_SIZE):
            pygame.draw.line(self.screen, (40, 40, 40), (0, y), (WINDOW_WIDTH, y))
        
        # Draw game objects
        self.snake.draw(self.screen)
        self.food.draw(self.screen)
        
        # Draw score
        score_text = self.small_font.render(f'Score: {self.score}', True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        # Draw length
        length_text = self.small_font.render(f'Length: {self.snake.length}', True, WHITE)
        self.screen.blit(length_text, (10, 35))
        
        # Draw game over screen
        if self.game_over:
            # Semi-transparent overlay
            overlay = pygame.Surface((WINDOW_WIDTH, WINDOW_HEIGHT))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            self.screen.blit(overlay, (0, 0))
            
            # Game over text
            game_over_text = self.font.render('GAME OVER!', True, RED)
            text_rect = game_over_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 - 40))
            self.screen.blit(game_over_text, text_rect)
            
            # Final score
            final_score_text = self.font.render(f'Final Score: {self.score}', True, WHITE)
            score_rect = final_score_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2))
            self.screen.blit(final_score_text, score_rect)
            
            # Restart instruction
            restart_text = self.small_font.render('Press SPACE to restart or ESC to quit', True, WHITE)
            restart_rect = restart_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 + 40))
            self.screen.blit(restart_text, restart_rect)
        
        pygame.display.flip()
    
    def run(self):
        """Main game loop"""
        running = True
        
        while running:
            running = self.handle_input()
            self.update()
            self.draw()
            self.clock.tick(FPS)
        
        pygame.quit()
        sys.exit()


def main():
    """Main entry point"""
    print("=" * 50)
    print("Snake Game - Hacktoberfest 2025")
    print("=" * 50)
    print("\nControls:")
    print("  - Arrow Keys or WASD: Move the snake")
    print("  - ESC: Quit the game")
    print("  - SPACE: Restart after game over")
    print("\nObjective:")
    print("  - Eat the red food to grow longer")
    print("  - Don't hit yourself!")
    print("  - The snake wraps around screen edges")
    print("\nStarting game...\n")
    
    game = Game()
    game.run()


if __name__ == '__main__':
    main()
