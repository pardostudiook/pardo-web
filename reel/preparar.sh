#!/usr/bin/env bash
# Copia a public/ el material de la web que usa el reel y saca la captura de la web.
set -e
cd "$(dirname "$0")"
A=../assets
mkdir -p public/v
mkdir -p public/voz && cp voz/*.mp3 public/voz/
cp $A/hero-movil.mp4 $A/logo.png $A/logo-pardo-vertical.png $A/papel-negro.jpg $A/papel-blanco.jpg $A/bosque.jpg $A/contacto.jpg public/
# Clips verticales. Si ORIGINALES apunta a la carpeta con los originales de Drive (mismos nombres cortos),
# se usan esos (1080x1920 o 4K, sin la compresión de la web). Si no, se usan los de la web.
for v in boulevard-reel-1 boulevard-reel-2 boulevard-reel-3 videocaso-01 pardo-alcance riica-algaria-03 riica-almora-02 riica-almora-03 prisamata-01 prisamata-05 prisamata-11; do
  if [ -n "${ORIGINALES:-}" ] && [ -f "$ORIGINALES/$v.mp4" ]; then
    ffmpeg -v error -y -i "$ORIGINALES/$v.mp4" -an -vf "scale=1080:1920:flags=lanczos" -c:v libx264 -preset medium -crf 12 -g 12 -pix_fmt yuv420p public/v/$v.mp4
  else
    cp $A/verticales/$v.mp4 public/v/
  fi
done
# Showreel de portada en alta (original subido a Wix, 1600x1080). Se pasa a H.264 para Remotion.
if [ ! -f public/hero-alta.mp4 ]; then
  curl -sL -o public/hero-original.mp4 https://video.wixstatic.com/video/36911e_889c49b7d4f641db949da52b9681358a/file
  ffmpeg -v error -y -i public/hero-original.mp4 -an -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p public/hero-alta.mp4
  rm public/hero-original.mp4
fi
node captura-web.js
