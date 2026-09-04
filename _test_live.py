import urllib.request

base = 'http://localhost:8123/'

# Test gpu-studio.html
resp = urllib.request.urlopen(base + 'gpu-studio.html')
html = resp.read().decode('utf-8')
print('gpu-studio.html (HTTP %d, length=%d):' % (resp.status, len(html)))
checks = [
    ('id="modal"', 'id="modal"' in html),
    ('id="modal-canvas"', 'id="modal-canvas"' in html),
    ('id="left-ad-banner"', 'id="left-ad-banner"' in html),
    ('id="right-ad-banner"', 'id="right-ad-banner"' in html),
    ('main.js?v=69', 'main.js?v=69' in html),
    ('style.css?v=77', 'style.css?v=77' in html),
]
for name, ok in checks:
    print('  %s: %s' % (name, ok))

# Test index.html
resp2 = urllib.request.urlopen(base + 'index.html')
html2 = resp2.read().decode('utf-8')
print('\nindex.html (HTTP %d, length=%d):' % (resp2.status, len(html2)))
checks2 = [
    ('id="modal"', 'id="modal"' in html2),
    ('id="modal-canvas"', 'id="modal-canvas"' in html2),
    ('id="left-ad-banner"', 'id="left-ad-banner"' in html2),
    ('id="right-ad-banner"', 'id="right-ad-banner"' in html2),
    ('main.js?v=76', 'main.js?v=76' in html2),
    ('style.css?v=84', 'style.css?v=84' in html2),
]
for name, ok in checks2:
    print('  %s: %s' % (name, ok))

# Test main.js
resp3 = urllib.request.urlopen(base + 'main.js?v=69')
js = resp3.read().decode('utf-8')
print('\nmain.js (HTTP %d):' % resp3.status)
js_checks = [
    ('openModal exists', 'function openModal' in js),
    ('closeModal exists', 'function closeModal' in js),
    ("$('#left-ad-banner')", "$('#left-ad-banner')" in js),
    ("$('#right-ad-banner')", "$('#right-ad-banner')" in js),
    ("$('#bottom-ad-banner')", "$('#bottom-ad-banner')" in js),
    ('leftAd in openModal', 'leftAd.classList.remove' in js),
    ('rightAd in openModal', 'rightAd.classList.remove' in js),
    ('bottomAd hide', 'bottomAd.classList.add' in js),
    ('bottomAd show', 'bottomAd.classList.remove' in js),
    ('initModalEngine call', 'initModalEngine(m);' in js),
]
for name, ok in js_checks:
    print('  %s: %s' % (name, ok))
