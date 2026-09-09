"""Convert AiM Race Studio .tkk kart track files to 1-lap GPX files.

Format (reverse-engineered):
  Chunks: '<h' + tag(4, NUL-padded) + len(u32 LE) + 1 byte + '>' + payload.
  Vnfo payload: name[28] country[4] state[4] ... f32 track_len @44,
                start/finish lat,lon as i32*1e-7 deg @48.
  pts payload: N * 12 bytes (lat i32, lon i32, extra u32), closed loop.

Output: one GPX per track in Downloads/Aus_Kart_Tracks/<TrackName>.gpx
  - <wpt> marks the Start/Finish line location
  - <trk> is exactly one lap, rotated to begin/end at the S/F point
"""
import struct, glob, math, os, re, sys
from xml.sax.saxutils import escape

if len(sys.argv) not in (1, 3):
    sys.exit("usage: python tkk2gpx.py [<extract_dir> <out_dir>]")
SRC = sys.argv[1] if len(sys.argv) == 3 else r"C:\Users\Administrator\Downloads\Aus_Kart_extract"
OUT = sys.argv[2] if len(sys.argv) == 3 else r"C:\Users\Administrator\Downloads\Aus_Kart_Tracks"

def read_chunks(data):
    chunks = {}
    i = 0
    while i <= len(data) - 12:
        if data[i:i+2] == b'<h' and data[i+11:i+12] == b'>':
            tag = data[i+2:i+6].rstrip(b'\x00').decode('latin-1')
            length = struct.unpack('<I', data[i+6:i+10])[0]
            if 0 <= length <= len(data) - (i + 12):
                chunks.setdefault(tag, []).append(data[i+12:i+12+length])
                i += 12 + length
                continue
        i += 1
    return chunks

def cstr(b):
    return b.split(b'\0')[0].decode('latin-1').strip()

def haversine_m(lat1, lon1, lat2, lon2):
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def convert(fn):
    data = open(fn, 'rb').read()
    ch = read_chunks(data)
    v = ch['Vnfo'][0]
    name = cstr(v[0:28])
    state = cstr(v[32:36])
    tlen = struct.unpack('<f', v[44:48])[0]
    sflat_i, sflon_i = struct.unpack('<ii', v[48:56])
    sflat, sflon = sflat_i / 1e7, sflon_i / 1e7

    p = ch['pts'][0]
    n = len(p) // 12
    pts = []
    for k in range(n):
        la, lo, _extra = struct.unpack_from('<iiI', p, k * 12)
        pts.append((la / 1e7, lo / 1e7))

    # drop duplicated closing point if present, we re-close ourselves
    if haversine_m(*pts[0], *pts[-1]) < 3.0:
        pts = pts[:-1]

    # rotate loop so lap starts at the point nearest the S/F location
    dists = [haversine_m(la, lo, sflat, sflon) for la, lo in pts]
    i0 = dists.index(min(dists))
    lap = pts[i0:] + pts[:i0]
    lap.append(lap[0])  # close: 1 full lap ending back at S/F
    sf_gap = min(dists)

    # perimeter sanity vs declared length
    per = sum(haversine_m(*lap[i], *lap[i+1]) for i in range(len(lap)-1))

    safe = re.sub(r'[^A-Za-z0-9._ -]', '_', name).strip()
    out = os.path.join(OUT, safe + '.gpx')

    tp = '\n'.join(
        f'      <trkpt lat="{la:.7f}" lon="{lo:.7f}"></trkpt>'
        for la, lo in lap)
    gpx = f'''<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="tkk2gpx (Aus_Kart.ztracks converter)"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>{escape(name)}</name>
    <desc>Kart track, {escape(state)} AU. One lap starting and ending at the Start/Finish line. Declared length {tlen:.0f} m.</desc>
  </metadata>
  <wpt lat="{sflat:.7f}" lon="{sflon:.7f}">
    <name>Start/Finish</name>
    <desc>Start/Finish line location</desc>
    <sym>Flag, Checkered</sym>
  </wpt>
  <trk>
    <name>{escape(name)} - 1 lap</name>
    <trkseg>
{tp}
    </trkseg>
  </trk>
</gpx>
'''
    with open(out, 'w', encoding='utf-8') as f:
        f.write(gpx)
    return name, state, tlen, per, sf_gap, len(lap), safe

os.makedirs(OUT, exist_ok=True)
names = {}
rows = []
warn = 0
for fn in sorted(glob.glob(os.path.join(SRC, '*.tkk'))):
    name, state, tlen, per, sf_gap, npts, safe = convert(fn)
    if safe in names:
        print(f'!! DUPLICATE name {safe}: {fn} and {names[safe]}')
        warn += 1
    names[safe] = fn
    flag = ''
    if tlen and abs(per - tlen) / tlen > 0.10:
        flag += ' LEN-MISMATCH'
        warn += 1
    if sf_gap > 25:
        flag += f' SF-FAR({sf_gap:.0f}m)'
        warn += 1
    rows.append((name, state, tlen, per, sf_gap, npts, flag))
    print(f'{name:<14} {state:<4} decl={tlen:6.0f}m gpx={per:6.0f}m sf_gap={sf_gap:5.1f}m pts={npts}{flag}')

print(f'\n{len(rows)} tracks converted to {OUT}, warnings: {warn}')
