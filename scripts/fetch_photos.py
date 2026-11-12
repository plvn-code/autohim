"""Download every product photo, the logo and the slider banners from the old ps.me shop into originals/. Usage: fetch_photos.py <project root>"""
import json, os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
root = sys.argv[1]
d = json.load(open(os.path.join(root, 'research/site.json')))['props']['pageProps']
out = os.path.join(root, 'originals'); os.makedirs(out + '/p', exist_ok=True); os.makedirs(out + '/brand', exist_ok=True)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
jobs = [(p['photo'], f"{out}/p/{p['pos_id']}{os.path.splitext(p['photo'])[1].lower()}") for p in d['products'] if p.get('photo')]
s = d['settings']
jobs += [(s['logo'], f'{out}/brand/logo.png'), (s['favicon'], f'{out}/brand/favicon.png')]
jobs += [(x['image'], f"{out}/brand/slide-{x['sort']}.png") for x in d['slider']]
def get(job):
    u, p = job
    if os.path.exists(p) and os.path.getsize(p) > 0: return 0
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=60) as r: b = r.read()
        open(p, 'wb').write(b); return 1
    except Exception as e:
        print('FAIL', u, e); return 0
with ThreadPoolExecutor(12) as ex: n = sum(ex.map(get, jobs))
print('downloaded', n, 'of', len(jobs))
