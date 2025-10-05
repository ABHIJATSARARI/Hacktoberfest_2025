import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 400, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Enhanced Racing Game")

# Colors
WHITE = (255, 255, 255)
GRAY = (50, 50, 50)
ROAD_LINE_COLOR = (200, 200, 200)
BUTTON_COLOR = (0, 200, 0)
BUTTON_HOVER = (0, 255, 0)
BLACK = (0, 0, 0)

# Load images
player_img = pygame.image.load("A_Simple_Game/racing_game/player_car.png")  # Replace with your red car image
player_img = pygame.transform.scale(player_img, (100, 100))

enemy_img = pygame.image.load("A_Simple_Game/racing_game/enemy_car.png")  # Replace with your blue car image
enemy_img = pygame.transform.scale(enemy_img, (50, 100))

arrow_img = pygame.image.load("A_Simple_Game/racing_game/arrow.png")  # Small arrow indicator
arrow_img = pygame.transform.scale(arrow_img, (30, 30))

# Player setup
player_width, player_height = 50, 100
player_x = WIDTH // 2 - player_width // 2
player_y = HEIGHT - player_height - 20
player_speed = 5

# Enemy setup
enemy_width, enemy_height = 50, 100
enemy_speed = 5
enemies = []

# Score
score = 0
font = pygame.font.SysFont(None, 30)

# Clock
clock = pygame.time.Clock()
FPS = 60

# Game state
game_over = False
game_started = False

# Buttons
button_rect = pygame.Rect(WIDTH//2 - 75, HEIGHT//2 - 25, 150, 50)

# Draw road with moving lines
line_offset = 0
def draw_road():
    global line_offset
    screen.fill(GRAY)
    line_offset += 10
    if line_offset >= 40:
        line_offset = 0
    for i in range(-40, HEIGHT, 40):
        pygame.draw.rect(screen, ROAD_LINE_COLOR, (WIDTH//2 - 5, i + line_offset, 10, 20))

def draw_player(x, y):
    screen.blit(player_img, (x, y))

def draw_enemy(x, y):
    screen.blit(enemy_img, (x, y))

def display_score(score):
    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (10, 10))

def draw_start_button():
    mouse_pos = pygame.mouse.get_pos()
    color = BUTTON_HOVER if button_rect.collidepoint(mouse_pos) else BUTTON_COLOR
    pygame.draw.rect(screen, color, button_rect)
    text = font.render("START", True, BLACK)
    screen.blit(text, (button_rect.x + 40, button_rect.y + 10))

def create_enemy():
    x_pos = random.choice([50, 150, 250, 350])
    y_pos = -enemy_height
    enemies.append([x_pos, y_pos])

# Draw arrows for controls
def draw_arrows():
    # Original up arrow
    up_arrow = pygame.transform.scale(arrow_img, (30, 30))
    
    # Rotate for left and right
    left_arrow = pygame.transform.rotate(up_arrow, 90)
    right_arrow = pygame.transform.rotate(up_arrow, -90)

    # Optional: a smaller arrow shadow effect for better styling
    shadow = (0, 0, 0, 100)

    # Draw Left, Up, and Right arrows neatly
    base_y = HEIGHT - 60
    screen.blit(left_arrow, (WIDTH - 120, base_y))   # Left arrow
    
    screen.blit(right_arrow, (WIDTH - 40, base_y))   # Right arrow
# Game loop
spawn_timer = 0
while True:
    clock.tick(FPS)
    draw_road()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.MOUSEBUTTONDOWN and not game_started:
            if button_rect.collidepoint(event.pos):
                game_started = True

    if not game_started:
        draw_start_button()
        pygame.display.flip()
        continue

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and player_x > 0:
        player_x -= player_speed
    if keys[pygame.K_RIGHT] and player_x < WIDTH - player_width:
        player_x += player_speed

    spawn_timer += 1
    if spawn_timer > 90:
        create_enemy()
        spawn_timer = 0

    for enemy in enemies[:]:
        enemy[1] += enemy_speed
        draw_enemy(enemy[0], enemy[1])

        # Collision detection
        if (player_x < enemy[0] + enemy_width and
            player_x + player_width > enemy[0] and
            player_y < enemy[1] + enemy_height and
            player_y + player_height > enemy[1]):
            game_over = True

        # Remove offscreen enemies
        if enemy[1] > HEIGHT:
            enemies.remove(enemy)
            score += 1
            if score % 10 == 0:
                enemy_speed += 1

    draw_player(player_x, player_y)
    display_score(score)
    draw_arrows()

    if game_over:
        game_over_text = font.render(f"Game Over! Score: {score}", True, WHITE)
        screen.blit(game_over_text, (WIDTH//2 - 100, HEIGHT//2))
        pygame.display.flip()
        pygame.time.wait(3000)
        pygame.quit()
        sys.exit()

    pygame.display.flip()
