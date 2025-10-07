import pygame
import random
import sys

pygame.init()

WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Space Invaders Clone")

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 120, 255)
PURPLE = (180, 0, 255)
YELLOW = (255, 255, 0)

class Player:
    def __init__(self):
        self.width = 50
        self.height = 30
        self.x = WIDTH // 2 - self.width // 2
        self.y = HEIGHT - self.height - 20
        self.speed = 6
        self.color = GREEN
        self.lives = 3
    
    def draw(self):
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))
        pygame.draw.polygon(screen, WHITE, [
            (self.x + self.width//2, self.y - 10),
            (self.x + self.width//2 - 10, self.y),
            (self.x + self.width//2 + 10, self.y)
        ])
    
    def move(self, direction):
        if direction == "left" and self.x > 0:
            self.x -= self.speed
        if direction == "right" and self.x < WIDTH - self.width:
            self.x += self.speed

class Bullet:
    def __init__(self, x, y, speed, color=WHITE, enemy_bullet=False):
        self.x = x
        self.y = y
        self.speed = speed
        self.width = 4
        self.height = 12
        self.color = color
        self.enemy_bullet = enemy_bullet
    
    def draw(self):
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))
    
    def move(self):
        self.y += self.speed
    
    def off_screen(self):
        return self.y < 0 or self.y > HEIGHT

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = 40
        self.height = 40
        self.speed = 1
        self.direction = 1
        self.color = random.choice([RED, BLUE, PURPLE, YELLOW])
        self.shoot_timer = random.randint(60, 180)
    
    def draw(self):
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))
        pygame.draw.rect(screen, WHITE, (self.x + 10, self.y + 10, 20, 15))
    
    def move(self):
        self.x += self.speed * self.direction
    
    def shift_down(self):
        self.y += 20
        self.direction *= -1
    
    def try_shoot(self):
        self.shoot_timer -= 1
        if self.shoot_timer <= 0:
            self.shoot_timer = random.randint(120, 300)
            return True
        return False

class Game:
    def __init__(self):
        self.player = Player()
        self.bullets = []
        self.enemy_bullets = []
        self.enemies = []
        self.score = 0
        self.level = 1
        self.game_over = False
        self.font = pygame.font.SysFont('arial', 24)
        self.create_enemies()
    
    def create_enemies(self):
        self.enemies = []
        for row in range(5):
            for col in range(10):
                x = 100 + col * 60
                y = 50 + row * 50
                enemy = Enemy(x, y)
                enemy.speed = 0.5 + (self.level * 0.1)
                self.enemies.append(enemy)
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not self.game_over:
                    bullet = Bullet(
                        self.player.x + self.player.width//2 - 2,
                        self.player.y,
                        -8
                    )
                    self.bullets.append(bullet)
                if event.key == pygame.K_r and self.game_over:
                    self.__init__()
        
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.player.move("left")
        if keys[pygame.K_RIGHT]:
            self.player.move("right")
        
        return True
    
    def update(self):
        if self.game_over:
            return
        
        for bullet in self.bullets[:]:
            bullet.move()
            if bullet.off_screen():
                self.bullets.remove(bullet)
        
        for bullet in self.enemy_bullets[:]:
            bullet.move()
            if bullet.off_screen():
                self.enemy_bullets.remove(bullet)
        
        edge_hit = False
        for enemy in self.enemies:
            enemy.move()
            if enemy.x <= 0 or enemy.x + enemy.width >= WIDTH:
                edge_hit = True
            
            if enemy.try_shoot():
                bullet = Bullet(
                    enemy.x + enemy.width//2 - 2,
                    enemy.y + enemy.height,
                    4,
                    RED,
                    True
                )
                self.enemy_bullets.append(bullet)
            
            if enemy.y + enemy.height >= self.player.y:
                self.player.lives -= 1
                self.enemies.remove(enemy)
                if self.player.lives <= 0:
                    self.game_over = True
        
        if edge_hit:
            for enemy in self.enemies:
                enemy.shift_down()
        
        for bullet in self.bullets[:]:
            for enemy in self.enemies[:]:
                if (bullet.x < enemy.x + enemy.width and
                    bullet.x + bullet.width > enemy.x and
                    bullet.y < enemy.y + enemy.height and
                    bullet.y + bullet.height > enemy.y):
                    
                    if bullet in self.bullets:
                        self.bullets.remove(bullet)
                    self.enemies.remove(enemy)
                    self.score += 10
                    break
        
        for bullet in self.enemy_bullets[:]:
            if (bullet.x < self.player.x + self.player.width and
                bullet.x + bullet.width > self.player.x and
                bullet.y < self.player.y + self.player.height and
                bullet.y + bullet.height > self.player.y):
                
                self.enemy_bullets.remove(bullet)
                self.player.lives -= 1
                if self.player.lives <= 0:
                    self.game_over = True
        
        if not self.enemies:
            self.level += 1
            self.create_enemies()
    
    def draw(self):
        screen.fill(BLACK)
        
        for bullet in self.bullets:
            bullet.draw()
        
        for bullet in self.enemy_bullets:
            bullet.draw()
        
        for enemy in self.enemies:
            enemy.draw()
        
        self.player.draw()
        
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        lives_text = self.font.render(f"Lives: {self.player.lives}", True, WHITE)
        level_text = self.font.render(f"Level: {self.level}", True, WHITE)
        
        screen.blit(score_text, (10, 10))
        screen.blit(lives_text, (WIDTH - 100, 10))
        screen.blit(level_text, (WIDTH // 2 - 40, 10))
        
        if self.game_over:
            game_over_font = pygame.font.SysFont('arial', 64)
            game_over_text = game_over_font.render("GAME OVER", True, RED)
            restart_text = self.font.render("Press R to restart", True, WHITE)
            screen.blit(game_over_text, (WIDTH//2 - 150, HEIGHT//2 - 50))
            screen.blit(restart_text, (WIDTH//2 - 80, HEIGHT//2 + 30))
        
        pygame.display.flip()

def main():
    game = Game()
    clock = pygame.time.Clock()
    
    running = True
    while running:
        running = game.handle_events()
        game.update()
        game.draw()
        clock.tick(60)
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()