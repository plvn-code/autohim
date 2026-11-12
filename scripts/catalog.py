"""Build src/data/catalog.json and public/images/p/* from the old ps.me shop data.

Usage: research/.venv/bin/python -I scripts/catalog.py
Input:  research/site.json (the __NEXT_DATA__ of autohim.ps.me, which carries the whole catalogue)
        originals/p/<pos_id>.<ext> (scripts/fetch_photos.py)
Output: src/data/catalog.json, public/images/p/<pos_id>.webp (800) + <pos_id>s.webp (360).
Image files are cached: delete one to rebuild it.
"""
import html, json, os, re, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cutout import cutout  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = json.load(open(os.path.join(ROOT, 'research/site.json')))['props']['pageProps']
IMG = os.path.join(ROOT, 'public/images/p'); os.makedirs(IMG, exist_ok=True)

# ---------- sections: old top-level categories, renamed; brand categories become brands ----------
SECTIONS = {  # old slug → (new slug, name, short description)
    'ximiya-autohim': ('khimiia-autohim', 'Хімія AUTOHIM', 'Власна лінійка: очищувачі, віск і догляд за салоном'),
    'dlya-kuzova': ('dlya-kuzova', 'Для кузова', 'Шампуні, поліроль, воски, очищувачі дисків і фарба'),
    'dlya-salonu': ('dlya-salonu', 'Для салону', 'Очищувачі, догляд за шкірою й пластиком, ароматизатори'),
    'dlya-vikon': ('dlya-skla', 'Для скла', 'Антидощ, очищувачі та абразиви для скла'),
    'texnicni-ridini': ('tekhnichni-ridyny', 'Технічні рідини', 'Антифриз і гальмівні рідини'),
    'olivi-motorni': ('olyvy', 'Моторні оливи', 'MOTUL, WOLF та інші оливи для двигуна'),
    'avtopriladdya': ('avtopryladdia', 'Автоприладдя', 'Мікрофібри, аплікатори, лампи, зарядки, тримачі'),
    'organaizeri': ('orhanaizery', 'Органайзери', 'Органайзери в багажник і салон'),
    'shhitki-skloocisnika': ('shchitky-sklooch', 'Щітки склоочисника', 'Каркасні та безкаркасні двірники'),
    'zimovi-poziciyi': ('zyma', 'Зимові позиції', 'Розморожувачі, антигель, зимовий омивач'),
    'dlya-domu': ('dlya-domu', 'Для дому', 'Засоби для чистоти вдома'),
    'sertifikati-podarunkovi': ('sertyfikaty', 'Подарункові сертифікати', 'Подарунок для автомобіліста'),
}
BRAND_CATS = {'geyon': 'gyeon', 'koch': 'koch', 'wolf': 'wolf', 'soft99': 'soft99', 'rituals': 'rituals', 'sonax': 'sonax'}
SUB_NAMES = {
    'antigravii-baranik': 'Антигравій', 'farba-avtomobilna': 'Фарба автомобільна', 'germetiki': 'Герметики',
    'farba-dlya-tonuvannya-far': 'Тонування фар', 'farba-dlya-suportiv': 'Фарба для супортів', 'nazdacnii-papir': 'Наждачний папір',
    'ridka-guma': 'Рідка гума', 'prisadki': 'Присадки', 'zimovi-omivaci': 'Зимові омивачі', 'litni-omivaci': 'Літні омивачі',
    'doglyad-diski-i-rezina': 'Догляд за дисками й гумою', 'ocishhuvaci-diskiv': 'Очищувачі дисків', 'corninnya-rezini': 'Чорніння гуми',
    'mastila': 'Мастила', 'ocishhuvaci': 'Очищувачі', 'sampuni': 'Шампуні', 'plastik': 'Для пластику', 'voski': 'Воски',
    'poliruvannya': 'Полірування', 'nakidki-dlya-sidin': 'Накидки для сидінь', 'aromatizatori': 'Ароматизатори', 'hurricane': 'Hurricane',
    'dlya-kondicionera': 'Для кондиціонера', 'dlya-skiri': 'Для шкіри', 'fabra-dlya-skiri': 'Фарба для шкіри',
    'ocishhuvaci-salonu': 'Очищувачі салону', 'polirol': 'Поліролі', 'ocishhuvaci-vikon': 'Очищувачі скла',
    'antidoshhi-i-abrazivi': 'Антидощ і абразиви', 'antifriz': 'Антифриз', 'galmivna-ridina': 'Гальмівні рідини',
    'zaryadni-pristroyi': 'Зарядні пристрої', 'avtomobilni-pilososi': 'Пилососи', 'puskovi-pristroyi-i-kabelya': 'Пускові пристрої',
    'videorejestratori-i-karti-pamyati': 'Відеореєстратори', 'klyuci-i-vikrutki-i-nabori': 'Домкрати й інструмент',
    'concezaxisni-storki': 'Сонцезахисні шторки', 'nomerni-ramki': 'Номерні рамки', 'stricka-malyarna': 'Малярна стрічка',
    'batareiki': 'Батарейки', 'kabeli-i-zaryadki': 'Кабелі й зарядки', 'fm-modulyatori': 'FM-модулятори',
    'trimaci-dlya-telefoniv': 'Тримачі для телефонів', 'kanistri': 'Каністри', 'zapobizniki': 'Запобіжники', 'xomuti': 'Хомути',
    'syaguvaci-vodi': 'Стягувачі води', 'lampocki': 'Лампочки', 'led': 'LED-лампи', 'kompresori': 'Компресори',
    'gubki-dlya-mittya': 'Губки для миття', 'shhitki-skrebki': 'Щітки-скребки', 'poliruvalni-krugi': 'Полірувальні круги',
    'mikrofibri': 'Мікрофібри', 'aplikatori-i-shhitki': 'Аплікатори', 'shhitocki': 'Щіточки', 'banki': 'Розпилювачі',
}

# ---------- brands: detected from the name, or from a brand category ----------
BRANDS = [  # (slug, display name, regex on the upper-cased name)
    ('gyeon', 'GYEON', r'^GY?EON|^GEYON'), ('koch', 'Koch-Chemie', r'^KOCH'), ('soft99', 'SOFT99', r'^SOFT ?99'),
    ('sonax', 'SONAX', r'^SONAX'), ('k2', 'K2', r'^[KК]2'), ('motul', 'MOTUL', r'^"?MOTUL'), ('wolf', 'WOLF', r'^WOLF'),
    ('rituals', 'RITUALS', r'^RITUALS'), ('autohim', 'AUTOHIM', r'^AUTOHIM'), ('turtle-wax', 'Turtle Wax', r'^TURTLE'),
    ('motip', 'MOTIP', r'^MOTIP'), ('molder', 'MÖLDER', r'^MOLDER'), ('hoco', 'HOCO', r'^HOCO'), ('brevia', 'BREVIA', r'^BREVIA'),
    ('elegant', 'ELEGANT', r'^ELEGANT'), ('vitol', 'VITOL', r'^VITOL'), ('polychrom', 'POLYCHROM', r'^POLYCHROM'),
    ('decker', 'DECKER', r'^DECKER'), ('atas', 'ATAS', r'^ATAS'), ('dr-marcus', 'Dr. Marcus', r'^DR\.? ?MARCUS'),
    ('maxshine', 'Maxshine', r'^MAXSHINE'), ('3m', '3M', r'^3M'), ('philips', 'PHILIPS', r'^PHILIPS'), ('hurricane', 'HURRICANE', r'^HURRICANE'),
    ('helpix', 'HELPIX', r'^HELPIX'), ('cardos', 'CARDOS', r'^CARDOS'), ('mirka', 'Mirka', r'^MIRKA'), ('fantastic', 'Fantastic Clean', r'^FANTASTI'),
    ('erla', 'ERLA', r'^ERLA'), ('wagen', 'WAGEN', r'^WAGEN'), ('videx', 'VIDEX', r'^VIDEX'), ('gerlax', 'GERLAX', r'^GERLAX'),
    ('kwazar', 'KWAZAR', r'^KWAZAR'), ('matador', 'MATADOR', r'^MATADOR'), ('nowax', 'NOWAX', r'^NOWAX'), ('carlife', 'CARLIFE', r'^CARLIFE'),
    ('belauto', 'БЕЛАВТО', r'^БЕЛАВТО|^BELAUTO'), ('drivex', 'DRIVEX', r'^DRIVEX'), ('masner', 'MASNER', r'^MASNER'), ('app', 'APP', r'^APP\b'),
    ('q1', 'Q1', r'^Q1\b'), ('bmw', 'BMW', r'^BMW'),
]
ANYWHERE = [('k2', r'\b[KК]2\b'), ('koch', r'\bKOCH\b'), ('sonax', r'\bSONAX\b'), ('motul', r'\bMOTUL\b'), ('turtle-wax', r'TURTLE WAX'), ('soft99', r'SOFT ?99')]
BRAND_FROM_CAT = {'gyeon': 'gyeon', 'koch': 'koch', 'wolf': 'wolf', 'soft99': 'soft99', 'rituals': 'rituals', 'sonax': 'sonax'}

TR = dict(zip('абвгґдеєжзиіїйклмнопрстуфхцчшщьюяё', ['a', 'b', 'v', 'h', 'g', 'd', 'e', 'ie', 'zh', 'z', 'y', 'i', 'i', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'kh', 'ts', 'ch', 'sh', 'shch', '', 'iu', 'ia', 'e']))


def slugify(s, n=64):
    s = ''.join(TR.get(ch, ch) for ch in s.lower().replace('²', '2'))
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:n].rstrip('-')


def clean_name(n):
    n = html.unescape(n).replace(' ', ' ')
    n = re.sub(r'^[КK]2(?=[А-ЯІЇЄA-Z])', 'K2 ', n)  # «K2Рушник»
    n = re.sub(r'^К2\b', 'K2', n)  # Cyrillic К
    n = re.sub(r'^CARLIFE(?=[А-ЯІЇЄ])', 'CARLIFE ', n)
    n = n.replace('GEYON', 'GYEON').replace('CОНЦЕ', 'СОНЦЕ')
    n = re.sub(r'([a-z])([А-ЯІЇЄ])', r'\1 \2', n)  # «Sport-freshОчищувач»
    n = re.sub(r'([а-яіїє])([A-Z])', r'\1 \2', n)  # «паливаTurbo»
    n = re.sub(r'Q2М', 'Q2M', n)
    n = re.sub(r'(\d) ?vл\b', r'\1 мл', n)
    n = re.sub(r'(\d) m$', r'\1 мл', n)
    n = re.sub(r'\s+', ' ', n).strip(' -–')
    n = re.sub(r'(\d)\s*ML\b', r'\1 мл', n)
    n = re.sub(r'тригер(?=\d)', 'тригер ', n)
    return n


GUESS = [  # brand-only categories (GYEON, KOCH, SOFT99…) → section by keywords in the name, first match wins
    ('avtopryladdia', ('аплікатор', 'applicator', 'тригер', 'пляшк', 'щітка', 'серветка', 'набір для мийки', 'sprayer', 'bucket', 'microfaser')),
    ('dlya-skla', ('скл', 'glaco', 'антидощ', 'rain drop', 'glass')),
    ('dlya-salonu', ('шкір', 'пластик', 'салон', 'текстил', 'алькантар', 'ароматизатор', 'запах', 'пляmo', 'плямовивідник', 'килимк', 'cockpit', 'top star', 'tierhaar', 'духи')),
]


def guess_section(name, brand):
    if brand == 'wolf': return 'olyvy', None
    if brand == 'rituals': return 'dlya-salonu', 'aromatizatori'
    low = name.lower()
    for sec, words in GUESS:
        if any(w in low for w in words): return sec, None
    return 'dlya-kuzova', None


def volume(n):
    m = re.search(r'(\d+(?:[.,]\d+)?)\s*(мл|ml|л|l|г|кг|шт)\b', n, re.I)
    if not m: return None
    u = {'ml': 'мл', 'l': 'л'}.get(m.group(2).lower(), m.group(2).lower())
    return f'{m.group(1).replace(".", ",")} {u}'


def clean_desc(h):
    """Old shop HTML → [[kind, text]] with kind p / li / h. Drops empty paragraphs and inline styling."""
    if not h: return []
    h = re.sub(r'<br\s*/?>', '\n', h)
    out = []
    for tag, body in re.findall(r'<(p|li|h\d)[^>]*>(.*?)</\1>', h, re.S):
        t = html.unescape(re.sub(r'<[^>]+>', '', body)).replace(' ', ' ')
        t = re.sub(r'[ \t]+', ' ', t).strip()
        if not t: continue
        kind = 'li' if tag == 'li' else 'h' if tag.startswith('h') else 'p'
        if kind == 'p' and re.fullmatch(r'(Опис|опис|Опис:)', t): continue
        out.append([kind, t[0].upper() + t[1:]])
    return out


def make_image(job):
    pid, path = job
    big, small = f'{IMG}/{pid}.webp', f'{IMG}/{pid}s.webp'
    meta = f'{IMG}/{pid}.json'
    if os.path.exists(big) and os.path.exists(small) and os.path.exists(meta):
        return pid, json.load(open(meta))
    im = Image.open(path); im.load()
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    im.thumbnail((1000, 1000), Image.LANCZOS)
    cut, ok = (None, False)
    if im.mode == 'RGB':
        cut, ok = cutout(im)
    res = cut if ok else im.convert('RGB')
    w, h = res.size
    for target, size, q in ((big, 800, 84), (small, 360, 80)):
        r = res.copy(); r.thumbnail((size, size), Image.LANCZOS)
        r.save(target, 'WEBP', quality=q, method=6, alpha_quality=90)
    info = {'cut': bool(ok), 'ar': round(w / h, 3)}
    json.dump(info, open(meta, 'w'))
    return pid, info


def main():
    cats = {}  # leaf slug → (section slug|None, sub slug|None, brand|None)
    sections = []
    for c in SRC['catalog']:
        old = c['slug']
        if old in SECTIONS:
            new, name, lead = SECTIONS[old]
            subs = [{'id': s['slug'], 'name': SUB_NAMES.get(s['slug'], s['label'].capitalize())} for s in c['categories']]
            sections.append({'id': new, 'old': old, 'name': name, 'lead': lead, 'subs': subs})
            cats[old] = (new, None, None)
            for s in c['categories']:
                cats[s['slug']] = (new, s['slug'], None)
        elif old in BRAND_CATS:
            cats[old] = (None, None, BRAND_CATS[old])
        else:
            raise SystemExit(f'unmapped category {old}')

    brand_names = {b[0]: b[1] for b in BRANDS}
    photos = {}
    for f in os.listdir(os.path.join(ROOT, 'originals/p')):
        photos[int(f.split('.')[0])] = os.path.join(ROOT, 'originals/p', f)
    jobs = [(p['pos_id'], photos[p['pos_id']]) for p in SRC['products'] if p['pos_id'] in photos]
    with ProcessPoolExecutor(8) as ex:
        images = dict(ex.map(make_image, jobs, chunksize=8))

    # Walk the tree to know each product's leaf category (the flat list only has the leaf id).
    leaf = {}
    def walk(c):
        for p in c.get('products', []): leaf[p['product_id']] = c['slug']
        for s in c.get('categories', []): walk(s)
    for c in SRC['catalog']: walk(c)

    products, seen = [], set()
    for p in sorted(SRC['products'], key=lambda p: p.get('sort_order', 0)):
        if p['product_id'] in seen: continue
        seen.add(p['product_id'])
        name = clean_name(p['name'])
        sec, sub, cat_brand = cats[leaf[p['product_id']]]
        up = name.upper()
        brand = (next((b[0] for b in BRANDS if re.search(b[2], up)), None) or cat_brand
                 or next((b for b, rx in ANYWHERE if re.search(rx, up)), None))
        guessed = not sec
        if guessed: sec, sub = guess_section(name, brand)
        img = images.get(p['pos_id'])
        products.append({
            'id': p['pos_id'],
            'slug': f"{slugify(name)}-{p['pos_id']}",
            'name': name,
            'price': int(p['price']) if p['price'] else 0,
            'section': sec, 'sub': sub, 'brand': brand,
            'vol': volume(name),
            'img': bool(img), 'cut': bool(img and img['cut']), 'ar': img['ar'] if img else 1,
            'popular': bool(p['popular']),
            'desc': clean_desc(p.get('description')),
        })

    counts = {}
    for p in products:
        if p['brand']: counts[p['brand']] = counts.get(p['brand'], 0) + 1
    brands = [{'id': b, 'name': brand_names[b], 'count': n} for b, n in sorted(counts.items(), key=lambda x: -x[1])]
    for s in sections:
        s['count'] = sum(1 for p in products if p['section'] == s['id'])
        for sb in s['subs']:
            sb['count'] = sum(1 for p in products if p['sub'] == sb['id'])
        s['subs'] = [sb for sb in s['subs'] if sb['count']]

    out = {'sections': sections, 'brands': brands, 'products': products}
    json.dump(out, open(os.path.join(ROOT, 'src/data/catalog.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    print('products', len(products), '| with photo', sum(p['img'] for p in products), '| cut', sum(p['cut'] for p in products),
          '| no brand', sum(1 for p in products if not p['brand']), '| no section', sum(1 for p in products if not p['section']))
    print('brands', [(b['id'], b['count']) for b in brands[:24]])
    print('sections', [(s['id'], s['count']) for s in sections])


if __name__ == '__main__':
    main()
