# Lambda Symbolics Landing

Static landing site for Lambda Symbolics OÜ, set in the Programmable Paper
design language: Times New Roman, black ink on off-white paper, no flat
gray, no JavaScript, no webfonts. The full design specification lives in
`DESIGN.md` in the Hiisi repository.

## Stack

- Hand-written HTML and one stylesheet (`paper.css`)
- No JavaScript, no webfonts, no build step
- Vercel static hosting (`vercel.json`)

## Files

- `index.html`: company page
- `rust-course.html`: Rust course page
- `404.html`: not-found page
- `paper.css`: Programmable Paper stylesheet
- `tools/make-og.py`: regenerates `og.png` (Pillow + Liberation Serif)

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

Point Vercel at this repository/submodule and deploy as a static site.
