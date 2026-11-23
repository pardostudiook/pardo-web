#!/usr/bin/env bash
# Copia a public/ el material de la web que usa el reel y saca la captura de la web.
# REGLA: los videos se usan NATIVOS, tal cual están (nunca se recomprimen ni se convierten).
set -e
cd "$(dirname "$0")"
A=../assets
mkdir -p public/v
mkdir -p public/voz && cp voz/*.mp3 public/voz/
cp $A/hero-movil.mp4 $A/logo.png $A/logo-pardo-vertical.png $A/papel-negro.jpg $A/papel-blanco.jpg $A/bosque.jpg $A/contacto.jpg public/
# Clips verticales nativos. Si ORIGINALES apunta a la carpeta con los originales de Drive (mismos nombres cortos),
# se copian esos; si no, los de la web. Siempre sin recomprimir.
for v in boulevard-reel-1 boulevard-reel-2 boulevard-reel-3 videocaso-01 pardo-alcance riica-algaria-03 riica-almora-02 riica-almora-03 prisamata-01 prisamata-05 prisamata-11; do
  if [ -n "${ORIGINALES:-}" ] && [ -f "$ORIGINALES/$v.mp4" ]; then cp "$ORIGINALES/$v.mp4" public/v/
  else cp $A/verticales/$v.mp4 public/v/; fi
done
# Showreel de portada en alta: el original subido a Wix (1600x1080), sin convertir.
[ -f public/hero-alta.mp4 ] || curl -sL -o public/hero-alta.mp4 https://video.wixstatic.com/video/36911e_889c49b7d4f641db949da52b9681358a/file
node captura-web.js
