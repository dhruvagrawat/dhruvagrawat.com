#!/usr/bin/env python3
"""
Make web-sized copies of everything in public/photography/.
  thumb/<name>.webp  – 640px, for the grid
  web/<name>.webp    – 1600px, for the lightbox
Run after adding photos:  python3 scripts/optimize-photos.py   (needs: pip install pillow)
Only new or changed photos are processed.
"""
import os
from PIL import Image, ImageOps

SRC = os.path.join(os.path.dirname(__file__), "..", "public", "photography")
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp", ".tiff"}
SIZES = {"thumb": 640, "web": 1600}

for d in SIZES:
    os.makedirs(os.path.join(SRC, d), exist_ok=True)

for f in sorted(os.listdir(SRC)):
    p = os.path.join(SRC, f)
    name, ext = os.path.splitext(f)
    if not os.path.isfile(p) or ext.lower() not in EXTS:
        continue
    for d, size in SIZES.items():
        out = os.path.join(SRC, d, name + ".webp")
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(p):
            continue
        im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        im.thumbnail((size, size * 2))
        im.save(out, "WEBP", quality=78 if d == "web" else 72, method=6)
    print("ok", f)
