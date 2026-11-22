#!/usr/bin/env bash
# Copia a public/ el material de la web que usa el reel y saca la captura de la web.
set -e
cd "$(dirname "$0")"
A=../assets
mkdir -p public/v
cp $A/logo.png $A/logo-pardo-vertical.png $A/papel-negro.jpg $A/papel-blanco.jpg $A/bosque.jpg $A/contacto.jpg public/
for v in boulevard-reel-1 pardo-alcance riica-algaria-03 satoshi-pingpong prisamata-05 riica-almora-02 boulevard-reel-3; do cp $A/verticales/$v.mp4 public/v/; done
# Showreel de portada en alta (original subido a Wix, 1600x1080). Se pasa a H.264 para Remotion.
if [ ! -f public/hero-alta.mp4 ]; then
  curl -sL -o public/hero-original.mp4 https://video.wixstatic.com/video/36911e_889c49b7d4f641db949da52b9681358a/file
  ffmpeg -v error -y -i public/hero-original.mp4 -an -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p public/hero-alta.mp4
  rm public/hero-original.mp4
fi
node captura-web.js
