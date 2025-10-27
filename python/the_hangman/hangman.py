import random

# List of words for the game
words = ["python", "developer", "hangman", "programming", "computer", "artificial", "intelligence", "keyboard", "science"]

# Choose a random word
word = random.choice(words)
word_letters = set(word)  # unique letters in the word
alphabet = set("abcdefghijklmnopqrstuvwxyz")
used_letters = set()  # letters guessed by the user

lives = 6  # total number of wrong guesses allowed

print("🎮 Welcome to Hangman!")
print("Guess the word, one letter at a time.")

while len(word_letters) > 0 and lives > 0:
    # show current progress
    print("\nYou have", lives, "lives left and you have used these letters: ", " ".join(sorted(used_letters)))
    
    # show the word with guessed letters and underscores
    word_display = [letter if letter in used_letters else "_" for letter in word]
    print("Current word: ", " ".join(word_display))
    
    # get user input
    user_letter = input("Guess a letter: ").lower()
    
    if user_letter in alphabet - used_letters:
        used_letters.add(user_letter)
        if user_letter in word_letters:
            word_letters.remove(user_letter)
            print("✅ Good guess!")
        else:
            lives -= 1
            print("❌ Wrong guess! You lost a life.")
    elif user_letter in used_letters:
        print("⚠️ You already used that letter. Try again.")
    else:
        print("🚫 Invalid character. Please enter an alphabet letter.")

# end of game messages
if lives == 0:
    print("\n💀 You died! The word was:", word)
else:
    print("\n🎉 Congratulations! You guessed the word:", word)
    