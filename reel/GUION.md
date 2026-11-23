# Reel "Estrenamos web": guion de voz

Duración: 38 segundos (escenas ajustadas a la voz de ElevenLabs que está en `voz/`), formato vertical 1080x1920 (Reels, TikTok, Shorts).
El video se entiende sin sonido porque cada escena tiene su texto en pantalla. La voz va arriba, con ritmo tranquilo y cálido, tuteando ("vos").

| Tiempo | Escena (lo que se ve) | Voz |
|---|---|---|
| 0:00 – 0:03 | Cortes rápidos del showreel. Logo + **ESTRENAMOS WEB** | "Pardo estrena web." |
| 0:03 – 0:08 | Celular con la web y **pardostudio.com.ar** | "Entrá a pardostudio punto com punto ar y conocé todo lo que podemos hacer por tu marca." |
| 0:08 – 0:13 | Fondo de bosque: **CONTENT STUDIO** / **POST STUDIO** | "Desde la idea, la estrategia y el rodaje… hasta la postproducción: VFX, color y animación." |
| 0:13 – 0:19 | Showreel + filtros del portfolio (Publicidad, Institucional, Contenido, Videoclips) | "En el portfolio vas a encontrar nuestras campañas publicitarias, institucionales y videoclips." |
| 0:19 – 0:25 | Carrusel de reels de clientes: **Contenido para marcas** | "Y todo el contenido para redes que creamos para marcas como las tuyas." |
| 0:25 – 0:30 | **Trabajemos juntos**: formulario + botón de WhatsApp | "¿Tenés un proyecto? Escribinos desde la web o directo por WhatsApp." |
| 0:30 – 0:34 | Logo PARDO + **pardostudio.com.ar** | "Pardo. Creatividad visual para tu historia." |

## Texto para el posteo

> Estrenamos web 🐻 Ahora podés ver todo lo que hacemos en un solo lugar: servicios, campañas, institucionales, videoclips y el contenido que creamos para marcas. ¿Tenés un proyecto? Escribinos desde la web o por WhatsApp.
> 👉 pardostudio.com.ar

## Cómo grabar la voz

- Grabá cada frase por separado, con el celular cerca de la boca y en un lugar sin eco (un placard con ropa funciona muy bien).
- Si una frase queda larga para su escena, se puede estirar la escena: los tiempos están en `src/ReelWeb.jsx`, en `ESCENAS`.
- Mandá el audio (o un audio por frase) y lo sincronizo con el video, junto con música si tienen una pista con licencia.

## Volver a generar el video

```bash
cd reel
npm install
./preparar.sh          # copia el material de la web y saca la captura del sitio
npm run render         # crea out/reel-web-pardo-h265.mp4 (con la voz de voz/)
```
