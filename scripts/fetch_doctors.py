import urllib.request
import json
import urllib.parse

subcats = [
    ('Cardiologists', 'Category:Indian_cardiologists'),
    ('Neurologists', 'Category:Indian_neurologists'),
    ('Orthopedists', 'Category:Indian_orthopedic_surgeons'),
    ('Gynecologists', 'Category:Indian_gynaecologists'),
    ('Dermatologists', 'Category:Indian_dermatologists'),
    ('Pediatricians', 'Category:Indian_paediatricians'),
    ('Psychiatrists', 'Category:Indian_psychiatrists'),
    ('Eye Specialists', 'Category:Indian_ophthalmologists'),
    ('ENT Specialists', 'Category:Indian_otolaryngologists'),
    ('Diabetologists', 'Category:Indian_diabetologists')
]

categorized = {}
for label, cat in subcats:
    url = f"https://en.wikipedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat)}&gcmlimit=40&prop=pageimages&pithumbsize=600&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'ClinicOS/1.0'})
    categorized[label] = []
    try:
        data = json.loads(urllib.request.urlopen(req).read())
        pages = data.get('query', {}).get('pages', {})
        for p in pages.values():
            if 'thumbnail' in p:
                categorized[label].append({
                    'name': p['title'],
                    'url': p['thumbnail']['source']
                })
    except Exception as e:
        print(f"Error on {label}: {e}")

with open('scripts/doctors_data.json', 'w') as f:
    json.dump(categorized, f, indent=2)

for label, docs in categorized.items():
    print(f"{label}: {len(docs)} doctors with images")
