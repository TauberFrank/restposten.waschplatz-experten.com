from PIL import Image
from pathlib import Path

img_dir = Path('./img')
total = 0

for webp in sorted(img_dir.rglob('*.webp')):
    jpg = webp.with_suffix('.jpg')
    if jpg.exists():
        print(f'SKIP  {jpg}')
        continue
    img = Image.open(webp).convert('RGB')
    img.save(jpg, 'JPEG', quality=88, optimize=True, progressive=True)
    print(f'OK    {jpg}')
    total += 1

print(f'\nFertig: {total} JPG-Dateien erstellt.')
