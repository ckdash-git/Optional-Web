#!/usr/bin/env python3
"""Author the site's Lottie animations (assets/lottie/*.json). Run: python3 tools/make-lottie.py
Colours match the brand: coral dot of the logo, near-black ink."""
import json, pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets/lottie'
CORAL, INK = [1, 0.353, 0.31, 1], [0.055, 0.059, 0.047, 1]
EASE = {'i': {'x': [0.2], 'y': [1]}, 'o': {'x': [0.4], 'y': [0]}}
BOUNCE = {'i': {'x': [0.3], 'y': [1]}, 'o': {'x': [0.2], 'y': [0]}}


def val(v):
    return {'a': 0, 'k': v}


def anim(frames, ease=EASE):
    """frames: [(t, value), ...] -> animated property."""
    ks = []
    for n, (t, v) in enumerate(frames):
        k = {'t': t, 's': v if isinstance(v, list) else [v]}
        if n < len(frames) - 1:
            k.update(ease)
        ks.append(k)
    return {'a': 1, 'k': ks}


def xf(p=(0, 0), s=(100, 100), o=100):
    return {'ty': 'tr', 'p': val(list(p)), 'a': val([0, 0]), 's': val(list(s)), 'r': val(0), 'o': val(o), 'sk': val(0), 'sa': val(0)}


def layer(ind, shapes, op, ks=None, ip=0, st=0):
    base = {'o': val(100), 'r': val(0), 'p': val([0, 0, 0]), 'a': val([0, 0, 0]), 's': val([100, 100, 100])}
    base.update(ks or {})
    return {'ddd': 0, 'ind': ind, 'ty': 4, 'nm': f'l{ind}', 'sr': 1, 'ks': base, 'ao': 0, 'shapes': shapes, 'ip': ip, 'op': op, 'st': st, 'bm': 0}


def doc(name, w, h, op, layers):
    return {'v': '5.7.0', 'fr': 60, 'ip': 0, 'op': op, 'w': w, 'h': h, 'nm': name, 'ddd': 0, 'assets': [], 'layers': layers}


def ellipse(d, color=None, stroke=None, width=0, transform=None):
    it = [{'ty': 'el', 'p': val([0, 0]), 's': val([d, d])}]
    if color: it.append({'ty': 'fl', 'c': val(color), 'o': val(100)})
    if stroke: it.append({'ty': 'st', 'c': val(stroke), 'o': val(100), 'w': val(width), 'lc': 2, 'lj': 2})
    it.append(transform or xf())
    return {'ty': 'gr', 'it': it, 'nm': 'e'}


def path(points, closed=False, stroke=None, width=4, fill=None, trim=None):
    ver = [list(p) for p in points]
    zero = [[0, 0]] * len(ver)
    it = [{'ty': 'sh', 'ks': val({'i': zero, 'o': zero, 'v': ver, 'c': closed})}]
    if trim: it.append({'ty': 'tm', 's': val(0), 'e': trim, 'o': val(0), 'm': 1})
    if stroke: it.append({'ty': 'st', 'c': val(stroke), 'o': val(100), 'w': val(width), 'lc': 2, 'lj': 2})
    if fill: it.append({'ty': 'fl', 'c': val(fill), 'o': val(100)})
    it.append(xf())
    return {'ty': 'gr', 'it': it, 'nm': 'p'}


# check: coral disc pops in, ink tick draws on (48x48, 0.75 s)
check = doc('check', 48, 48, 45, [
    layer(1, [path([(14, 25), (21, 32), (34, 17)], stroke=INK, width=4.5, trim=anim([(14, 0), (34, 100)]))], 45),
    layer(2, [ellipse(40, color=CORAL)], 45, ks={'p': val([24, 24, 0]), 's': anim([(0, [0, 0, 100]), (16, [100, 100, 100])], BOUNCE)}),
])
# the tick must sit above the disc, so list it first (Lottie draws the first layer on top)

# ripple: a coral dot with rings that expand and fade, seamless 3 s loop (400x400)
rings = []
ind = 1
for k in (0, 60, 120):
    for ip, op, st in ((0, 180 - k, -k), (180 - k, 180, 180 - k)):
        if op <= ip: continue
        rings.append(layer(ind, [ellipse(300, stroke=CORAL, width=4)], op, ip=ip, st=st, ks={
            'p': val([200, 200, 0]),
            's': anim([(0, [14, 14, 100]), (180, [100, 100, 100])]),
            'o': anim([(0, [85]), (150, [25]), (180, [0])])}))
        ind += 1
dot = layer(ind, [ellipse(56, color=CORAL)], 180, ks={'p': val([200, 200, 0]), 's': anim([(0, [100, 100, 100]), (90, [118, 118, 100]), (180, [100, 100, 100])])})
ripple = doc('ripple', 400, 400, 180, [dot] + rings)

# shield: outline draws on, coral fills in, keyhole pops (64x64, 1.1 s)
shield_pts = [(32, 6), (53, 14), (53, 33), (32, 58), (11, 33), (11, 14)]
shield = doc('shield', 64, 64, 66, [
    layer(1, [ellipse(9, color=INK)], 66, ks={'p': val([32, 30, 0]), 's': anim([(48, [0, 0, 100]), (62, [100, 100, 100])], BOUNCE)}),
    layer(2, [path(shield_pts, closed=True, stroke=INK, width=3.5, trim=anim([(0, 0), (40, 100)]))], 66),
    layer(3, [path(shield_pts, closed=True, fill=CORAL)], 66, ks={'o': anim([(34, [0]), (56, [100])])}),
])

for name, d in (('check', check), ('ripple', ripple), ('shield', shield)):
    (OUT / f'{name}.json').write_text(json.dumps(d, separators=(',', ':')))
    print(name, (OUT / f'{name}.json').stat().st_size, 'bytes')
