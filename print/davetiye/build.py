# Basılı davetiye: yemeksiz + yemekli, PDF (taşma paylı) + 300 dpi PNG
import base64, io, os, re, subprocess
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
QRDIR = HERE  # "npm i qrcode" bu klasörde
LOGO = r"C:\Users\ereen\source\repos\bengisueren-invitation-repo\logo.png"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

SPRIG = """<path class="stem" d="M8 96 C 10 70, 12 48, 26 30 S 62 10, 96 8"/>
<g transform="translate(10 78) rotate(-40)"><path class="leaf" d="M0 0Q6 -5.4 13 0Q6 5.4 0 0Z"/><path class="rib" d="M1 0L10.5 0"/></g>
<g transform="translate(12 60) rotate(-150)"><path class="leaf" d="M0 0Q4 -3.6 9 0Q4 3.6 0 0Z"/><path class="rib" d="M1 0L7 0"/></g>
<g transform="translate(20 40) rotate(-25)"><path class="leaf" d="M0 0Q6 -5.4 13 0Q6 5.4 0 0Z"/><path class="rib" d="M1 0L10.5 0"/></g>
<g transform="translate(40 21) rotate(-120)"><path class="leaf" d="M0 0Q4 -3.6 9 0Q4 3.6 0 0Z"/><path class="rib" d="M1 0L7 0"/></g>
<g transform="translate(58 14) rotate(35)"><path class="leaf" d="M0 0Q6 -5.4 13 0Q6 5.4 0 0Z"/><path class="rib" d="M1 0L10.5 0"/></g>
<g transform="translate(78 10) rotate(-60)"><path class="leaf" d="M0 0Q4 -3.6 9 0Q4 3.6 0 0Z"/><path class="rib" d="M1 0L7 0"/></g>
<g transform="translate(31 45)"><circle cx="2.6" cy="0" r="1.9"/><circle cx="0.8" cy="2.47" r="1.9"/><circle cx="-2.1" cy="1.53" r="1.9"/><circle cx="-2.1" cy="-1.53" r="1.9"/><circle cx="0.8" cy="-2.47" r="1.9"/><circle class="c" cx="0" cy="0" r="1.3"/></g>
<g transform="translate(66 24) scale(.8)"><circle cx="2.6" cy="0" r="1.9"/><circle cx="0.8" cy="2.47" r="1.9"/><circle cx="-2.1" cy="1.53" r="1.9"/><circle cx="-2.1" cy="-1.53" r="1.9"/><circle cx="0.8" cy="-2.47" r="1.9"/><circle class="c" cx="0" cy="0" r="1.3"/></g>"""

# sitedeki gece planı ikonları
PROGRAM = """<div class="program">
  <div><svg viewBox="0 0 64 64"><circle cx="25" cy="41" r="12.5"/><circle cx="40" cy="41" r="12.5"/><path d="M35 23 l5-6 5 6-5 5z"/><path d="M29 16l1.4 3M47 19l3 1.2"/></svg><strong>18:00</strong><span>NİKAH</span></div>
  <div><svg viewBox="0 0 64 64"><circle cx="32" cy="33" r="15"/><circle cx="32" cy="33" r="9"/><path d="M13 15v18M13 15v9M10 15v9M16 15v9"/><path d="M51 15v34M51 15c4 2 4 11 0 13"/></svg><strong>18:30</strong><span>YEMEK</span></div>
  <div><svg viewBox="0 0 64 64"><path d="M27 46V20l18-5v23"/><ellipse cx="22" cy="46" rx="6" ry="4.4"/><ellipse cx="40" cy="42" rx="6" ry="4.4"/><path d="M27 27l18-5"/></svg><strong>20:00</strong><span>EĞLENCE</span></div>
</div>"""

PROGRAM_PLAIN = """<div class="program">
  <div><svg viewBox="0 0 64 64"><path d="M27 46V20l18-5v23"/><ellipse cx="22" cy="46" rx="6" ry="4.4"/><ellipse cx="40" cy="42" rx="6" ry="4.4"/><path d="M27 27l18-5"/></svg><strong>20:00</strong><span>DÜĞÜN</span></div>
</div>"""

VARIANTS = {
    "yemeksiz": {"url": "https://bengisuerenwedding.co.uk/", "time": "20:00", "program": PROGRAM_PLAIN},
    "yemekli": {"url": "https://bengisuerenwedding.co.uk/?y", "time": "18:00", "program": PROGRAM},
}

im = Image.open(LOGO)
im = im.crop(im.getbbox())
im.thumbnail((300, 300))
b = io.BytesIO()
im.save(b, "PNG", optimize=True)
logo64 = base64.b64encode(b.getvalue()).decode()

tpl = open(os.path.join(HERE, "davetiye.tpl.html"), encoding="utf-8").read()

for name, v in VARIANTS.items():
    js = ("const QR=require('qrcode');QR.toString(process.argv[1],{type:'svg',errorCorrectionLevel:'M',margin:0,"
          "color:{dark:'#3d4832',light:'#00000000'}}).then(s=>process.stdout.write(s))")
    svg = subprocess.run(["node", "-e", js, v["url"]], cwd=QRDIR, capture_output=True, text=True, check=True).stdout
    html = (tpl.replace("{{VARIANT}}", name).replace("{{SPRIG}}", SPRIG).replace("{{LOGO}}", logo64)
            .replace("{{QR}}", svg).replace("{{TIME}}", v["time"]).replace("{{PROGRAM}}", v["program"]))
    hp = os.path.join(HERE, f"davetiye-{name}.html")
    open(hp, "w", encoding="utf-8").write(html)  # ara dosya
    url = "file:///" + hp.replace("\\", "/")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=9000",
                    f"--print-to-pdf={os.path.join(HERE, f'davetiye-{name}.pdf')}", url], capture_output=True)
    # 131x181 mm @300 dpi = 1547x2138 px  (CSS: 495x684 px, ölçek 3.125)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=9000",
                    "--window-size=495,684", "--force-device-scale-factor=3.125",
                    f"--screenshot={os.path.join(HERE, f'davetiye-{name}.png')}", url], capture_output=True)
    print(name, "ok")
