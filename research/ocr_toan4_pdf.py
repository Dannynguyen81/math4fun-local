"""Create page-labelled OCR text from the supplied scanned Grade 4 mathematics PDF."""
from pathlib import Path
import shutil
import subprocess
import sys


def main() -> None:
    pdf = Path("/home/ubuntu/upload/pasted_file_wGv7L5_Toan_4_Tap_1_Archimede_2024_2025.pdf")
    output_dir = Path("/home/ubuntu/math4fun-local/research/toan4_ocr_pages")
    output_text = Path("/home/ubuntu/math4fun-local/research/toan4_archimede_ocr.txt")
    output_dir.mkdir(parents=True, exist_ok=True)

    if not pdf.exists():
        raise FileNotFoundError(pdf)

    for old_file in output_dir.glob("page-*.png"):
        old_file.unlink()

    subprocess.run(
        ["pdftoppm", "-r", "220", "-png", str(pdf), str(output_dir / "page")],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    pages = sorted(output_dir.glob("page-*.png"))
    chunks: list[str] = []
    for page in pages:
        page_number = int(page.stem.rsplit("-", 1)[1])
        result = subprocess.run(
            ["tesseract", str(page), "stdout", "-l", "vie+eng", "--psm", "6"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        chunks.append(f"\n\n===== PDF PAGE {page_number} =====\n{result.stdout.strip()}\n")

    output_text.write_text("".join(chunks), encoding="utf-8")
    print(f"OCR completed: {len(pages)} pages -> {output_text}")


if __name__ == "__main__":
    main()
