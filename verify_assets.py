import glob

def check_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    print(f"Validated {path}: {len(text)} bytes, {text.count(chr(10))} lines")

for f in sorted(glob.glob("js/*.js") + glob.glob("css/*.css") + ["index.html"]):
    check_file(f)
print("All files present and readable!")
