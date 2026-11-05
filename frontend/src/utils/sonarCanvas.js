/**
 * Procedural Sonar Sonogram Generator & Renderer
 * Produces authentic high-resolution side-scan sonar (SSS) imagery
 * with specular acoustic highlights, outward acoustic shadows, and seabed texture.
 */

export function renderSonarWaterfall(canvas, options = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width || 800;
  const height = canvas.height || 600;

  const {
    invertContrast = false,
    showAcousticShadows = true,
    showGraticule = true,
    claheActive = false,
    showBoundingBoxes = true,
    selectedDetectionId = 'DET-01',
    detections = [],
    zoom = 1,
  } = options;

  // Clear
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Background deep acoustic substrate
  const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
  bgGrad.addColorStop(0, '#424a52');
  bgGrad.addColorStop(0.48, '#707a84');
  bgGrad.addColorStop(0.5, '#12161a'); // Center Nadir track (water column)
  bgGrad.addColorStop(0.52, '#6d7781');
  bgGrad.addColorStop(1, '#3b434a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Generate deterministic acoustic speckle & ripple texture
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Pseudo-random noise seeded
  let seed = 42;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const nadirX = width * 0.5;
  const nadirWidth = width * 0.04;

  for (let y = 0; y < height; y += 2) {
    const sandWave = Math.sin(y * 0.08) * 12 + Math.cos(y * 0.02) * 20;
    for (let x = 0; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      const distFromNadir = Math.abs(x - nadirX);

      let val = 110 + (rnd() - 0.5) * 45;

      // Sand dune ripples
      const ripple = Math.sin((x + sandWave) * 0.05 + y * 0.04) * 18;
      val += ripple;

      // Nadir water column darkness
      if (distFromNadir < nadirWidth) {
        val = 22 + (rnd() - 0.5) * 12;
      } else if (distFromNadir < nadirWidth * 1.6) {
        val *= (distFromNadir - nadirWidth) / (nadirWidth * 0.6);
      }

      // CLAHE boost
      if (claheActive) {
        val = (val - 110) * 1.35 + 120;
      }

      val = Math.max(10, Math.min(245, val));

      if (invertContrast) {
        val = 255 - val;
      }

      // Monochrome acoustic gray/amber
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;

      // Fill 2x2 block for performance
      if (x + 1 < width) {
        const nextIdx = idx + 4;
        data[nextIdx] = val;
        data[nextIdx + 1] = val;
        data[nextIdx + 2] = val;
        data[nextIdx + 3] = 255;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // --- Draw Container Anomaly (#DET-01) ---
  const contX = width * 0.53;
  const contY = height * 0.42;
  const contW = width * 0.14;
  const contH = height * 0.18;

  // 1. Acoustic Shadow (casts toward starboard, angle ~42 deg)
  if (showAcousticShadows) {
    ctx.save();
    ctx.fillStyle = invertContrast ? 'rgba(235, 235, 235, 0.95)' : 'rgba(12, 16, 20, 0.94)';
    ctx.beginPath();
    ctx.moveTo(contX + contW * 0.4, contY + contH * 0.2);
    ctx.lineTo(contX - contW * 0.7, contY - contH * 0.4);
    ctx.lineTo(contX - contW * 0.2, contY + contH * 0.1);
    ctx.lineTo(contX + contW * 0.2, contY + contH * 0.8);
    ctx.closePath();
    ctx.fill();

    // Shadow length indicator label
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f5a623';
    ctx.fillText('SHADOW: 8.9m', contX - contW * 0.6, contY + contH * 0.95);
    ctx.restore();
  }

  // 2. Specular Metallic Reflection Highlight
  ctx.save();
  const highlightGrad = ctx.createLinearGradient(contX, contY, contX + contW, contY + contH);
  if (invertContrast) {
    highlightGrad.addColorStop(0, '#101010');
    highlightGrad.addColorStop(0.5, '#202020');
    highlightGrad.addColorStop(1, '#050505');
  } else {
    highlightGrad.addColorStop(0, '#ffffff');
    highlightGrad.addColorStop(0.3, '#f0f5ff');
    highlightGrad.addColorStop(0.7, '#d5e0ea');
    highlightGrad.addColorStop(1, '#9aa5b0');
  }
  ctx.fillStyle = highlightGrad;

  // Container angular shape
  ctx.beginPath();
  ctx.moveTo(contX, contY + contH * 0.15);
  ctx.lineTo(contX + contW * 0.75, contY);
  ctx.lineTo(contX + contW, contY + contH * 0.75);
  ctx.lineTo(contX + contW * 0.25, contY + contH);
  ctx.closePath();
  ctx.fill();

  // Internal corrugation lines (shipping container ribs)
  ctx.strokeStyle = invertContrast ? '#ffffff' : '#4b5563';
  ctx.lineWidth = 1.5;
  for (let r = 0.2; r < 0.8; r += 0.15) {
    ctx.beginPath();
    ctx.moveTo(contX + contW * r, contY + contH * (0.15 + r * 0.3));
    ctx.lineTo(contX + contW * (r + 0.2), contY + contH * (0.6 + r * 0.3));
    ctx.stroke();
  }
  ctx.restore();

  // --- Draw Ghost Net Anomaly (#DET-02) ---
  const netX = width * 0.58;
  const netY = height * 0.39;
  const netW = width * 0.12;
  const netH = height * 0.22;

  ctx.save();
  ctx.fillStyle = invertContrast ? 'rgba(40, 40, 40, 0.45)' : 'rgba(230, 245, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(netX + netW * 0.5, netY + netH * 0.5, netW * 0.45, netH * 0.45, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Fibrous tangled lines
  ctx.strokeStyle = invertContrast ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(netX + netW * 0.3 + i * 4, netY + netH * 0.4 + i * 6, 12 + i * 2, 0, Math.PI * 1.5);
    ctx.stroke();
  }
  ctx.restore();

  // --- Graticule Overlay (Grid + Scale) ---
  if (showGraticule) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.14)';
    ctx.lineWidth = 1;

    // Horizontal swath lines
    for (let gy = 40; gy < height; gy += 60) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Vertical range lines
    for (let gx = 50; gx < width; gx += 80) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }

    // Center nadir dashed line
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    ctx.beginPath();
    ctx.moveTo(nadirX, 0);
    ctx.lineTo(nadirX, height);
    ctx.stroke();
    ctx.restore();
  }

  // --- Bounding Boxes & HUD Markers ---
  if (showBoundingBoxes) {
    // 1. Container Box (#DET-01)
    const isDet01Focused = selectedDetectionId === 'DET-01';
    ctx.save();
    ctx.lineWidth = isDet01Focused ? 2 : 1.5;
    ctx.strokeStyle = '#f5a623'; // Gold border as in Pic 1
    ctx.strokeRect(contX - 10, contY - 20, contW + 25, contH + 45);

    // Header badge
    ctx.fillStyle = '#f5a623';
    ctx.fillRect(contX - 10, contY - 38, 195, 18);
    ctx.fillStyle = '#051322';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('• [DET-01: CONTAINER // 94.2%]', contX - 6, contY - 25);

    // Corner brackets
    drawBrackets(ctx, contX - 10, contY - 20, contW + 25, contH + 45, '#f5a623');
    ctx.restore();

    // 2. Ghost Net Box (#DET-02)
    const isDet02Focused = selectedDetectionId === 'DET-02';
    ctx.save();
    ctx.lineWidth = isDet02Focused ? 2 : 1.5;
    ctx.strokeStyle = '#00f2fe'; // Cyan border
    ctx.strokeRect(netX - 8, netY - 10, netW + 15, netH + 20);

    // Header badge
    ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
    ctx.fillRect(netX - 8, netY - 26, 110, 16);
    ctx.fillStyle = '#051322';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('[DET-02: GHOST NET]', netX - 4, netY - 14);

    drawBrackets(ctx, netX - 8, netY - 10, netW + 15, netH + 20, '#00f2fe');
    ctx.restore();
  }

  ctx.restore();
}

function drawBrackets(ctx, x, y, w, h, color) {
  const len = 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + len);
  ctx.lineTo(x, y);
  ctx.lineTo(x + len, y);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + len);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - len);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + len, y + h);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - len);
  ctx.stroke();
}
