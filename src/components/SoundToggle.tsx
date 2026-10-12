import { Volume2, VolumeX } from 'lucide-react';
import { setSoundEnabled, useSoundEnabled } from '../hooks/useSound';

/* Sound is off until the visitor asks for it; the choice is remembered. */
const SoundToggle = () => {
  const on = useSoundEnabled();

  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={on}
      onClick={() => setSoundEnabled(!on)}
    >
      {on ? <Volume2 size={13} aria-hidden="true" /> : <VolumeX size={13} aria-hidden="true" />}
      <span>Sound {on ? 'on' : 'off'}</span>
    </button>
  );
};

export default SoundToggle;
