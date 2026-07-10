#!/bin/bash
# Generate customer testimonial videos for bmwusedengines homepage
set -euo pipefail

OUT_DIR="videos/testimonials"
TMP_DIR="/tmp/bmw-testimonial-vids"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
W=1280
H=720
FPS=30

mkdir -p "$OUT_DIR" "$TMP_DIR"

make_intro() {
  local file="$1" name="$2" location="$3" duration="$4"
  ffmpeg -y -f lavfi -i "color=c=0x0a1628:s=${W}x${H}:d=${duration}:r=${FPS}" \
    -f lavfi -i "anullsrc=r=44100:cl=stereo" \
    -vf "\
drawtext=fontfile=${FONT}:text='Customer Review':fontsize=28:fontcolor=0x6fbaf7:x=(w-text_w)/2:y=h*0.28,\
drawtext=fontfile=${FONT}:text='${name}':fontsize=52:fontcolor=white:x=(w-text_w)/2:y=h*0.40,\
drawtext=fontfile=${FONT_REG}:text='${location}':fontsize=32:fontcolor=0xb8c4d0:x=(w-text_w)/2:y=h*0.52,\
drawtext=fontfile=${FONT_REG}:text='bmwusedengines':fontsize=24:fontcolor=0x1c69d4:x=(w-text_w)/2:y=h*0.72" \
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest -t "$duration" "$file" 2>/dev/null
}

make_image_seg() {
  local file="$1" img="$2" line1="$3" line2="$4" duration="$5"
  local frames=$((duration * FPS))
  ffmpeg -y -loop 1 -i "$img" -f lavfi -i "anullsrc=r=44100:cl=stereo" \
    -vf "\
scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},\
zoompan=z='min(1.0+0.0008*on,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS},\
drawbox=x=0:y=ih-200:w=iw:h=200:color=black@0.55:t=fill,\
drawtext=fontfile=${FONT_REG}:text='${line1}':fontsize=30:fontcolor=white:x=40:y=h-150,\
drawtext=fontfile=${FONT}:text='${line2}':fontsize=34:fontcolor=0x6fbaf7:x=40:y=h-100" \
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest -t "$duration" "$file" 2>/dev/null
}

make_outro() {
  local file="$1" rating="$2" duration="$3"
  ffmpeg -y -f lavfi -i "color=c=0x0f2847:s=${W}x${H}:d=${duration}:r=${FPS}" \
    -f lavfi -i "anullsrc=r=44100:cl=stereo" \
    -vf "\
drawtext=fontfile=${FONT}:text='★★★★★':fontsize=56:fontcolor=0x00b67a:x=(w-text_w)/2:y=h*0.32,\
drawtext=fontfile=${FONT}:text='${rating}':fontsize=40:fontcolor=white:x=(w-text_w)/2:y=h*0.46,\
drawtext=fontfile=${FONT_REG}:text='Verified Purchase — bmwusedengines':fontsize=28:fontcolor=0xb8c4d0:x=(w-text_w)/2:y=h*0.58,\
drawtext=fontfile=${FONT}:text='bmwusedengines.org':fontsize=32:fontcolor=0x1c69d4:x=(w-text_w)/2:y=h*0.72" \
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest -t "$duration" "$file" 2>/dev/null
}

concat_video() {
  local out="$1"; shift
  local list="$TMP_DIR/concat_$(basename "$out").txt"
  printf "%s\n" "$@" | sed "s/^/file '/;s/$/'/" > "$list"
  ffmpeg -y -f concat -safe 0 -i "$list" -c copy "$out" 2>/dev/null
}

# Video 1 — Marco, Milan
make_intro "$TMP_DIR/m1.mp4" "Marco" "Milan, Italy" 7
make_image_seg "$TMP_DIR/m2.mp4" "images/engines/sets/set-0108/01.webp" \
  "I ordered a BMW X5 N57 diesel engine for €3,200." "Arrived in 4 days — compression report matched perfectly." 13
make_image_seg "$TMP_DIR/m3.mp4" "images/bmw-cars/bmw-04.jpg" \
  "My workshop fitted it in two days. Car runs smooth." "Highly recommend bmwusedengines to anyone in Italy." 12
make_outro "$TMP_DIR/m4.mp4" "Excellent — 5 Stars" 8
concat_video "$OUT_DIR/marco-milan-n57.mp4" "$TMP_DIR/m1.mp4" "$TMP_DIR/m2.mp4" "$TMP_DIR/m3.mp4" "$TMP_DIR/m4.mp4"
echo "Created marco-milan-n57.mp4"

# Video 2 — Thomas, Hamburg
make_intro "$TMP_DIR/t1.mp4" "Thomas" "Hamburg, Germany" 7
make_image_seg "$TMP_DIR/t2.mp4" "images/engines/sets/set-0047/01.webp" \
  "Bought an E46 M54B30 engine for my 330i rebuild." "Real photos of the exact engine — no surprises on delivery." 13
make_image_seg "$TMP_DIR/t3.mp4" "images/bmw-cars/bmw-01.jpg" \
  "Engine started first time after install." "bmwusedengines saved me thousands vs dealer price." 12
make_outro "$TMP_DIR/t4.mp4" "Would Buy Again" 8
concat_video "$OUT_DIR/thomas-hamburg-m54.mp4" "$TMP_DIR/t1.mp4" "$TMP_DIR/t2.mp4" "$TMP_DIR/t3.mp4" "$TMP_DIR/t4.mp4"
echo "Created thomas-hamburg-m54.mp4"

# Video 3 — James, Birmingham
make_intro "$TMP_DIR/j1.mp4" "James" "Birmingham, UK" 7
make_image_seg "$TMP_DIR/j2.mp4" "images/engines/sets/set-0114/01.webp" \
  "Needed an N47 for my F30 320d after timing chain failure." "Team confirmed fitment by VIN before I paid deposit." 13
make_image_seg "$TMP_DIR/j3.mp4" "images/bmw-cars/bmw-03.jpg" \
  "Shipped to UK with customs docs handled." "Car back on the road — very satisfied customer." 12
make_outro "$TMP_DIR/j4.mp4" "Trusted Supplier" 8
concat_video "$OUT_DIR/james-birmingham-n47.mp4" "$TMP_DIR/j1.mp4" "$TMP_DIR/j2.mp4" "$TMP_DIR/j3.mp4" "$TMP_DIR/j4.mp4"
echo "Created james-birmingham-n47.mp4"

for f in "$OUT_DIR"/*.mp4; do
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" 2>/dev/null)
  size=$(du -h "$f" | cut -f1)
  echo "$(basename "$f"): ${dur}s, $size"
done

rm -rf "$TMP_DIR"
echo "Done."
