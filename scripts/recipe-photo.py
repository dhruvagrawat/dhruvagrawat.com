#!/usr/bin/env python3
"""
Make a recipe cover photo:  python3 scripts/recipe-photo.py <photo> <recipe-slug>

Crops to 4:3 around the centre, resizes to 1200x900 and saves
public/recipe-photos/<slug>.webp (~100 KB). Then set in the recipe:
    coverImage: "/recipe-photos/<slug>.webp",
and, if the photo isn't yours, coverCredit: { author, license, url }.

Needs: pip install pillow   (and pillow-heif for iPhone HEIC photos)
"""
import os
import sys

from PIL import Image, ImageOps

try:
    import pillow_heif

    pillow_heif.register_heif_opener()
except ImportError:
    pass

if len(sys.argv) != 3:
    sys.exit(__doc__)

src, slug = sys.argv[1], sys.argv[2]
out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "recipe-photos")
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, f"{slug}.webp")

im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
im = ImageOps.fit(im, (1200, 900), Image.Resampling.LANCZOS, centering=(0.5, 0.5))
im.save(out, "WEBP", quality=78, method=6)
print(f"{out}  {os.path.getsize(out) // 1024} KB")
