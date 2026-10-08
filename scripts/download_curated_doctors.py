import os
import time
import urllib.request
from PIL import Image

os.makedirs('public/images/doctors', exist_ok=True)

curated = [
    # Cardiologists
    ('cardio_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Dr._Praveen_Chandra.jpg'),
    ('cardio_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Shirish_Hiremath_Cardiologist.jpg'),
    ('cardio_3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/9/96/K_Srinath_Reddy.jpg'),
    ('cardio_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Prathap_C._Reddy_%281%29.jpg'),

    # Neurologists
    ('neuro_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Bindu_Menon.jpg'),
    ('neuro_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Photo_r_k_dhamija.jpg'),
    ('neuro_3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dr._Basant_Kumar_Misra.jpg'),
    ('neuro_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Achal_Kumar_Srivastava.jpg'),

    # Gynecologists
    ('gyn_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/52/Zulekha_Daud.jpg'),
    ('gyn_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/9/99/JaideepMalhotraProfile.jpg'),
    ('gyn_3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/4/40/HrishikeshPai.jpg'),
    ('gyn_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Dr_Nandita_Palshetkar.jpg'),

    # Pediatricians
    ('pedia_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Dr._Sanjeev_Bagai.jpg'),
    ('pedia_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/c0/KiranMartin.jpg'),
    ('pedia_3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Raeesh_Maniar.jpg'),
    ('pedia_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/RMehta_OBE.jpg'),

    # Psychiatrists
    ('psych_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Mohan_Agashe_O1.jpg'),
    ('psych_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Thara_Rangaswamy.jpg'),
    ('psych_3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/2/25/Vikram_Patel_at_The_Asian_Awards.jpg'),
    ('psych_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Dr_Vinay_Kumar.jpg'),

    # Eye Specialists
    ('eye_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Dr._Vikas_Mahatme.jpg'),
    ('eye_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Dr_Sujatha_Mohan_%28cropped%29.jpg'),
    ('eye_3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Atul_Kumar_MD_cropped.jpg'),
    ('eye_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Dr._Anand_Rai.jpg'),

    # Diabetologists
    ('diab_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/1/17/Shashank-Joshi.jpg'),
    ('diab_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Ambrish_Mittal_%28cropped%29.jpg'),
    ('diab_3.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/b6/DrVMohan.jpg'),
    ('diab_4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/3/34/Vijay-Viswanathan.jpg'),

    # ENT Specialists
    ('ent_1.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Dr.Anita_Bhandari.jpg'),
    ('ent_2.jpg', 'https://upload.wikimedia.org/wikipedia/commons/4/41/Dr._Santosh_Kumar_Kacker_%28cropped%29.jpg'),
]

def download_and_crop(filename, url):
    dest_path = os.path.join('public', 'images', 'doctors', filename)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 5000:
        print(f"ALREADY EXISTS: {filename}")
        return True

    temp_path = dest_path + '.tmp'
    # Use standard browser User-Agent with contact info per Wikimedia policy
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ClinicOS/2.0 (contact: clinic-os-app@example.com)'}
    )
    for attempt in range(3):
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
                resized.save(dest_path, 'JPEG', quality=90)
            
            if os.path.exists(temp_path):
                os.remove(temp_path)
            print(f"SUCCESS: Saved {filename}")
            return True
        except Exception as e:
            print(f"Attempt {attempt+1} failed for {filename}: {e}")
            if os.path.exists(temp_path):
                os.remove(temp_path)
            time.sleep(2.5)
    return False

for filename, url in curated:
    download_and_crop(filename, url)
    time.sleep(1.8)

print("Done downloading all curated doctor images!")
