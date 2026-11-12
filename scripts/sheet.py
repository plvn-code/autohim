"""Contact sheet: sheet.py out.jpg cols file1 file2 …"""
import sys
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
S = 200
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * S, rows * (S + 16)), (40, 44, 60))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGBA', im.size, (12, 20, 40, 255)); bg.alpha_composite(im); im = bg
    im = im.convert('RGB'); im.thumbnail((S - 6, S - 6))
    x, y = (i % cols) * S, (i // cols) * (S + 16)
    sheet.paste(im, (x + (S - im.width) // 2, y + (S - im.height) // 2))
    d.text((x + 4, y + S), f.split('/')[-1][:30], fill=(220, 220, 220))
sheet.save(out, quality=82)
