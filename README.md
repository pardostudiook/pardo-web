# Web de Pardo Studio

Sitio estático en **HTML, CSS y JavaScript**, publicado con **GitHub Pages**.
No usa frameworks ni pasos de compilación: se edita y se publica tal cual.

## Estructura

| Archivo / carpeta | Qué es |
|---|---|
| `index.html` | Toda la página: estructura (HTML), diseño (CSS, dentro de `<style>`) y funciones (JavaScript, dentro de `<script>`) |
| `data/proyectos.json` | Lista de videos del portfolio (YouTube). Es lo que se actualiza al subir un video nuevo |
| `data/contenido.json` | Videos verticales de "Contenido para marcas" (archivos en `assets/verticales/`) |
| `data/equipo.json` | Integrantes del equipo |
| `herramientas/procesar-vertical.sh` | Comprime un video vertical para la web y crea su portada |
| `assets/` | Imágenes, logo y video de fondo |

## Agregar un proyecto al portfolio

Sumar una línea en `data/proyectos.json`:

```json
{ "id": "ID_DE_YOUTUBE", "titulo": "Título", "cliente": "Cliente", "area": "Campañas", "duracion": "01:30" }
```

- `id`: lo que va después de `watch?v=` en el link de YouTube.
- `area`: crea el filtro automáticamente (Campañas, Publicidad, Institucional, Música, Reels…).
- `duracion` es opcional.

## Fotos del equipo

Van en `assets/equipo/` y se cargan en `data/equipo.json` con el campo `"foto"`.
La web las muestra en blanco y negro dentro de un círculo con aro rojo, así que conviene una foto **cuadrada**,
de pecho para arriba y con la cara al centro (si viene en otro formato, se recorta al centro).
Quien no tiene `"foto"` aparece con una silueta en el mismo círculo.

## Dominio

- `pardostudio.com.ar` está registrado en NIC Argentina (vence el 19/02/2027) y delegado a Cloudflare (DNS).
- En Cloudflare: 4 registros A a GitHub Pages (185.199.108-111.153) y `www` como CNAME a `pardostudiook.github.io`, sin proxy.
- El archivo `CNAME` de este repositorio le indica a GitHub Pages el dominio.
