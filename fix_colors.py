import os

BASE = r'C:\Users\Owner\.gemini\antigravity-ide\scratch\clinic-os\src\components\patient'

files = [
    'MedicalRecords.jsx',
    'DiagnosticTests.jsx',
    'InsuranceClaims.jsx',
    'HealthTracker.jsx',
    'MyMeds.jsx',
    'VaccineTracker.jsx',
    'AISymptomAssistant.jsx',
]

for fname in files:
    path = os.path.join(BASE, fname)
    with open(path, encoding='utf-8') as f:
        txt = f.read()
    # Replace white text (inline style) with dark readable color
    original = txt
    txt = txt.replace("color: '#fff'", "color: '#0f172a'")
    txt = txt.replace('color: "#fff"', 'color: "#0f172a"')
    if txt != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(txt)
        print(f'Fixed: {fname}')
    else:
        print(f'No change: {fname}')

print('All done.')
