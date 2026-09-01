import sys
import os

tif_path = r"imagen_termica_sig/LST_Celsius_Morelia_20251019_FINAL.tif"

try:
    from PIL import Image
    import numpy as np

    img = Image.open(tif_path)
    print("Format:", img.format)
    print("Size:", img.size)
    print("Mode:", img.mode)
    print("Info keys:", list(img.info.keys()))

    arr = np.array(img)
    print("Array shape:", arr.shape)
    print("Array dtype:", arr.dtype)

    # Filter out potential NoData values (like -9999, nan, inf, or extreme negatives)
    valid = arr[np.isfinite(arr)]
    valid = valid[valid > -50]
    valid = valid[valid < 100]

    if len(valid) > 0:
        print("\n=== TERRESTRIAL SURFACE TEMPERATURE (LST) STATS ===")
        print(f"Min Temperature:   {np.min(valid):.2f} °C")
        print(f"Max Temperature:   {np.max(valid):.2f} °C")
        print(f"Mean Temperature:  {np.mean(valid):.2f} °C")
        print(f"Median Temperature:{np.median(valid):.2f} °C")
        print(f"Std Deviation:     {np.std(valid):.2f} °C")
        print(f"Percentile 2%:     {np.percentile(valid, 2):.2f} °C")
        print(f"Percentile 5%:     {np.percentile(valid, 5):.2f} °C")
        print(f"Percentile 25%:    {np.percentile(valid, 25):.2f} °C")
        print(f"Percentile 50%:    {np.percentile(valid, 50):.2f} °C")
        print(f"Percentile 75%:    {np.percentile(valid, 75):.2f} °C")
        print(f"Percentile 95%:    {np.percentile(valid, 95):.2f} °C")
        print(f"Percentile 98%:    {np.percentile(valid, 98):.2f} °C")
        print(f"Total valid pixels:{len(valid):,}")
    else:
        print("No valid pixels found or values are formatted differently")

except Exception as e:
    print("Error with PIL/numpy:", e)
    # Fallback to rasterio / tifffile if available
    try:
        import rasterio
        with rasterio.open(tif_path) as src:
            print("Rasterio bounds:", src.bounds)
            print("Rasterio crs:", src.crs)
            print("Rasterio nodata:", src.nodata)
            data = src.read(1)
            valid = data[data != src.nodata]
            valid = valid[np.isfinite(valid)]
            print(f"Min: {np.min(valid):.2f}, Max: {np.max(valid):.2f}, Mean: {np.mean(valid):.2f}")
    except Exception as e2:
        print("Rasterio error:", e2)
