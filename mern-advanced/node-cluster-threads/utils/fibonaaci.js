export default function fibonacci(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError("fibonacci(n) expects an integer");
  }
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
