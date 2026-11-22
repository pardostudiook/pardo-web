import { Composition, registerRoot } from 'remotion';
import '@fontsource/red-hat-display/400.css';
import '@fontsource/red-hat-display/500.css';
import '@fontsource/red-hat-display/700.css';
import '@fontsource/red-hat-display/900.css';
import { ReelWeb, DURACION } from './ReelWeb';

const Root = () => (
  <Composition id="ReelWeb" component={ReelWeb} durationInFrames={DURACION} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
