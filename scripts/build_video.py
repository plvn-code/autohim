"""Encode the licensed Pexels clips (research/video-raw, see docs/STATUS.md) for the web with a cold blue grade. Usage: build_video.py <project root>"""
import os, subprocess, sys
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
root = sys.argv[1]
raw = os.path.join(root, 'research/video-raw')
out = os.path.join(root, 'public/video'); os.makedirs(out, exist_ok=True)
img = os.path.join(root, 'public/images'); os.makedirs(img, exist_ok=True)
# "Midnight" grade: deeper blacks, less colour, blue pushed into shadows and mids.
GRADE = 'eq=brightness=-0.05:contrast=1.12:saturation=0.5,colorbalance=rs=-0.08:gs=-0.02:bs=0.18:rm=-0.06:bm=0.11:rh=-0.03:bh=0.05'
def run(*a):
    r = subprocess.run([FF, '-y', '-loglevel', 'error', *a], capture_output=True, text=True)
    if r.returncode: print(r.stderr[-800:]); raise SystemExit(1)
enc = ['-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-movflags', '+faststart', '-profile:v', 'high']
def boomerang(chain, seconds, start=0):
    return f"[0:v]trim={start}:{start + seconds},setpts=PTS-STARTPTS,fps=30,{chain},split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]"
def clip(src, name, w, h, seconds, start, crf, rate, crop='', grade=GRADE, poster_at=0):
    chain = (crop + ',' if crop else '') + f'scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h},{grade}'
    run('-i', src, '-filter_complex', boomerang(chain, seconds, start), '-map', '[v]', *enc, '-crf', str(crf), '-maxrate', rate, '-bufsize', rate.replace('M', '') + 'M', os.path.join(out, name + '.mp4'))
    run('-ss', str(start + poster_at), '-i', src, '-frames:v', '1', '-vf', chain, '-q:v', '80', os.path.join(img, name + '-poster.webp'))
hero = os.path.join(raw, '6157786.mp4')
clip(hero, 'hero', 1920, 1080, 10, 1, 24, '6M', crop='crop=iw*0.76:ih*0.76:0:ih*0.24')
clip(hero, 'hero-mobile', 720, 1280, 10, 1, 26, '3M', crop='crop=ih*9/16:ih:iw*0.42-ih*9/32:0')
clip(os.path.join(raw, '6873168.mp4'), 'wash', 1600, 900, 8, 9, 26, '4M')
clip(os.path.join(raw, '40006857.mp4'), 'drops', 1600, 900, 6, 2, 26, '3M',
     grade='eq=brightness=-0.10:contrast=1.15:saturation=0.45,colorbalance=rs=-0.10:bs=0.14:rm=-0.08:bm=0.10')
clip(os.path.join(raw, '6159294.mp4'), 'polish', 1600, 900, 7, 4, 26, '3M')
for f in sorted(os.listdir(out)):
    print(f, round(os.path.getsize(os.path.join(out, f)) / 1048576, 2), 'MB')
