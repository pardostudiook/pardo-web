#!/usr/bin/env bash
# Copia a public/ el material de la web que usa el reel y saca la captura de la web.
set -e
cd "$(dirname "$0")"
A=../assets
mkdir -p public/v
cp $A/hero-desktop.mp4 $A/logo.png $A/logo-pardo-vertical.png $A/papel-negro.jpg $A/papel-blanco.jpg $A/bosque.jpg $A/contacto.jpg public/
for v in boulevard-reel-1 pardo-alcance riica-algaria-03 satoshi-pingpong prisamata-05 riica-almora-02 boulevard-reel-3; do cp $A/verticales/$v.mp4 public/v/; done
node captura-web.js
