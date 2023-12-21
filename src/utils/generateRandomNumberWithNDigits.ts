export function generateRandomNumberWithNDigits(n: number): number {
	if (n <= 0) {
		throw new Error('Number of digits must be positive');
	}

	const min = Math.pow(10, n - 1); // минимальное значение для n цифр
	const max = Math.pow(10, n) - 1; // максимальное значение для n цифр

	return Math.floor(Math.random() * (max - min + 1)) + min;
}
