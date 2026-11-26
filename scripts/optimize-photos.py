#!/usr/bin/env python3
"""
Turn the raw camera photos into small web copies for the site.

  photos-raw/<name>.jpg|heic|png...   your originals (git-ignored, never deployed)
        │
        ▼
  public/photography/thumb/<name>.webp   640px  – the grid          (~30 KB)
  public/photography/web/<name>.webp    1600px  – lightbox / posts  (~150 KB)
  public/photography/full/<name>.webp   2560px  – "Download" button (~500 KB)
  content/photos.json                   names + sizes, read by the gallery

Usage:
  pip install pillow pillow-heif
  python3 scripts/optimize-photos.py

Only new or changed photos are processed. To remove a photo from the site, delete
it from photos-raw/ and run the script again – its web copies are cleaned up.

Why: raw phone photos are 2–15 MB each. Putting them in public/ makes every
deploy huge and every "full res" click burns Vercel bandwidth. Nothing in
photos-raw/ is ever committed or uploaded.
"""
import json
import os
import sys

from PIL import Image, ImageOps

try:  # iPhone / Samsung HEIC support
    import pillow_heif

    pillow_heif.register_heif_opener()
    HEIC = True
except ImportError:
    HEIC = False

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW = os.path.join(ROOT, "photos-raw")
OUT = os.path.join(ROOT, "public", "photography")
MANIFEST = os.path.join(ROOT, "content", "photos.json")

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp", ".tiff", ".heic", ".heif"}
# name: (longest side in px, webp quality)
SIZES = {"thumb": (640, 70), "web": (1600, 78), "full": (2560, 82)}


def main() -> None:
    if not os.path.isdir(RAW):
        sys.exit(f"Put your original photos in {RAW}/ and run again.")
    for d in SIZES:
        os.makedirs(os.path.join(OUT, d), exist_ok=True)

    old = {}
    if os.path.exists(MANIFEST):
        old = {p["name"]: p for p in json.load(open(MANIFEST))}

    photos = []
    for f in sorted(os.listdir(RAW)):
        src = os.path.join(RAW, f)
        name, ext = os.path.splitext(f)
        if not os.path.isfile(src) or ext.lower() not in EXTS:
            continue
        if ext.lower() in {".heic", ".heif"} and not HEIC:
            print(f"skip {f}: pip install pillow-heif to convert HEIC")
            continue

        outs = {d: os.path.join(OUT, d, name + ".webp") for d in SIZES}
        fresh = all(os.path.exists(o) and os.path.getmtime(o) >= os.path.getmtime(src) for o in outs.values())
        if fresh and name in old:
            photos.append(old[name])
            continue

        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        for d, (size, q) in SIZES.items():
            copy = im.copy()
            # Grid thumbs are capped by width so tall photos stay sharp in narrow columns
            copy.thumbnail((size, size * 2) if d == "thumb" else (size, size))
            copy.save(outs[d], "WEBP", quality=q, method=6)
        w, h = Image.open(outs["web"]).size
        photos.append({"name": name, "width": w, "height": h})
        kb = os.path.getsize(src) // 1024
        print(f"ok   {f}  {kb} KB -> " + ", ".join(f"{d} {os.path.getsize(o) // 1024} KB" for d, o in outs.items()))

    # Remove web copies whose original was deleted
    keep = {p["name"] for p in photos}
    for d in SIZES:
        for f in os.listdir(os.path.join(OUT, d)):
            if os.path.splitext(f)[0] not in keep:
                os.remove(os.path.join(OUT, d, f))
                print(f"del  {d}/{f}")

    with open(MANIFEST, "w") as fh:
        json.dump(photos, fh, indent=1)
        fh.write("\n")
    print(f"{len(photos)} photos -> content/photos.json")


if __name__ == "__main__":
    main()
