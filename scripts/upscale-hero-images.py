"""Regenerate the five hero images: PYTHONPATH=<Pillow install> python scripts/upscale-hero-images.py.
Original photographs are preserved. Outputs have at least a 3840px long edge. Lanczos enlarges pixels; it does not restore lost detail.
"""
import json
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/images/hero'
DEST.mkdir(parents=True, exist_ok=True)
manifest = {}
for slide in json.loads((ROOT / 'src/data/hero-slides.json').read_text()):
    source = ROOT / 'public' / slide['image'].lstrip('/')
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        original_size = image.size
        scale = max(2, 3840 / max(image.size))
        enlarged = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
        enlarged = enlarged.filter(ImageFilter.UnsharpMask(radius=1, percent=60, threshold=3))
        widths = sorted({min(640, enlarged.width), min(1280, enlarged.width), min(1920, enlarged.width), enlarged.width})
        variants = []
        for width in widths:
            height = round(enlarged.height * width / enlarged.width)
            output = enlarged if width == enlarged.width else enlarged.resize((width, height), Image.Resampling.LANCZOS)
            name = f"{slide['id']}-{width}.webp"
            output.save(DEST / name, 'WEBP', quality=95 if width == enlarged.width else 90, method=6)
            with Image.open(DEST / name) as check:
                assert check.size == (width, height) and check.format == 'WEBP'
            variants.append({'src': f'/images/hero/{name}', 'width': width})
        manifest[slide['image']] = {
            'src': next(item['src'] for item in variants if item['width'] == min(1280, enlarged.width)),
            'srcSet': ', '.join(f"{item['src']} {item['width']}w" for item in variants),
            'originalWidth': original_size[0], 'originalHeight': original_size[1],
            'width': enlarged.width, 'height': enlarged.height,
        }
        print(f"{slide['id']}: {original_size[0]}x{original_size[1]} -> {enlarged.width}x{enlarged.height}")
(ROOT / 'src/data/hero-images.json').write_text(json.dumps(manifest, indent=2) + '\n')
