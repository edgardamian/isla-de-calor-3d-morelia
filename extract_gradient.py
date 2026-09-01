from PIL import Image
import numpy as np

img = Image.open('extracted_img_0_IMAGEN_TERMICA_OPTIMIZADA.jpg').convert('RGB')
arr = np.array(img)
pixels = arr.reshape(-1, 3)

# Filter out black borders / nodata if any
valid_mask = ~((pixels[:,0] < 5) & (pixels[:,1] < 5) & (pixels[:,2] < 5))
valid_pixels = pixels[valid_mask]

# Let's see the color histogram in RGB
print("Total valid pixels:", len(valid_pixels))

# Sample 10 intervals from the actual image
# Sort by hue/chroma/luminance
# The image uses a rainbow/spectral or Blue-Cyan-Green-Yellow-White palette
# Let's print 10 evenly spaced representative colors:
# In thermal maps, value is typically encoded by color.
# Let's inspect along rows or across the histogram:
r = valid_pixels[:, 0].astype(float)
g = valid_pixels[:, 1].astype(float)
b = valid_pixels[:, 2].astype(float)

# Sort by (R + G*0.5 - B) which captures the Blue -> Cyan -> Green -> Yellow -> Red/White progression
score = (r*1.5 + g*1.0 - b*1.2)
sort_idx = np.argsort(score)

print("\nExact Progression of Colors in Thermal Image:")
step = len(sort_idx) // 10
sampled_colors = []
for i in range(10):
    idx = sort_idx[min(len(sort_idx)-1, i * step + step // 2)]
    rgb = valid_pixels[idx]
    hex_code = f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    sampled_colors.append(hex_code)
    print(f"Step {i+1:2d} ({(17.9 + i*(45.3-17.9)/9):.1f}°C): RGB({rgb[0]:3d}, {rgb[1]:3d}, {rgb[2]:3d}) -> {hex_code}")

print("\nCSS Gradient String:")
stops = []
for i, h in enumerate(sampled_colors):
    pct = round(i * (100 / (len(sampled_colors) - 1)))
    stops.append(f"{h} {pct}%")
print("linear-gradient(to right, " + ", ".join(stops) + ")")
