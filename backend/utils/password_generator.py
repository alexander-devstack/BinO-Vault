import secrets
import string


class PasswordGenerator:
    """
    Generates cryptographically secure random passwords.

    WHY USE secrets MODULE:
    - secrets.choice() uses OS random (cryptographically secure)
    - random.choice() is predictable (NOT secure for passwords)
    - secrets prevents attackers from guessing generated passwords
    """

    def __init__(self):
        self.lowercase = string.ascii_lowercase  # a-z
        self.uppercase = string.ascii_uppercase  # A-Z
        self.digits = string.digits  # 0-9
        self.special = "!@#$%^&*()-_=+[]{}|;:,.<>?"

    def generate(
            self,
            length: int = 16,
            use_uppercase: bool = True,
            use_digits: bool = True,
            use_special: bool = True
    ) -> str:
        """
        Generate a random password.

        Args:
            length: Password length (default: 16)
            use_uppercase: Include uppercase letters
            use_digits: Include numbers
            use_special: Include special characters

        Returns:
            Cryptographically secure random password
        """
        if length < 8:
            length = 8  # Minimum security requirement

        if length > 64:
            length = 64  # Maximum for usability

        # Build character pool
        chars = self.lowercase  # Always include lowercase

        if use_uppercase:
            chars += self.uppercase

        if use_digits:
            chars += self.digits

        if use_special:
            chars += self.special

        # Generate password
        password = ''.join(secrets.choice(chars) for _ in range(length))

        # Ensure at least one character from each selected category
        if use_uppercase and not any(c in self.uppercase for c in password):
            password = self._replace_random_char(password, self.uppercase)

        if use_digits and not any(c in self.digits for c in password):
            password = self._replace_random_char(password, self.digits)

        if use_special and not any(c in self.special for c in password):
            password = self._replace_random_char(password, self.special)

        return password

    def _replace_random_char(self, password: str, charset: str) -> str:
        """Replace a random character with one from the given charset."""
        password_list = list(password)
        random_index = secrets.randbelow(len(password_list))
        password_list[random_index] = secrets.choice(charset)
        return ''.join(password_list)

    def calculate_strength(self, password: str) -> dict:
        """
        Calculate password strength.

        Returns:
            {
                "level": "Weak" | "Medium" | "Strong",
                "score": 0-100,
                "feedback": ["suggestion1", "suggestion2"]
            }
        """
        score = 0
        feedback = []

        # Length check
        length = len(password)
        if length >= 16:
            score += 40
        elif length >= 12:
            score += 30
        elif length >= 8:
            score += 20
        else:
            score += 10
            feedback.append("Password should be at least 12 characters")

        # Character variety checks
        has_lowercase = any(c in string.ascii_lowercase for c in password)
        has_uppercase = any(c in string.ascii_uppercase for c in password)
        has_digit = any(c in string.digits for c in password)
        has_special = any(c in "!@#$%^&*()-_=+[]{}|;:,.<>?" for c in password)

        if has_lowercase:
            score += 10
        else:
            feedback.append("Add lowercase letters")

        if has_uppercase:
            score += 15
        else:
            feedback.append("Add uppercase letters")

        if has_digit:
            score += 15
        else:
            feedback.append("Add numbers")

        if has_special:
            score += 20
        else:
            feedback.append("Add special characters (!@#$%^&*)")

        # Determine level
        if score >= 80:
            level = "Strong"
        elif score >= 50:
            level = "Medium"
        else:
            level = "Weak"

        return {
            "level": level,
            "score": score,
            "feedback": feedback if feedback else ["Great password!"]
        }


# Test the generator
if __name__ == "__main__":
    gen = PasswordGenerator()

    print("=== Password Generator Test ===\n")

    # Test generation
    password = gen.generate(length=16)
    print(f"Generated password: {password}")

    # Test strength calculation
    strength = gen.calculate_strength(password)
    print(f"Strength: {strength['level']} (Score: {strength['score']}/100)")
    print(f"Feedback: {', '.join(strength['feedback'])}\n")

    # Test weak password
    weak = "password123"
    weak_strength = gen.calculate_strength(weak)
    print(f"Weak password '{weak}': {weak_strength['level']} ({weak_strength['score']}/100)")
    print(f"Feedback: {', '.join(weak_strength['feedback'])}")
