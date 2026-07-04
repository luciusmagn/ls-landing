# Lambda Symbolics Landing

Static landing site for Lambda Symbolics OÜ, set in the Programmable Paper
design language: Times New Roman, black ink on off-white paper, no flat
gray, no JavaScript. The full design specification lives in
`DESIGN.md` in the Hiisi repository.

## Stack

- Hand-written HTML and one stylesheet (`paper.css`)
- No JavaScript, no build step
- Local self-hosted "Times New Roman" fonts included in `fonts/`
- Vercel static hosting (`vercel.json`)

## Files

- `index.html`: company page
- `rust-course.html`: Rust course page
- `404.html`: not-found page
- `paper.css`: Programmable Paper stylesheet
- `tools/make-og.py`: regenerates `og.png` (Pillow + the repo Times New Roman faces)

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

Point Vercel at this repository/submodule and deploy as a static site.
