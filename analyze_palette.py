import sys
from PIL import Image
import numpy as np

img = Image.open('extracted_img_0_IMAGEN_TERMICA_OPTIMIZADA.jpg').convert('RGB')
arr = np.array(img)

print("Image size:", img.size)

# Sample pixels and sort by perceived luminance / hue
pixels = arr.reshape(-1, 3)

# Find unique colors or quantize to palette
img_quantized = img.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
palette = img_quantized.getpalette()[:16*3]

print("\n=== DOMINANT PALETTE IN IMAGEN_TERMICA_OPTIMIZADA ===")
colors = []
for i in range(16):
    r, g, b = palette[i*3 : i*3+3]
    # convert to hex
    hex_code = f"#{r:02x}{g:02x}{b:02x}"
    lum = 0.299*r + 0.587*g + 0.114*b
    colors.append((r, g, b, hex_code, lum))

colors.sort(key=lambda x: x[4]) # sort by luminance / temperature progression

for r, g, b, hex_code, lum in colors:
    print(f"RGB: ({r:3d}, {g:3d}, {b:3d}) | HEX: {hex_code} | Lum: {lum:.1f}")

# Also analyze the color gradient along a transect or across the distribution
# Let's see the color distribution from min to max:
# Find coldest (usually blue/dark/green/purple) to hottest (usually yellow/red/white)
print("\nColor samples across intensity percentiles:")
lums = 0.299*pixels[:,0] + 0.587*pixels[:,1] + 0.114*pixels[:,2]
idx_sorted = np.argsort(lums)

for pct in [1, 10, 25, 50, 75, 90, 99]:
    idx = idx_sorted[int(len(idx_sorted) * (pct / 100))]
    r, g, b = pixels[idx]
    hex_code = f"#{r:02x}{g:02x}{b:02x}"
    print(f"P{pct:02d}%: RGB({r:3d}, {g:3d}, {b:3d}) -> {hex_code}")
