"""
Tic-Tac-Toe Game - A Classic Python Game
=========================================
A simple implementation of Tic-Tac-Toe with both Player vs Player 
and Player vs Computer modes.

Author: Hacktoberfest 2025 Contributors
"""

import random
import os
from typing import List, Optional, Tuple


class TicTacToe:
    """Main game class for Tic-Tac-Toe"""
    
    def __init__(self):
        """Initialize the game board and settings"""
        self.board = [' ' for _ in range(9)]  # 3x3 board as a list
        self.current_player = 'X'
        self.game_mode = None
        self.game_over = False
        self.winner = None
    
    def display_board(self):
        """Display the current game board"""
        print("\n")
        print("     |     |     ")
        print(f"  {self.board[0]}  |  {self.board[1]}  |  {self.board[2]}  ")
        print("     |     |     ")
        print("-----|-----|-----")
        print("     |     |     ")
        print(f"  {self.board[3]}  |  {self.board[4]}  |  {self.board[5]}  ")
        print("     |     |     ")
        print("-----|-----|-----")
        print("     |     |     ")
        print(f"  {self.board[6]}  |  {self.board[7]}  |  {self.board[8]}  ")
        print("     |     |     ")
        print("\n")
    
    def display_position_guide(self):
        """Display the position guide for players"""
        print("\nPosition Guide:")
        print("     |     |     ")
        print("  1  |  2  |  3  ")
        print("     |     |     ")
        print("-----|-----|-----")
        print("     |     |     ")
        print("  4  |  5  |  6  ")
        print("     |     |     ")
        print("-----|-----|-----")
        print("     |     |     ")
        print("  7  |  8  |  9  ")
        print("     |     |     ")
        print("\n")
    
    def is_valid_move(self, position: int) -> bool:
        """Check if a move is valid"""
        return 0 <= position < 9 and self.board[position] == ' '
    
    def make_move(self, position: int, player: str) -> bool:
        """Make a move on the board"""
        if self.is_valid_move(position):
            self.board[position] = player
            return True
        return False
    
    def check_winner(self) -> Optional[str]:
        """Check if there's a winner"""
        # All possible winning combinations
        winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
            [0, 4, 8], [2, 4, 6]              # Diagonals
        ]
        
        for combo in winning_combinations:
            if (self.board[combo[0]] == self.board[combo[1]] == self.board[combo[2]] 
                and self.board[combo[0]] != ' '):
                return self.board[combo[0]]
        
        return None
    
    def is_board_full(self) -> bool:
        """Check if the board is full"""
        return ' ' not in self.board
    
    def get_available_moves(self) -> List[int]:
        """Get list of available positions"""
        return [i for i in range(9) if self.board[i] == ' ']
    
    def switch_player(self):
        """Switch to the other player"""
        self.current_player = 'O' if self.current_player == 'X' else 'X'
    
    def reset_game(self):
        """Reset the game to initial state"""
        self.board = [' ' for _ in range(9)]
        self.current_player = 'X'
        self.game_over = False
        self.winner = None


class ComputerPlayer:
    """AI player for computer moves"""
    
    def __init__(self, difficulty: str = 'medium'):
        """Initialize computer player with difficulty level"""
        self.difficulty = difficulty
    
    def get_move(self, game: TicTacToe) -> int:
        """Get computer's move based on difficulty"""
        if self.difficulty == 'easy':
            return self._random_move(game)
        elif self.difficulty == 'medium':
            return self._medium_move(game)
        else:  # hard
            return self._smart_move(game)
    
    def _random_move(self, game: TicTacToe) -> int:
        """Make a random move"""
        available = game.get_available_moves()
        return random.choice(available)
    
    def _medium_move(self, game: TicTacToe) -> int:
        """Make a moderately smart move"""
        # 50% chance to use smart move, 50% random
        if random.random() < 0.5:
            return self._smart_move(game)
        return self._random_move(game)
    
    def _smart_move(self, game: TicTacToe) -> int:
        """Make the best possible move using minimax-like strategy"""
        # First, check if computer can win
        move = self._find_winning_move(game, 'O')
        if move is not None:
            return move
        
        # Second, block player from winning
        move = self._find_winning_move(game, 'X')
        if move is not None:
            return move
        
        # Third, try to take center
        if game.board[4] == ' ':
            return 4
        
        # Fourth, try to take a corner
        corners = [0, 2, 6, 8]
        available_corners = [i for i in corners if game.board[i] == ' ']
        if available_corners:
            return random.choice(available_corners)
        
        # Finally, take any available move
        return self._random_move(game)
    
    def _find_winning_move(self, game: TicTacToe, player: str) -> Optional[int]:
        """Find a move that would win the game for the given player"""
        for position in game.get_available_moves():
            # Try the move
            game.board[position] = player
            
            # Check if it wins
            if game.check_winner() == player:
                game.board[position] = ' '  # Undo the move
                return position
            
            # Undo the move
            game.board[position] = ' '
        
        return None


def clear_screen():
    """Clear the console screen"""
    os.system('cls' if os.name == 'nt' else 'clear')


def print_header():
    """Print game header"""
    print("=" * 50)
    print("       TIC-TAC-TOE - HACKTOBERFEST 2025")
    print("=" * 50)


def get_player_move(game: TicTacToe) -> int:
    """Get and validate player move"""
    while True:
        try:
            position = input(f"\nPlayer {game.current_player}, enter your move (1-9): ")
            position = int(position) - 1  # Convert to 0-indexed
            
            if not (0 <= position < 9):
                print("❌ Invalid position! Please enter a number between 1 and 9.")
                continue
            
            if not game.is_valid_move(position):
                print("❌ That position is already taken! Choose another.")
                continue
            
            return position
        
        except ValueError:
            print("❌ Invalid input! Please enter a number between 1 and 9.")
        except KeyboardInterrupt:
            print("\n\nGame interrupted. Thanks for playing!")
            exit(0)


def play_game(game_mode: str):
    """Main game loop"""
    game = TicTacToe()
    computer = None
    
    if game_mode == 'computer':
        print("\nChoose difficulty:")
        print("1. Easy")
        print("2. Medium")
        print("3. Hard")
        
        while True:
            try:
                difficulty_choice = input("\nEnter choice (1-3): ")
                if difficulty_choice == '1':
                    computer = ComputerPlayer('easy')
                    break
                elif difficulty_choice == '2':
                    computer = ComputerPlayer('medium')
                    break
                elif difficulty_choice == '3':
                    computer = ComputerPlayer('hard')
                    break
                else:
                    print("❌ Invalid choice! Please enter 1, 2, or 3.")
            except KeyboardInterrupt:
                print("\n\nGame interrupted. Thanks for playing!")
                return
    
    # Game loop
    while not game.game_over:
        clear_screen()
        print_header()
        game.display_board()
        
        # Get move
        if game_mode == 'player' or game.current_player == 'X':
            game.display_position_guide()
            position = get_player_move(game)
        else:  # Computer's turn
            print(f"\n🤖 Computer (O) is thinking...")
            import time
            time.sleep(1)  # Dramatic pause
            position = computer.get_move(game)
            print(f"Computer chose position {position + 1}")
            time.sleep(1)
        
        # Make move
        game.make_move(position, game.current_player)
        
        # Check for winner
        winner = game.check_winner()
        if winner:
            clear_screen()
            print_header()
            game.display_board()
            print(f"\n🎉 Player {winner} WINS! 🎉\n")
            game.game_over = True
            break
        
        # Check for tie
        if game.is_board_full():
            clear_screen()
            print_header()
            game.display_board()
            print("\n🤝 It's a TIE! Well played! 🤝\n")
            game.game_over = True
            break
        
        # Switch player
        game.switch_player()


def main():
    """Main entry point"""
    while True:
        clear_screen()
        print_header()
        print("\n🎮 Welcome to Tic-Tac-Toe!")
        print("\nGame Modes:")
        print("1. Player vs Player")
        print("2. Player vs Computer")
        print("3. Exit")
        
        try:
            choice = input("\nEnter your choice (1-3): ")
            
            if choice == '1':
                play_game('player')
            elif choice == '2':
                play_game('computer')
            elif choice == '3':
                print("\n👋 Thanks for playing! Goodbye!\n")
                break
            else:
                print("❌ Invalid choice! Please enter 1, 2, or 3.")
                input("\nPress Enter to continue...")
                continue
            
            # Ask to play again
            play_again = input("\nWould you like to play again? (y/n): ").lower()
            if play_again != 'y':
                print("\n👋 Thanks for playing! Goodbye!\n")
                break
        
        except KeyboardInterrupt:
            print("\n\nGame interrupted. Thanks for playing!")
            break


if __name__ == '__main__':
    main()
