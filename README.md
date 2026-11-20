# Web de Pardo Studio

Sitio estático en **HTML, CSS y JavaScript**, publicado con **GitHub Pages**.
No usa frameworks ni pasos de compilación: se edita y se publica tal cual.

## Estructura

| Archivo / carpeta | Qué es |
|---|---|
| `index.html` | Toda la página: estructura (HTML), diseño (CSS, dentro de `<style>`) y funciones (JavaScript, dentro de `<script>`) |
| `data/proyectos.json` | Lista de videos del portfolio (YouTube). Es lo que se actualiza al subir un video nuevo |
| `assets/` | Imágenes, logo y video de fondo |

## Agregar un proyecto al portfolio

Sumar una línea en `data/proyectos.json`:

```json
{ "id": "ID_DE_YOUTUBE", "titulo": "Título", "cliente": "Cliente", "area": "Campañas", "duracion": "01:30" }
```

- `id`: lo que va después de `watch?v=` en el link de YouTube.
- `area`: crea el filtro automáticamente (Campañas, Publicidad, Institucional, Música, Reels…).
- `duracion` es opcional.

## Pendiente antes de publicar en pardostudio.com.ar

- Quitar `<meta name="robots" content="noindex">` de `index.html` (está para que Google no indexe la versión de prueba).
- Conectar el formulario de contacto a Web3Forms.
- Configurar el dominio propio en GitHub Pages y en NIC Argentina.
