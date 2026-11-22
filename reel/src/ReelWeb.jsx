// Reel vertical (1080x1920) que presenta la nueva web de Pardo Studio.
// Usa solo material de la web: showreel de portada, reels de clientes, texturas, logo y capturas.
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, Series, staticFile,
  interpolate, spring, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';

const NEGRO = '#0b0a0b';
const ROJO = '#c4161c';
const BLANCO = '#ffffff';
const SUAVE = '#c9c6c9';
const FUENTE = '"Red Hat Display", system-ui, sans-serif';

// Duración de cada escena (en cuadros, 30 por segundo). Coinciden con el guion de voz.
export const ESCENAS = {
  gancho: 105,     // 0:00 – 0:03.5
  web: 135,        // 0:03.5 – 0:08
  servicios: 150,  // 0:08 – 0:13
  portfolio: 180,  // 0:13 – 0:19
  redes: 180,      // 0:19 – 0:25
  contacto: 150,   // 0:25 – 0:30
  cierre: 120,     // 0:30 – 0:34
};
export const DURACION = Object.values(ESCENAS).reduce((a, b) => a + b, 0);

// ---------- piezas comunes ----------

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const tramo = (f, a, b, de = 0, a2 = 1) =>
  interpolate(f, [a, b], [de, a2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

const Papel = ({ oscurecer = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: NEGRO }}>
    <Img src={staticFile('papel-negro.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    {oscurecer > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${oscurecer})` }} />}
  </AbsoluteFill>
);

// Textura de papel apenas visible sobre los videos, para que todo el reel tenga la misma piel.
const PielPapel = () => (
  <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.18, pointerEvents: 'none' }}>
    <Img src={staticFile('papel-negro.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
);

// Barrido rojo al entrar a cada escena.
const Barrido = () => {
  const f = useCurrentFrame();
  const x = tramo(f, 0, 9, 0, 105);
  if (f > 10) return null;
  return <AbsoluteFill style={{ backgroundColor: ROJO, transform: `translateX(${x}%)` }} />;
};

// Texto que sube y aparece.
const Sube = ({ desde = 0, children, style }) => {
  const f = useCurrentFrame();
  const p = tramo(f, desde, desde + 14);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 60}px)`, ...style }}>{children}</div>
  );
};

const Etiqueta = ({ children, style }) => (
  <span style={{
    display: 'inline-block', background: ROJO, color: BLANCO, fontFamily: FUENTE, fontWeight: 700,
    fontSize: 38, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '12px 26px', ...style,
  }}>{children}</span>
);

const Calado = ({ children, size }) => (
  <span style={{ color: 'transparent', WebkitTextStroke: `${Math.max(2, size / 40)}px ${BLANCO}` }}>{children}</span>
);

const Titular = ({ children, size = 150, style }) => (
  <div style={{
    fontFamily: FUENTE, fontWeight: 900, fontSize: size, lineHeight: 0.92, color: BLANCO,
    letterSpacing: '-0.01em', textTransform: 'uppercase', ...style,
  }}>{children}</div>
);

// Plano del showreel original de Wix (1600x1080) dentro de una franja.
// La franja mide FRANJA_ALTO de alto, así el video se agranda solo ~1,1 veces
// en vez de 1,8 veces que haría falta para llenar toda la pantalla vertical.
const FRANJA_ALTO = 1200;
const Plano = ({ segundo, top = 360, alto = FRANJA_ALTO }) => {
  const f = useCurrentFrame();
  const z = 1 + f * 0.0012;
  const anchoVideo = Math.round(alto * (1600 / 1080));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: alto, overflow: 'hidden', backgroundColor: NEGRO }}>
      <OffthreadVideo
        src={staticFile('hero-alta.mp4')}
        startFrom={Math.round(segundo * 30)}
        muted
        style={{ position: 'absolute', top: 0, left: (1080 - anchoVideo) / 2, width: anchoVideo, height: alto, transform: `scale(${z})` }}
      />
    </div>
  );
};

// Clip vertical de cliente (720x1280) en una tarjeta de 864x1536: se agranda solo 1,2 veces.
const PlanoVertical = ({ archivo, segundo }) => {
  const f = useCurrentFrame();
  const z = 1 + f * 0.0015;
  return (
    <div style={{
      position: 'absolute', left: 108, top: 150, width: 864, height: 1536, borderRadius: 44, overflow: 'hidden',
      backgroundColor: NEGRO, boxShadow: '0 40px 100px rgba(0,0,0,.6)',
    }}>
      <OffthreadVideo
        src={staticFile(`v/${archivo}.mp4`)}
        startFrom={Math.round(segundo * 30)}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})` }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.75) 100%)' }} />
    </div>
  );
};

// Bordes de la franja que se funden con el papel.
const FundidoFranja = ({ top, alto = FRANJA_ALTO, fuerza = 0.9 }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, top, height: alto,
    background: `linear-gradient(180deg, rgba(11,10,11,${fuerza}) 0%, rgba(11,10,11,0) 14%, rgba(11,10,11,0) 70%, rgba(11,10,11,${fuerza}) 100%)`,
  }} />
);

// Celular con la web adentro. "scroll" está en píxeles de la captura (que es a 2x).
const ANCHO_CAPTURA = 780;
const Celular = ({ scroll, ancho = 720, style, conVideo = false, videoDesde = 0 }) => {
  const borde = 16;
  const interior = ancho - borde * 2;
  const alto = Math.round(interior * (844 / 390));
  const k = interior / ANCHO_CAPTURA;
  return (
    <div style={{
      width: ancho, height: alto + borde * 2, borderRadius: 96, background: '#1b191b', padding: borde,
      boxShadow: '0 50px 120px rgba(0,0,0,.65), inset 0 0 0 3px #2c2a2c', ...style,
    }}>
      <div style={{ position: 'relative', width: interior, height: alto, borderRadius: 80, overflow: 'hidden', background: NEGRO }}>
        <Img src={staticFile('web.png')} style={{ position: 'absolute', left: 0, top: -scroll * k, width: interior }} />
        {conVideo && (
          // Portada "andando": el video de fondo real de la web, con los textos y el botón encima.
          <div style={{ position: 'absolute', left: 0, top: -scroll * k, width: interior, height: alto, overflow: 'hidden', background: NEGRO }}>
            <OffthreadVideo src={staticFile('hero-movil.mp4')} startFrom={Math.round(videoDesde * 30)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Img src={staticFile('hero-capa.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          </div>
        )}
        <div style={{ position: 'absolute', top: 18, left: '50%', width: 190, height: 52, marginLeft: -95, borderRadius: 30, background: '#000' }} />
      </div>
    </div>
  );
};

// Cursor con forma de garra de oso. La punta de la garra del medio es el punto que "clickea".
const GARRA_PUNTA = { x: 62, y: 6 };
const CursorGarra = ({ x, y, apretando = 0, opacidad = 1 }) => (
  <div style={{
    position: 'absolute', left: x - GARRA_PUNTA.x, top: y - GARRA_PUNTA.y, width: 124, height: 150, opacity: opacidad,
    transform: `rotate(-14deg) scale(${1 - 0.14 * apretando})`, transformOrigin: `${GARRA_PUNTA.x}px ${GARRA_PUNTA.y}px`,
    filter: 'drop-shadow(0 10px 18px rgba(0,0,0,.55))',
  }}>
    <svg width="124" height="150" viewBox="0 0 124 150">
      <g fill={BLANCO} stroke={NEGRO} strokeWidth="5" strokeLinejoin="round">
        {/* garras */}
        <path d="M62 6 C56 16 55 26 57 34 L67 34 C69 26 68 16 62 6 Z" />
        <path d="M30 22 C26 32 27 41 31 48 L40 44 C39 36 36 29 30 22 Z" />
        <path d="M94 22 C98 32 97 41 93 48 L84 44 C85 36 88 29 94 22 Z" />
        <path d="M8 52 C8 62 11 70 17 75 L24 68 C20 62 15 57 8 52 Z" />
        {/* dedos */}
        <ellipse cx="62" cy="46" rx="15" ry="18" />
        <ellipse cx="36" cy="57" rx="13" ry="16" transform="rotate(-18 36 57)" />
        <ellipse cx="88" cy="57" rx="13" ry="16" transform="rotate(18 88 57)" />
        <ellipse cx="20" cy="84" rx="12" ry="14" transform="rotate(-40 20 84)" />
        {/* almohadilla */}
        <path d="M62 78 C86 78 104 96 104 116 C104 136 88 144 74 140 C68 138 66 136 62 136 C58 136 56 138 50 140 C36 144 20 136 20 116 C20 96 38 78 62 78 Z" />
      </g>
    </svg>
  </div>
);

// Onda que se expande donde clickea la garra.
const Click = ({ x, y, desde }) => {
  const f = useCurrentFrame();
  const p = tramo(f, desde, desde + 14);
  if (f < desde || p >= 1) return null;
  const r = 20 + 90 * p;
  return (
    <div style={{
      position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%',
      border: `6px solid ${ROJO}`, opacity: 1 - p,
    }} />
  );
};

const IconoWhatsapp = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={BLANCO} aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.4-1.7A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.6-8.4z" />
  </svg>
);

const URL_WEB = 'pardostudio.com.ar';

// ---------- escenas ----------

// 1. Gancho: cortes rápidos del showreel + "Estrenamos web".
const Gancho = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Tomas verticales de clientes (archivo, segundo, cuadros). Sin subtítulos encima.
  // Prisamata (chica del sombrero) solo en dos planos: abre caminando y cierra en primer plano.
  const cortes = [
    ['prisamata-05', 17.0, 22],     // caminando entre las plantas
    ['boulevard-reel-2', 3.75, 16], // Casino Boulevard: agarra la ficha y la muestra
    ['videocaso-01', 1.5, 15],      // Agéntica: dron sobre el edificio
    ['videocaso-01', 23.3, 14],     // Agéntica: Camila sentada (toma final, sin cartel)
    ['riica-almora-03', 22.5, 13],  // RIICA: caminando en el campo
    ['prisamata-05', 9.6, 62],      // primer plano con sombrero, detrás del título
  ];
  const inicios = cortes.reduce((acc, c, i) => [...acc, i === 0 ? 0 : acc[i - 1] + cortes[i - 1][2]], []);
  const s = spring({ frame: f - 22, fps, config: { damping: 14, mass: 0.7 } });
  return (
    <AbsoluteFill>
      <Papel />
      {cortes.map(([archivo, seg, dur], i) => (
        <Sequence key={i} from={inicios[i]} durationInFrames={dur}>
          <PlanoVertical archivo={archivo} segundo={seg} />
        </Sequence>
      ))}
      <PielPapel />
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <Img src={staticFile('logo.png')} style={{ position: 'absolute', top: 36, width: 104, opacity: tramo(f, 2, 12) }} />
        <div style={{ position: 'absolute', top: 1380, transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.4), textAlign: 'center' }}>
          <Titular size={126}>Estrenamos</Titular>
          <Titular size={230} style={{ marginTop: 6 }}><Calado size={230}>web</Calado></Titular>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2. La web en el celular, con la dirección.
const Web = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: f - 6, fps, config: { damping: 18 } });
  const TAP = 58;
  const scroll = interpolate(f, [TAP + 6, TAP + 50], [0, 1688], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  // Pantalla del celular ya acomodado: arranca en (196, 486) y la captura va a escala k.
  const k = 688 / ANCHO_CAPTURA;
  const tap = { x: 196 + 390 * k, y: 486 + 1336 * k };
  // La garra entra desde abajo a la derecha, va al botón "Conocé todo lo que podemos hacer", clickea y se corre un poco.
  const ir = tramo(f, 30, TAP - 2);
  const despues = tramo(f, TAP + 8, TAP + 40);
  const garra = f < TAP
    ? { x: interpolate(ir, [0, 1], [1010, tap.x]), y: interpolate(ir, [0, 1], [1900, tap.y]) }
    : { x: tap.x + 150 * despues, y: tap.y - 160 * despues };
  const apretando = interpolate(f, [TAP - 3, TAP, TAP + 5], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacidad = Math.min(tramo(f, 30, 38), 1 - tramo(f, 118, 130));
  return (
    <AbsoluteFill>
      <Papel />
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
        <Sube desde={4}><div style={{ fontFamily: FUENTE, fontWeight: 500, fontSize: 40, letterSpacing: '0.22em', color: SUAVE, textTransform: 'uppercase' }}>Nuestra nueva web</div></Sube>
        <Sube desde={10} style={{ marginTop: 26 }}><Etiqueta style={{ fontSize: 52, letterSpacing: '0.02em', textTransform: 'none', padding: '16px 34px' }}>{URL_WEB}</Etiqueta></Sube>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <Celular scroll={scroll} conVideo videoDesde={17.5} style={{ marginTop: 470 + (1 - entra) * 1300, transform: `rotate(${(1 - entra) * 6}deg)` }} />
      </AbsoluteFill>
      <Click x={tap.x} y={tap.y} desde={TAP} />
      <CursorGarra x={garra.x} y={garra.y} apretando={apretando} opacidad={opacidad} />
      <Barrido />
    </AbsoluteFill>
  );
};

// 3. Servicios: Content Studio / Post Studio, como en la web.
const Servicios = () => {
  const f = useCurrentFrame();
  const bloque = (desde, a, b, texto) => (
    <div style={{ textAlign: 'center' }}>
      <Sube desde={desde}><Titular size={170}>{a}</Titular></Sube>
      <Sube desde={desde + 5}><Titular size={170}><Calado size={170}>{b}</Calado></Titular></Sube>
      <Sube desde={desde + 12}>
        <div style={{ fontFamily: FUENTE, fontWeight: 400, fontSize: 46, lineHeight: 1.35, color: SUAVE, maxWidth: 880, margin: '28px auto 0' }}>{texto}</div>
      </Sube>
    </div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img src={staticFile('bosque.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.05 + f * 0.0012})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,.62)' }} />
      <PielPapel />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 120 }}>
        <Sube desde={2} style={{ position: 'absolute', top: 190 }}><Etiqueta>Servicios</Etiqueta></Sube>
        {bloque(8, 'Content', 'Studio', 'Dirección creativa, estrategia y producción de contenido.')}
        {bloque(60, 'Post', 'Studio', 'VFX, color grading, compositing y animación 2D y 3D.')}
      </AbsoluteFill>
      <Barrido />
    </AbsoluteFill>
  );
};

// 4. Portfolio: publicidad, institucional, videoclips — con los filtros de la web.
const Portfolio = () => {
  const f = useCurrentFrame();
  // Tomas del showreel: app de RIU, Medicenter, recital, RIU, sirena/yeti, llamas.
  // Sin Satoshi Tango (42,5–44,5 s) ni Descoqueo (7,5 s y 35,5–38,5 s).
  const cortes = [46.4, 22.4, 12.6, 8.4, 30.0, 40.0];
  const largo = 30;
  const top = 600;
  const alto = 1040;
  const filtros = ['Publicidad', 'Institucional', 'Contenido', 'Videoclips'];
  const activo = Math.min(filtros.length - 1, Math.floor(Math.max(0, f - 20) / 38));
  return (
    <AbsoluteFill>
      <Papel />
      {cortes.map((seg, i) => (
        <Sequence key={i} from={i * largo} durationInFrames={largo}>
          <Plano segundo={seg} top={top} alto={alto} />
        </Sequence>
      ))}
      <FundidoFranja top={top} alto={alto} fuerza={0.6} />
      <PielPapel />
      <AbsoluteFill style={{ padding: '170px 70px 0' }}>
        <Sube desde={4}><Titular size={150} style={{ textTransform: 'none', letterSpacing: '-0.02em' }}>Portfolio</Titular></Sube>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 44 }}>
          {filtros.map((t, i) => (
            <Sube key={t} desde={10 + i * 4}>
              <div style={{
                fontFamily: FUENTE, fontWeight: 500, fontSize: 42, color: BLANCO, padding: '18px 40px', borderRadius: 999,
                border: `3px solid ${i === activo ? ROJO : 'rgba(255,255,255,.75)'}`,
                background: i === activo ? ROJO : 'rgba(0,0,0,.25)',
              }}>{t}</div>
            </Sube>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'flex-end', padding: '0 70px 100px' }}>
        <Sube desde={24}>
          <div style={{ fontFamily: FUENTE, fontWeight: 700, fontSize: 64, lineHeight: 1.12, color: BLANCO }}>
            Campañas, institucionales<br />y videoclips que hicimos.
          </div>
        </Sube>
      </AbsoluteFill>
      <Barrido />
    </AbsoluteFill>
  );
};

// 5. Contenido para marcas: carrusel de reels de clientes.
const REELS = ['boulevard-reel-1', 'riica-algaria-03', 'prisamata-11', 'pardo-alcance', 'prisamata-01', 'riica-almora-02', 'boulevard-reel-3'];
const Redes = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ancho = 560;
  const gap = 40;
  const entra = spring({ frame: f - 4, fps, config: { damping: 20 } });
  const x = 260 - f * 7.2 + (1 - entra) * 900;
  return (
    <AbsoluteFill>
      <Papel />
      <AbsoluteFill style={{ padding: '170px 70px 0' }}>
        <Sube desde={4}><Titular size={128} style={{ textTransform: 'none', letterSpacing: '-0.02em', lineHeight: 0.98 }}>Contenido para marcas</Titular></Sube>
        <Sube desde={12}><div style={{ fontFamily: FUENTE, fontSize: 46, color: SUAVE, marginTop: 22 }}>Lo que creamos para redes de nuestros clientes.</div></Sube>
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 700, left: 0, display: 'flex', gap, transform: `translateX(${x}px)` }}>
        {REELS.map((r, i) => (
          <div key={r} style={{ width: ancho, height: Math.round(ancho * 16 / 9), borderRadius: 40, overflow: 'hidden', flexShrink: 0, background: '#161416', boxShadow: '0 30px 70px rgba(0,0,0,.55)' }}>
            <OffthreadVideo src={staticFile(`v/${r}.mp4`)} startFrom={30 + i * 15} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
      <Barrido />
    </AbsoluteFill>
  );
};

// 6. Contacto: formulario de la web y WhatsApp.
const Contacto = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame: f - 10, fps, config: { damping: 18 } });
  const wa = spring({ frame: f - 62, fps, config: { damping: 11, mass: 0.6 } });
  const scroll = interpolate(f, [20, 120], [14546, 15420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img src={staticFile('contacto.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,.55)' }} />
      <PielPapel />
      <AbsoluteFill style={{ padding: '160px 70px 0' }}>
        <Sube desde={4}><Titular size={150} style={{ textTransform: 'none', letterSpacing: '-0.02em', lineHeight: 0.96 }}>Trabajemos<br />juntos</Titular></Sube>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <Celular scroll={scroll} ancho={640} style={{ marginTop: 560 + (1 - entra) * 1300 }} />
      </AbsoluteFill>
      <div style={{
        position: 'absolute', left: '50%', bottom: 170, transform: `translateX(-50%) scale(${wa})`, opacity: Math.min(1, wa * 1.5),
        display: 'flex', alignItems: 'center', gap: 24, background: '#25d366', borderRadius: 999, padding: '26px 48px 26px 34px',
        boxShadow: '0 24px 60px rgba(0,0,0,.5)', whiteSpace: 'nowrap',
      }}>
        <IconoWhatsapp size={66} />
        <span style={{ fontFamily: FUENTE, fontWeight: 700, fontSize: 50, color: BLANCO }}>Escribinos por WhatsApp</span>
      </div>
      <Barrido />
    </AbsoluteFill>
  );
};

// 7. Cierre: logo, frase y dirección.
const Cierre = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 6, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <Papel />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Img src={staticFile('logo-pardo-vertical.png')} style={{ width: 640, transform: `scale(${0.8 + 0.2 * s})`, opacity: s }} />
        <Sube desde={22} style={{ marginTop: 56 }}>
          <div style={{ fontFamily: FUENTE, fontWeight: 500, fontSize: 54, color: BLANCO, textAlign: 'center' }}>Creatividad visual para tu historia</div>
        </Sube>
        <Sube desde={34} style={{ marginTop: 70 }}>
          <Etiqueta style={{ fontSize: 56, letterSpacing: '0.02em', textTransform: 'none', padding: '18px 38px' }}>{URL_WEB}</Etiqueta>
        </Sube>
      </AbsoluteFill>
      <Barrido />
    </AbsoluteFill>
  );
};

export const ReelWeb = () => (
  <AbsoluteFill style={{ backgroundColor: NEGRO, fontFamily: FUENTE }}>
    <Series>
      <Series.Sequence durationInFrames={ESCENAS.gancho}><Gancho /></Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.web}><Web /></Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.servicios}><Servicios /></Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.portfolio}><Portfolio /></Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.redes}><Redes /></Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.contacto}><Contacto /></Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.cierre}><Cierre /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
