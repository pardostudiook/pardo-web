#!/bin/bash
# Prepara un video vertical para la sección "Contenido" de la web.
# Uso: herramientas/procesar-vertical.sh <video-original> <nombre-corto>
# Crea assets/verticales/<nombre-corto>.mp4 (liviano, 720px de ancho máx.)
# y assets/verticales/<nombre-corto>.jpg (imagen de portada).
set -euo pipefail

ORIGEN="${1:?Falta el video de origen}"
NOMBRE="${2:?Falta el nombre corto}"
CARPETA="$(cd "$(dirname "$0")/.." && pwd)/assets/verticales"
mkdir -p "$CARPETA"

ffmpeg -v error -y -i "$ORIGEN" \
  -vf "scale='min(720,iw)':-2:flags=lanczos,fps=30" \
  -c:v libx264 -crf 27 -preset slow -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 96k -ac 2 -movflags +faststart \
  "$CARPETA/$NOMBRE.mp4"

ffmpeg -v error -y -ss 1 -i "$CARPETA/$NOMBRE.mp4" -frames:v 1 -q:v 4 "$CARPETA/$NOMBRE.jpg"

echo "$NOMBRE.mp4 $(( $(stat -f%z "$CARPETA/$NOMBRE.mp4") / 1024 )) KB"
