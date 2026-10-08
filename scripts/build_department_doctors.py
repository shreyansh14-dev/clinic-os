import os
import json
import urllib.request
import shutil
from PIL import Image

with open('scripts/doctors_data.json', 'r') as f:
    wiki_data = json.load(f)

os.makedirs('public/images/doctors', exist_ok=True)

# Function to download and center-crop to square
def save_square_image(url, target_path):
    temp_path = target_path + '.tmp'
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'ClinicOS/2.0 (contact: clinic-app@example.com)'}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp, open(temp_path, 'wb') as f:
            f.write(resp.read())
        
        with Image.open(temp_path) as img:
            img = img.convert('RGB')
            w, h = img.size
            dim = min(w, h)
            left = (w - dim) // 2
            top = max(0, int(h * 0.05)) if h > w else 0
            if top + dim > h:
                top = h - dim
            cropped = img.crop((left, top, left + dim, top + dim))
            resized = cropped.resize((600, 600), Image.Resampling.LANCZOS)
            resized.save(target_path, 'JPEG', quality=92)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"SUCCESS: {target_path}")
        return True
    except Exception as e:
        print(f"ERROR downloading {url} to {target_path}: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return False

# Categories to download from Wikipedia
wiki_categories = {
    'Cardiologists': 'cardio',
    'Neurologists': 'neuro',
    'Gynecologists': 'gyn',
    'Pediatricians': 'pedia',
    'Psychiatrists': 'psych',
    'Eye Specialists': 'eye',
    'Diabetologists': 'diab'
}

doctor_registry = {}

for cat_name, prefix in wiki_categories.items():
    docs = wiki_data.get(cat_name, [])
    doctor_registry[cat_name] = []
    index = 1
    for d in docs:
        if index > 4:
            break
        # Skip names with "Award" or non-portrait text if possible
        if 'Award' in d['name'] or 'Stamp' in d['url']:
            continue
        filename = f"{prefix}_{index}.jpg"
        target_path = os.path.join('public', 'images', 'doctors', filename)
        
        success = False
        if os.path.exists(target_path) and os.path.getsize(target_path) > 5000:
            success = True
        else:
            success = save_square_image(d['url'], target_path)
        
        if success:
            doctor_registry[cat_name].append({
                'name': f"Dr. {d['name'].replace(' (ophthalmologist)', '').replace(' (doctor)', '').replace(' (psychiatrist)', '').replace(' (paediatrician)', '')}",
                'image': f"/images/doctors/{filename}"
            })
            index += 1

print("\nDownloaded Wiki doctors count:")
for cat, docs in doctor_registry.items():
    print(f"  {cat}: {len(docs)} doctors")
