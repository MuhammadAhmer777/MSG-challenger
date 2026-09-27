import json, os, html, re, math
from pathlib import Path
base=Path('/mnt/data/ffimg')
assets=base/'assets'
assets.mkdir(exist_ok=True)

produce=json.load(open(base/'data/produce.json'))
markets=json.load(open(base/'data/markets.json'))

colors={
'Tomatoes':'#ef4444','Carrots':'#f59e0b','Lettuce':'#65a30d','Mango':'#f59e0b','Cucumber':'#16a34a','Radish':'#f43f5e','Mint':'#22c55e','Avocado':'#3f8f35','Broccoli':'#15803d','Coriander':'#22a447','Onions':'#c4a484','Watermelon':'#22a447','Apple':'#dc2626','Potatoes':'#b98b5d','Spinach':'#16803a','Okra':'#4d9a45','Banana':'#facc15','Oranges':'#f97316','Grapes':'#7c3aed','Guava':'#e76f51','Green Peas':'#4caf50','Cauliflower':'#f4f0df','Capsicum':'#22a447'}

# Self-contained, lightweight vector illustrations for each produce item.
def produce_svg(name):
    c=colors.get(name,'#5b8c5a')
    n=html.escape(name)
    # generic icon base plus type-specific simple shape
    shape=''
    if name=='Tomatoes': shape=f'<circle cx="400" cy="205" r="88" fill="{c}"/><circle cx="345" cy="250" r="62" fill="#ef5350"/><circle cx="455" cy="250" r="62" fill="#e53935"/><path d="M400 118l-18 34 30-12 20 26 8-42" fill="#2f8f3a"/>'
    elif name=='Onions': shape=f'<ellipse cx="350" cy="225" rx="72" ry="95" fill="{c}"/><ellipse cx="455" cy="225" rx="72" ry="95" fill="#d6b28c"/><path d="M350 125q-20-42 12-65M455 125q-10-40 18-64" stroke="#6e8b55" stroke-width="12" fill="none" stroke-linecap="round"/>'
    elif name=='Watermelon': shape=f'<path d="M245 265 A155 155 0 0 1 555 265 Z" fill="#e85d5d"/><path d="M245 265 A155 155 0 0 1 555 265" stroke="#218c4a" stroke-width="24" fill="none"/><ellipse cx="335" cy="225" rx="8" ry="13" fill="#222"/><ellipse cx="400" cy="205" rx="8" ry="13" fill="#222"/><ellipse cx="465" cy="230" rx="8" ry="13" fill="#222"/>'
    elif name=='Mango': shape=f'<path d="M320 300C250 245 270 125 395 120c95-4 130 88 75 154-44 54-94 78-150 26z" fill="{c}"/><path d="M390 125q30-55 80-50" stroke="#32834b" stroke-width="14" fill="none" stroke-linecap="round"/>'
    elif name=='Apple': shape=f'<path d="M400 145C335 105 270 165 290 245c20 80 70 112 110 65 40 47 90 15 110-65 20-80-45-140-110-100z" fill="{c}"/><path d="M400 145q10-45 52-58" stroke="#6b4a2e" stroke-width="13" fill="none"/><ellipse cx="468" cy="84" rx="42" ry="22" fill="#49a447" transform="rotate(-18 468 84)"/>'
    elif name=='Banana': shape=f'<path d="M270 175C310 310 470 320 535 170C500 240 390 260 330 155Z" fill="{c}" stroke="#d49f12" stroke-width="8"/><path d="M278 174l-16-20M532 170l15-22" stroke="#6b4a2e" stroke-width="12" stroke-linecap="round"/>'
    elif name=='Oranges': shape=f'<circle cx="345" cy="230" r="72" fill="{c}"/><circle cx="460" cy="230" r="72" fill="#fb8c1c"/><circle cx="400" cy="145" r="70" fill="#ff9d27"/><path d="M400 83q15-28 42-31" stroke="#4c9146" stroke-width="12" fill="none"/>'
    elif name=='Grapes': shape=f'<g fill="{c}"><circle cx="400" cy="145" r="38"/><circle cx="355" cy="190" r="38"/><circle cx="445" cy="190" r="38"/><circle cx="330" cy="235" r="38"/><circle cx="400" cy="235" r="38"/><circle cx="470" cy="235" r="38"/><circle cx="355" cy="280" r="38"/><circle cx="445" cy="280" r="38"/></g><path d="M400 110q15-45 55-60" stroke="#4d8e43" stroke-width="12" fill="none"/>'
    elif name=='Guava': shape=f'<ellipse cx="400" cy="220" rx="125" ry="105" fill="#78b95a"/><ellipse cx="400" cy="220" rx="92" ry="75" fill="#f4b6a6"/><g fill="#e5a18d"><circle cx="355" cy="195" r="5"/><circle cx="410" cy="210" r="5"/><circle cx="445" cy="245" r="5"/><circle cx="375" cy="260" r="5"/></g>'
    elif name in ('Carrots','Radish'):
        fill=c
        shape=f'<path d="M400 125L330 300Q400 335 470 300Z" fill="{fill}"/><path d="M400 125q-12-48-45-58M400 125q18-48 55-58M400 125q0-55 25-78" stroke="#4b9147" stroke-width="14" fill="none" stroke-linecap="round"/>'
    elif name=='Potatoes': shape=f'<ellipse cx="340" cy="225" rx="88" ry="70" fill="{c}"/><ellipse cx="455" cy="215" rx="88" ry="70" fill="#a97d50"/><circle cx="320" cy="205" r="7" fill="#8b633f"/><circle cx="435" cy="240" r="7" fill="#8b633f"/>'
    elif name in ('Lettuce','Spinach','Coriander','Mint'):
        shape='<g fill="'+c+'"><ellipse cx="330" cy="230" rx="62" ry="105" transform="rotate(-25 330 230)"/><ellipse cx="390" cy="205" rx="62" ry="115"/><ellipse cx="450" cy="230" rx="62" ry="105" transform="rotate(25 450 230)"/><ellipse cx="400" cy="260" rx="65" ry="100"/></g><path d="M400 180v130" stroke="#236b39" stroke-width="10"/>'
    elif name=='Broccoli': shape=f'<rect x="382" y="225" width="36" height="90" rx="12" fill="#7b5a35"/><g fill="{c}"><circle cx="340" cy="205" r="58"/><circle cx="400" cy="170" r="65"/><circle cx="465" cy="205" r="58"/><circle cx="370" cy="235" r="58"/><circle cx="435" cy="235" r="58"/></g>'
    elif name=='Cauliflower': shape=f'<path d="M370 240h60v75h-60z" fill="#7b5a35"/><g fill="{c}"><circle cx="345" cy="210" r="48"/><circle cx="395" cy="180" r="58"/><circle cx="455" cy="210" r="48"/><circle cx="400" cy="225" r="55"/></g>'
    elif name=='Cucumber': shape=f'<rect x="325" y="150" width="150" height="180" rx="75" fill="{c}" transform="rotate(28 400 240)"/><circle cx="350" cy="220" r="6" fill="#b8d98c"/><circle cx="410" cy="260" r="6" fill="#b8d98c"/><circle cx="445" cy="200" r="6" fill="#b8d98c"/>'
    elif name=='Avocado': shape=f'<path d="M400 115C300 115 285 245 350 305c40 38 90 15 100-45 10 60 60 83 100 45 65-60 50-190-50-190z" fill="#5a963c"/><ellipse cx="400" cy="225" rx="62" ry="82" fill="#a8c95b"/><circle cx="400" cy="270" r="32" fill="#9b6337"/>'
    elif name=='Okra': shape=f'<g fill="{c}"><path d="M325 275L455 155l35 35-130 120z"/><path d="M300 235L425 115l30 30-125 120z"/></g>'
    elif name=='Green Peas': shape=f'<path d="M275 250Q400 125 525 250Q400 335 275 250z" fill="#4caf50"/><g fill="#bfe38d"><circle cx="335" cy="245" r="24"/><circle cx="400" cy="215" r="24"/><circle cx="465" cy="245" r="24"/></g>'
    elif name=='Capsicum': shape=f'<path d="M320 165q80-45 160 0v105q-80 90-160 0z" fill="{c}"/><path d="M400 160v120M350 165l-15 100M450 165l15 100" stroke="#17713b" stroke-width="10" fill="none"/><path d="M400 160q0-45 30-65" stroke="#4b7f3c" stroke-width="13" fill="none"/>'
    else: shape=f'<circle cx="400" cy="220" r="105" fill="{c}"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" rx="32" fill="#f3f9ef"/><circle cx="80" cy="80" r="45" fill="#e5f1df"/><circle cx="720" cy="420" r="65" fill="#e5f1df"/>{shape}<text x="400" y="405" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#214b35">{n}</text><text x="400" y="440" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#5f7767">FreshFind Produce Guide</text></svg>'''

for p in produce:
    fn='produce-'+re.sub(r'[^a-z0-9]+','-',p['name'].lower()).strip('-')+'.svg'
    (assets/fn).write_text(produce_svg(p['name']),encoding='utf-8')
    p['image']='assets/'+fn

# Market illustration with neighborhood/market name, designed as a visual card rather than claiming a real photograph of the exact market.
accents=['#3f8f5a','#2e7d6b','#6b8e3a','#8a9a5b','#4f9d69','#3d7d5a','#4f8c63','#6f8f4e']
for i,m in enumerate(markets):
    fn='market-'+re.sub(r'[^a-z0-9]+','-',m['id'].lower()).strip('-')+'.svg'
    accent=accents[i%len(accents)]
    area=html.escape(m['area']); name=html.escape(m['name'])
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520"><rect width="900" height="520" rx="34" fill="#eef7ea"/><rect x="75" y="105" width="750" height="300" rx="28" fill="#fff" stroke="#dbe9d8" stroke-width="4"/><path d="M90 165L135 95H765L810 165Z" fill="{accent}"/><path d="M135 95v70M225 95v70M315 95v70M405 95v70M495 95v70M585 95v70M675 95v70M765 95v70" stroke="#fff" stroke-width="12" opacity=".8"/><rect x="145" y="205" width="610" height="135" rx="18" fill="#f6faf4"/><g><rect x="185" y="260" width="125" height="55" rx="10" fill="#d9ead3"/><circle cx="225" cy="250" r="28" fill="#ef5350"/><circle cx="275" cy="250" r="28" fill="#f7b731"/><rect x="350" y="260" width="125" height="55" rx="10" fill="#d9ead3"/><circle cx="390" cy="250" r="28" fill="#5ba64a"/><circle cx="440" cy="250" r="28" fill="#f59e0b"/><rect x="515" y="260" width="125" height="55" rx="10" fill="#d9ead3"/><circle cx="555" cy="250" r="28" fill="#8e5bd7"/><circle cx="605" cy="250" r="28" fill="#f28c28"/></g><text x="450" y="375" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#214b35">{area}</text><text x="450" y="450" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#52705e">{name}</text></svg>'''
    (assets/fn).write_text(svg,encoding='utf-8')
    m['image']='assets/'+fn

json.dump(produce,open(base/'data/produce.json','w',encoding='utf-8'),indent=2,ensure_ascii=False)
json.dump(markets,open(base/'data/markets.json','w',encoding='utf-8'),indent=2,ensure_ascii=False)
