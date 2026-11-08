import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import './AccessibilityPanel.css';

const PreferenceButton = ({ icon, label, active, onClick }) => (
  <button className={`a11y-choice ${active ? 'active' : ''}`} type="button" aria-pressed={active} onClick={onClick}>
    <i className={`bi ${icon}`} aria-hidden="true" />
    <span>{label}</span>
  </button>
);

const AccessibilityPanel = () => {
  const [open, setOpen] = useState(false);
  const opener = useRef(null);
  const { preferences, setPreference, resetPreferences } = useAccessibility();
  const close = () => { setOpen(false); opener.current?.focus(); };

  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && open && close();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return <>
    <button ref={opener} className="a11y-trigger" type="button" aria-expanded={open} aria-controls="accessibility-panel" onClick={() => setOpen(true)}>
      <i className="bi bi-universal-access" aria-hidden="true" /> Accesibilidad
    </button>
    {open && <button className="a11y-backdrop" aria-label="Cerrar accesibilidad" onClick={close} />}
    <aside id="accessibility-panel" className={`a11y-panel ${open ? 'open' : ''}`} aria-hidden={!open} aria-label="Preferencias de accesibilidad">
      <header><div><i className="bi bi-universal-access" aria-hidden="true" /><strong>Accesibilidad</strong><span>Preferencias de visualización</span></div><button type="button" aria-label="Cerrar" onClick={close}><i className="bi bi-x-lg" aria-hidden="true" /></button></header>
      <div className="a11y-body">
        <div className="a11y-grid">
          <PreferenceButton icon="bi-sun" label="Modo claro" active={preferences.theme === 'light'} onClick={() => setPreference('theme', 'light')} />
          <PreferenceButton icon="bi-moon-stars" label="Modo oscuro" active={preferences.theme === 'dark'} onClick={() => setPreference('theme', 'dark')} />
          <PreferenceButton icon="bi-circle-half" label="Alto contraste" active={preferences.highContrast} onClick={() => setPreference('highContrast', !preferences.highContrast)} />
          <PreferenceButton icon="bi-fonts" label="Texto ampliado" active={preferences.largeText} onClick={() => setPreference('largeText', !preferences.largeText)} />
        </div>
        <button className="a11y-row" type="button" aria-pressed={preferences.reduceMotion} onClick={() => setPreference('reduceMotion', !preferences.reduceMotion)}><i className="bi bi-pause-circle" aria-hidden="true" /> Pausar animaciones</button>
        <button className="a11y-row" type="button" aria-pressed={preferences.readableFont} onClick={() => setPreference('readableFont', !preferences.readableFont)}><i className="bi bi-type" aria-hidden="true" /> Fuente de lectura</button>
        <button className="a11y-reset" type="button" onClick={resetPreferences}><i className="bi bi-arrow-counterclockwise" aria-hidden="true" /> Restablecer</button>
      </div>
    </aside>
  </>;
};

export default AccessibilityPanel;
