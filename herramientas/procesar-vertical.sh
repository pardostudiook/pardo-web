#!/bin/bash
# Suma un video vertical a la sección "Contenido" de la web SIN recomprimirlo.
# El dueño sube los videos ya exportados con la calidad que quiere: acá solo se
# copia el original tal cual (se reordena para que empiece a reproducirse rápido).
# Uso: herramientas/procesar-vertical.sh <video-original> <nombre-corto>
# Crea assets/verticales/<nombre-corto>.mp4 (el original) y .jpg (portada).
set -euo pipefail

ORIGEN="${1:?Falta el video de origen}"
NOMBRE="${2:?Falta el nombre corto}"
CARPETA="$(cd "$(dirname "$0")/.." && pwd)/assets/verticales"
mkdir -p "$CARPETA"

TAG=hvc1
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$ORIGEN" | grep -q h264 && TAG=avc1

ffmpeg -v error -y -i "$ORIGEN" -map '0:v:0' -map '0:a?' -c copy -tag:v "$TAG" -movflags +faststart \
  "$CARPETA/$NOMBRE.mp4"

ffmpeg -v error -y -ss 1 -i "$CARPETA/$NOMBRE.mp4" -frames:v 1 -vf "scale=720:-2" -q:v 3 "$CARPETA/$NOMBRE.jpg"

echo "$NOMBRE.mp4 $(( $(stat -f%z "$CARPETA/$NOMBRE.mp4") / 1048576 )) MB"
