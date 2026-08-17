"""Calculate and assert answers for the Math4Fun questions transcribed from PDF pages 38–39."""
from __future__ import annotations

import json
from pathlib import Path


def arithmetic_term(first: int, difference: int, index: int) -> int:
    return first + (index - 1) * difference


def arithmetic_sum(first: int, last: int, count: int) -> int:
    return (first + last) * count // 2


def main() -> None:
    answers = {
        "B80a": ((2024 - 20) // 2) + 1,
        "B80b": arithmetic_term(2024, -2, 258),
        "B81a": arithmetic_term(0, 3, 75),
        "B82a": arithmetic_term(11, 5, 85),
        "B82b": ((951 - 11) // 5) + 1,
        "B83a_count": ((199 - 1) // 2) + 1,
        "B83a_term50": arithmetic_term(1, 2, 50),
        "B83a_sum": arithmetic_sum(1, 199, 100),
        "B86a": arithmetic_sum(12, 21, 10),
        "B86b": arithmetic_sum(60, 82, 12),
        "B86c": arithmetic_sum(21, 51, 16),
        "B86d": arithmetic_sum(13, 93, 9),
        "B87b": 1 + sum(range(1, 10)),
    }
    expected = {
        "B80a": 1003,
        "B80b": 1510,
        "B81a": 222,
        "B82a": 431,
        "B82b": 189,
        "B83a_count": 100,
        "B83a_term50": 99,
        "B83a_sum": 10000,
        "B86a": 165,
        "B86b": 852,
        "B86c": 576,
        "B86d": 477,
        "B87b": 46,
    }
    assert answers == expected, f"Verification mismatch: {answers}"
    output = Path("/home/ubuntu/math4fun-local/research/question_bank_answers_verified.json")
    output.write_text(json.dumps(answers, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(answers, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
