#!/usr/bin/env python3
"""
Simple image compression script for wedding gallery
Compresses images in-place without creating backups
"""

import os
import sys
from pathlib import Path
from PIL import Image
import tempfile

def compress_image(image_path, max_width=1920, max_height=1080, quality=85):
    """
    Compress a single image in-place
    """
    try:
        original_size = os.path.getsize(image_path) / 1024 / 1024  # MB

        with Image.open(image_path) as img:
            # Convert RGBA to RGB if needed
            if img.mode in ('RGBA', 'LA', 'P'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = rgb_img

            # Calculate new dimensions while maintaining aspect ratio
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

            # Save to temporary file first
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
                img.save(temp_file.name, 'JPEG', quality=quality, optimize=True)
                temp_path = temp_file.name

        # Replace original with compressed version
        os.replace(temp_path, image_path)

        new_size = os.path.getsize(image_path) / 1024 / 1024  # MB
        reduction = (1 - new_size/original_size) * 100 if original_size > 0 else 0

        return {
            'success': True,
            'original_size': original_size,
            'new_size': new_size,
            'reduction': reduction
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    # Gallery directory
    gallery_dir = Path('gallery')

    if not gallery_dir.exists():
        print("Gallery directory not found!")
        return

    # Get all image files
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    image_files = [f for f in gallery_dir.iterdir()
                   if f.is_file() and f.suffix.lower() in image_extensions]

    if not image_files:
        print("No images found in gallery directory!")
        return

    print(f"Found {len(image_files)} images to compress\n")

    # Process each image
    total_original = 0
    total_compressed = 0
    successful = 0
    failed = 0

    for i, img_file in enumerate(image_files, 1):
        print(f"Processing {i}/{len(image_files)}: {img_file.name}")

        result = compress_image(img_file)

        if result['success']:
            successful += 1
            total_original += result['original_size']
            total_compressed += result['new_size']
            print(f"  OK Compressed: {result['original_size']:.1f}MB -> {result['new_size']:.1f}MB (-{result['reduction']:.1f}%)")
        else:
            failed += 1
            print(f"  ERROR Failed: {result['error']}")

        print()

    # Summary
    print("="*50)
    print("COMPRESSION COMPLETE")
    print("="*50)
    print(f"Successfully compressed: {successful}/{len(image_files)} images")
    if failed > 0:
        print(f"Failed: {failed} images")
    print(f"Total size reduction: {total_original:.1f}MB → {total_compressed:.1f}MB")
    if total_original > 0:
        print(f"Overall compression: {(1 - total_compressed/total_original) * 100:.1f}%")

if __name__ == "__main__":
    print("Simple Gallery Image Compression Tool")
    print("="*50)

    # Check if Pillow is installed
    try:
        from PIL import Image
    except ImportError:
        print("Error: Pillow library not installed!")
        print("Please install it using: pip install Pillow")
        sys.exit(1)

    # Auto-run compression
    print("\nCompressing all images in the 'gallery' folder IN-PLACE...")
    print("No backups will be created.")
    main()