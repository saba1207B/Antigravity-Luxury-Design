/* ═══════════════════════════════════════════════════════════════
   ANTIGRAVITY — BENTO CARD INTERACTIONS
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Material Switcher ───
  const MATERIALS = {
    obsidian:  { label: 'Obsidian Ceramic',  hue: 0,   saturation: 0,  brightness: 1 },
    titanium:  { label: 'Brushed Titanium',  hue: 30,  saturation: -0.3, brightness: 1.3 },
    gold:      { label: 'Champagne Gold',    hue: 45,  saturation: 0.2,  brightness: 1.15 },
  };

  function initMaterialSwitcher() {
    const switcher = document.getElementById('material-switcher');
    if (!switcher) return;

    const swatches = switcher.querySelectorAll('.material-swatch');
    const label = document.getElementById('material-label');
    const image = document.getElementById('material-image');

    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const material = swatch.dataset.material;
        const config = MATERIALS[material];
        if (!config) return;

        // Update active state
        swatches.forEach(s => s.classList.remove('is-active'));
        swatch.classList.add('is-active');

        // Update label
        if (label) label.textContent = config.label;

        // Apply image filter for material feel
        if (image) {
          image.style.filter = `hue-rotate(${config.hue}deg) saturate(${1 + config.saturation}) brightness(${config.brightness})`;
          image.style.transform = 'scale(1.02)';
          setTimeout(() => {
            image.style.transform = 'scale(1)';
          }, 300);
        }
      });
    });
  }

  // ─── Frequency Tuner ───
  function initFrequencyTuner() {
    const slider = document.getElementById('freq-slider');
    const display = document.getElementById('freq-value');
    const stability = document.getElementById('telemetry-stability');
    const phase = document.getElementById('telemetry-phase');

    if (!slider || !display) return;

    slider.addEventListener('input', () => {
      const value = parseFloat(slider.value);
      display.textContent = value.toFixed(3);

      // Calculate stability based on proximity to 40kHz
      const deviation = Math.abs(value - 40);
      const stabilityPercent = Math.max(0, (100 - deviation * 25)).toFixed(1);

      if (stability) stability.textContent = stabilityPercent + '%';
      if (phase) {
        phase.textContent = deviation < 0.5 ? 'Engaged' : deviation < 1 ? 'Seeking' : 'Unstable';
        phase.style.color = deviation < 0.5
          ? 'var(--color-gold-champagne)'
          : deviation < 1
            ? 'rgba(255,255,255,0.6)'
            : 'var(--color-error)';
      }
    });
  }

  // ─── Waveform Bars ───
  function initWaveform() {
    const container = document.getElementById('waveform');
    if (!container) return;

    const barCount = 32;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'waveform-bar';
      bar.style.animationDelay = `${(i / barCount) * 6}s`;
      bar.style.height = `${Math.random() * 60 + 20}%`;
      container.appendChild(bar);
    }
  }

  // ─── Live Sensor Simulation ───
  function initSensorReadouts() {
    const temp = document.getElementById('sensor-temp');
    const humidity = document.getElementById('sensor-humidity');
    const pressure = document.getElementById('sensor-pressure');
    const vibration = document.getElementById('sensor-vibration');

    if (!temp) return;

    function updateSensors() {
      const t = (21 + (Math.random() - 0.5) * 0.6).toFixed(1);
      const h = Math.round(42 + (Math.random() - 0.5) * 4);
      const p = Math.round(1013 + (Math.random() - 0.5) * 3);
      const v = (0.02 + (Math.random() - 0.5) * 0.01).toFixed(3);

      if (temp) temp.textContent = t + '°';
      if (humidity) humidity.textContent = h + '%';
      if (pressure) pressure.textContent = p;
      if (vibration) vibration.textContent = v;
    }

    setInterval(updateSensors, 3000);
  }

  // ─── Init All ───
  function init() {
    initMaterialSwitcher();
    initFrequencyTuner();
    initWaveform();
    initSensorReadouts();
  }

  window.AntigravityBento = { init };
})();
