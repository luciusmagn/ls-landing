#!/usr/bin/env python3
"""Regenerate og.png for lambda-symbolics.com.

Deterministic, typographic cover per the Programmable Paper design
language: black ink on one gentle off-white substrate, the repository's
own Times New Roman faces, a masthead-weight (regular) title, one rule,
an italic metadata line. No photography, no gradients, no gray design
values (glyph antialiasing is the permitted exception).

Usage: python3 tools/make-og.py  (from the repository root)
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

INK = (0, 0, 0)
PAPER = (255, 254, 250)  # #FFFEFA

WIDTH, HEIGHT = 1200, 630
MARGIN = 90

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "fonts"

REGULAR_CANDIDATES = [
    str(FONTS / "times-new-roman-regular.ttf"),
    "/usr/share/fonts/liberation/LiberationSerif-Regular.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
    "/usr/share/fonts/gsfonts/NimbusRoman-Regular.otf",
]
ITALIC_CANDIDATES = [
    str(FONTS / "times-new-roman-italic.ttf"),
    "/usr/share/fonts/liberation/LiberationSerif-Italic.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf",
    "/usr/share/fonts/gsfonts/NimbusRoman-Italic.otf",
]


def load_font(candidates, size):
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    raise SystemExit("No Times-compatible serif font found.")


def main():
    image = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    draw = ImageDraw.Draw(image)

    title_font = load_font(REGULAR_CANDIDATES, 104)
    lede_font = load_font(REGULAR_CANDIDATES, 44)
    meta_font = load_font(ITALIC_CANDIDATES, 30)

    draw.text((MARGIN, 150), "Lambda Symbolics", font=title_font, fill=INK)

    rule_y = 310
    draw.rectangle([MARGIN, rule_y, WIDTH - MARGIN, rule_y + 3], fill=INK)

    draw.text((MARGIN, 345), "Education and computer science.", font=lede_font, fill=INK)

    meta = "lambda-symbolics.com · Hiisi · ClankerMails · Per aspera ad astra"
    draw.text((MARGIN, HEIGHT - MARGIN - 30), meta, font=meta_font, fill=INK)

    out = ROOT / "og.png"
    image.save(out, "PNG")
    print(f"wrote {out} ({WIDTH}x{HEIGHT})")


if __name__ == "__main__":
    main()
