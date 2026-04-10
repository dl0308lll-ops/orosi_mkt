const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

body.classList.add("js-ready");

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const seeded = (value) => {
  const next = Math.sin(value * 127.1) * 43758.5453123;
  return next - Math.floor(next);
};

if (navToggle && siteNav) {
  const closeMenu = () => {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) {
      return;
    }

    if (siteNav.contains(event.target) || navToggle.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("[data-nav-link]").forEach((link) => {
  const targetPage = new URL(link.href, window.location.href).pathname.split("/").pop() || "index.html";
  if (targetPage === currentPage) {
    link.classList.add("is-current");
  }
});

const growthHero = document.querySelector("[data-growth-hero]");
const growthCanvas = document.querySelector("[data-growth-canvas]");

if (growthHero && growthCanvas) {
  const context = growthCanvas.getContext("2d");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (context) {
    const ambientParticles = Array.from({ length: 28 }, (_, index) => ({
      seed: index + 1,
      x: seeded(index * 7.91),
      y: seeded(index * 15.43),
      drift: 0.35 + seeded(index * 3.17) * 0.7,
      size: 1 + seeded(index * 11.37) * 2.2,
      alpha: 0.04 + seeded(index * 9.11) * 0.08,
      square: seeded(index * 1.91) > 0.5
    }));

    const beamBlueprints = [
      { x: 0.16, width: 0.028, alpha: 0.034, drift: 0.7 },
      { x: 0.34, width: 0.022, alpha: 0.026, drift: 0.9 },
      { x: 0.52, width: 0.036, alpha: 0.046, drift: 1 },
      { x: 0.71, width: 0.024, alpha: 0.028, drift: 0.82 },
      { x: 0.86, width: 0.03, alpha: 0.024, drift: 0.64 }
    ];

    const billboardBlueprints = [
      { x: 0.23, y: 0.75, width: 0.21, aspect: 1.28, rotation: -0.09, accent: 0.58, style: 1, drift: 0.016, phase: 0.04 },
      { x: 0.49, y: 0.68, width: 0.33, aspect: 0.72, rotation: -0.02, accent: 0.92, style: 0, drift: 0.012, phase: 0.14 },
      { x: 0.73, y: 0.49, width: 0.19, aspect: 1.14, rotation: 0.08, accent: 0.72, style: 2, drift: 0.014, phase: 0.28 },
      { x: 0.61, y: 0.31, width: 0.12, aspect: 0.88, rotation: -0.11, accent: 0.42, style: 3, drift: 0.012, phase: 0.44 }
    ];

    const compactBillboards = [
      { x: 0.24, y: 0.77, width: 0.3, aspect: 1.18, rotation: -0.08, accent: 0.6, style: 1, drift: 0.016, phase: 0.06 },
      { x: 0.55, y: 0.64, width: 0.46, aspect: 0.78, rotation: -0.01, accent: 0.92, style: 0, drift: 0.012, phase: 0.16 },
      { x: 0.74, y: 0.43, width: 0.25, aspect: 1.04, rotation: 0.08, accent: 0.68, style: 2, drift: 0.013, phase: 0.3 }
    ];

    const trendBlueprints = [
      { x: 0.04, rise: 0.14, phase: 0.04 },
      { x: 0.18, rise: 0.22, phase: 0.12 },
      { x: 0.31, rise: 0.27, phase: 0.22 },
      { x: 0.48, rise: 0.44, phase: 0.32 },
      { x: 0.64, rise: 0.56, phase: 0.42 },
      { x: 0.78, rise: 0.72, phase: 0.52 },
      { x: 0.92, rise: 0.9, phase: 0.62 }
    ];

    const compactTrendBlueprints = [
      { x: 0.06, rise: 0.16, phase: 0.06 },
      { x: 0.24, rise: 0.28, phase: 0.18 },
      { x: 0.44, rise: 0.48, phase: 0.3 },
      { x: 0.68, rise: 0.68, phase: 0.42 },
      { x: 0.9, rise: 0.9, phase: 0.56 }
    ];

    const startTime = performance.now();
    let width = 0;
    let height = 0;
    let frameId = 0;

    const resizeCanvas = () => {
      const rect = growthCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      growthCanvas.width = Math.round(width * dpr);
      growthCanvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const traceRoundedRect = (x, y, rectWidth, rectHeight, radius) => {
      const safeRadius = Math.max(0, Math.min(radius, rectWidth / 2, rectHeight / 2));

      context.beginPath();
      context.moveTo(x + safeRadius, y);
      context.lineTo(x + rectWidth - safeRadius, y);
      context.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + safeRadius);
      context.lineTo(x + rectWidth, y + rectHeight - safeRadius);
      context.quadraticCurveTo(x + rectWidth, y + rectHeight, x + rectWidth - safeRadius, y + rectHeight);
      context.lineTo(x + safeRadius, y + rectHeight);
      context.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - safeRadius);
      context.lineTo(x, y + safeRadius);
      context.quadraticCurveTo(x, y, x + safeRadius, y);
      context.closePath();
    };

    const fillRoundedRect = (x, y, rectWidth, rectHeight, radius, fillStyle) => {
      traceRoundedRect(x, y, rectWidth, rectHeight, radius);
      context.fillStyle = fillStyle;
      context.fill();
    };

    const strokeRoundedRect = (x, y, rectWidth, rectHeight, radius, strokeStyle, lineWidth) => {
      traceRoundedRect(x, y, rectWidth, rectHeight, radius);
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.stroke();
    };

    const drawSegment = (from, to, color, alpha, lineWidth, blur = 0) => {
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.lineWidth = lineWidth;
      context.strokeStyle = `rgba(${color}, ${alpha})`;
      context.shadowBlur = blur;
      context.shadowColor = `rgba(${color}, ${alpha * 1.1})`;
      context.stroke();
      context.shadowBlur = 0;
    };

    const drawDot = (x, y, radius, color, alpha, blur = 0) => {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${color}, ${alpha})`;
      context.shadowBlur = blur;
      context.shadowColor = `rgba(${color}, ${alpha * 1.1})`;
      context.fill();
      context.shadowBlur = 0;
    };

    const drawSquare = (x, y, size, color, alpha, blur = 0) => {
      context.save();
      context.translate(x, y);
      context.rotate(Math.PI / 4);
      context.fillStyle = `rgba(${color}, ${alpha})`;
      context.shadowBlur = blur;
      context.shadowColor = `rgba(${color}, ${alpha * 1.2})`;
      context.fillRect(-size / 2, -size / 2, size, size);
      context.restore();
      context.shadowBlur = 0;
    };

    const drawBillboardContent = (panelWidth, panelHeight, style, accent, alpha, timestamp) => {
      const inset = Math.min(panelWidth, panelHeight) * 0.08;
      const radius = Math.min(panelWidth, panelHeight) * 0.07;
      const innerX = -panelWidth / 2 + inset;
      const innerY = -panelHeight / 2 + inset;
      const innerWidth = panelWidth - inset * 2;
      const innerHeight = panelHeight - inset * 2;
      const chipHeight = Math.max(10, innerHeight * 0.055);
      const topLineY = innerY + chipHeight * 1.3;
      const footerY = innerY + innerHeight - chipHeight * 1.2;

      fillRoundedRect(innerX, innerY, innerWidth * 0.24, chipHeight, chipHeight / 2, `rgba(225, 233, 241, ${alpha * 0.15})`);
      fillRoundedRect(innerX + innerWidth * 0.3, innerY, innerWidth * 0.14, chipHeight, chipHeight / 2, `rgba(122, 158, 196, ${alpha * 0.24})`);

      if (style === 0) {
        const heroHeight = innerHeight * 0.46;
        const heroGradient = context.createLinearGradient(innerX, topLineY, innerX + innerWidth, topLineY + heroHeight);
        heroGradient.addColorStop(0, `rgba(${60 + accent * 40}, ${97 + accent * 32}, ${138 + accent * 26}, ${alpha * 0.72})`);
        heroGradient.addColorStop(1, `rgba(18, 31, 49, ${alpha * 0.42})`);
        fillRoundedRect(innerX, topLineY, innerWidth, heroHeight, radius * 0.9, heroGradient);

        const cardY = topLineY + heroHeight + innerHeight * 0.08;
        const gap = innerWidth * 0.04;
        const cardWidth = (innerWidth - gap * 2) / 3;
        for (let index = 0; index < 3; index += 1) {
          const x = innerX + index * (cardWidth + gap);
          fillRoundedRect(x, cardY, cardWidth, innerHeight * 0.18, radius * 0.5, `rgba(226, 234, 242, ${alpha * (0.1 + index * 0.02)})`);
          fillRoundedRect(x + cardWidth * 0.08, cardY + innerHeight * 0.11, cardWidth * 0.54, chipHeight * 0.78, chipHeight / 2, `rgba(226, 234, 242, ${alpha * 0.1})`);
        }
      } else if (style === 1) {
        const columnWidth = innerWidth * 0.42;
        const posterGradient = context.createLinearGradient(innerX, topLineY, innerX + columnWidth, topLineY + innerHeight * 0.7);
        posterGradient.addColorStop(0, `rgba(${54 + accent * 46}, ${91 + accent * 32}, ${133 + accent * 20}, ${alpha * 0.66})`);
        posterGradient.addColorStop(1, `rgba(16, 28, 45, ${alpha * 0.34})`);
        fillRoundedRect(innerX, topLineY, columnWidth, innerHeight * 0.7, radius * 0.8, posterGradient);
        fillRoundedRect(innerX + columnWidth + innerWidth * 0.06, topLineY, innerWidth * 0.42, chipHeight * 0.9, chipHeight / 2, `rgba(226, 234, 242, ${alpha * 0.15})`);
        fillRoundedRect(innerX + columnWidth + innerWidth * 0.06, topLineY + innerHeight * 0.11, innerWidth * 0.34, chipHeight * 0.72, chipHeight / 2, `rgba(226, 234, 242, ${alpha * 0.12})`);
        fillRoundedRect(innerX + columnWidth + innerWidth * 0.06, topLineY + innerHeight * 0.24, innerWidth * 0.4, innerHeight * 0.18, radius * 0.45, `rgba(226, 234, 242, ${alpha * 0.1})`);
        fillRoundedRect(innerX + columnWidth + innerWidth * 0.06, topLineY + innerHeight * 0.47, innerWidth * 0.26, chipHeight * 0.82, chipHeight / 2, `rgba(123, 158, 194, ${alpha * 0.24})`);
      } else if (style === 2) {
        const heroHeight = innerHeight * 0.58;
        const posterGradient = context.createLinearGradient(innerX, topLineY, innerX + innerWidth, topLineY + heroHeight);
        posterGradient.addColorStop(0, `rgba(${60 + accent * 44}, ${101 + accent * 30}, ${144 + accent * 18}, ${alpha * 0.68})`);
        posterGradient.addColorStop(1, `rgba(12, 24, 40, ${alpha * 0.3})`);
        fillRoundedRect(innerX, topLineY, innerWidth, heroHeight, radius * 0.86, posterGradient);

        context.beginPath();
        context.moveTo(innerX + innerWidth * 0.08, topLineY + heroHeight * 0.74);
        context.bezierCurveTo(innerX + innerWidth * 0.32, topLineY + heroHeight * 0.5, innerX + innerWidth * 0.56, topLineY + heroHeight * 0.9, innerX + innerWidth * 0.84, topLineY + heroHeight * 0.34);
        context.strokeStyle = `rgba(223, 233, 242, ${alpha * 0.24})`;
        context.lineWidth = Math.max(1.5, panelWidth * 0.008);
        context.stroke();

        fillRoundedRect(innerX, topLineY + heroHeight + innerHeight * 0.08, innerWidth * 0.56, chipHeight * 0.86, chipHeight / 2, `rgba(226, 234, 242, ${alpha * 0.14})`);
        fillRoundedRect(innerX, topLineY + heroHeight + innerHeight * 0.16, innerWidth * 0.38, chipHeight * 0.72, chipHeight / 2, `rgba(226, 234, 242, ${alpha * 0.1})`);
      } else {
        const panelHeight = innerHeight * 0.3;
        const gap = innerHeight * 0.06;
        fillRoundedRect(innerX, topLineY, innerWidth, panelHeight, radius * 0.72, `rgba(224, 232, 240, ${alpha * 0.1})`);
        fillRoundedRect(innerX, topLineY + panelHeight + gap, innerWidth, innerHeight * 0.24, radius * 0.72, `rgba(${62 + accent * 44}, ${99 + accent * 28}, ${141 + accent * 18}, ${alpha * 0.28})`);
        drawSquare(innerX + innerWidth * 0.82, topLineY + panelHeight + gap + innerHeight * 0.1, Math.max(6, panelWidth * 0.03), "223, 232, 240", alpha * 0.24, 4);
      }

      context.save();
      traceRoundedRect(innerX, topLineY, innerWidth, innerHeight * 0.68, radius * 0.9);
      context.clip();
      const shimmerX = -panelWidth + ((timestamp * 0.022 + accent * 280) % (panelWidth * 2.8));
      const shimmer = context.createLinearGradient(shimmerX, -panelHeight, shimmerX + panelWidth * 0.26, panelHeight);
      shimmer.addColorStop(0, "rgba(255, 255, 255, 0)");
      shimmer.addColorStop(0.5, `rgba(240, 246, 252, ${alpha * 0.12})`);
      shimmer.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = shimmer;
      context.fillRect(-panelWidth, -panelHeight, panelWidth * 2, panelHeight * 2);
      context.restore();
      fillRoundedRect(innerX, footerY, innerWidth * 0.22, chipHeight * 0.78, chipHeight / 2, `rgba(219, 228, 237, ${alpha * 0.13})`);
      fillRoundedRect(innerX + innerWidth * 0.27, footerY, innerWidth * 0.16, chipHeight * 0.78, chipHeight / 2, `rgba(126, 161, 195, ${alpha * 0.2})`);
    };

    const drawBillboard = (x, y, panelWidth, panelHeight, rotation, style, accent, alpha, timestamp) => {
      const radius = Math.min(panelWidth, panelHeight) * 0.1;

      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.shadowBlur = panelWidth * 0.2;
      context.shadowColor = `rgba(1, 6, 14, ${alpha * 0.56})`;

      const panelFill = context.createLinearGradient(-panelWidth / 2, -panelHeight / 2, panelWidth / 2, panelHeight / 2);
      panelFill.addColorStop(0, `rgba(24, 37, 55, ${alpha * 0.96})`);
      panelFill.addColorStop(0.52, `rgba(10, 18, 30, ${alpha * 0.84})`);
      panelFill.addColorStop(1, `rgba(4, 8, 15, ${alpha * 0.92})`);
      fillRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, radius, panelFill);
      context.shadowBlur = 0;

      strokeRoundedRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, radius, `rgba(202, 216, 232, ${0.12 + alpha * 0.18})`, 1);
      strokeRoundedRect(
        -panelWidth / 2 + radius * 0.32,
        -panelHeight / 2 + radius * 0.32,
        panelWidth - radius * 0.64,
        panelHeight - radius * 0.64,
        radius * 0.8,
        `rgba(118, 151, 188, ${0.1 + alpha * 0.12})`,
        1
      );

      context.beginPath();
      context.moveTo(-panelWidth / 2 + radius * 0.7, -panelHeight / 2 + 1);
      context.lineTo(panelWidth / 2 - radius * 0.7, -panelHeight / 2 + 1);
      context.strokeStyle = `rgba(228, 236, 244, ${0.08 + alpha * 0.08})`;
      context.lineWidth = 1;
      context.stroke();

      drawBillboardContent(panelWidth, panelHeight, style, accent, alpha, timestamp);
      context.restore();
    };

    const drawBeam = (beam, timestamp, alphaScale = 1) => {
      const drift = Math.sin(timestamp * 0.00018 * beam.drift + beam.x * 16) * width * 0.018;
      const x = width * beam.x + drift;
      const beamWidth = width * beam.width;
      const beamGradient = context.createLinearGradient(x, 0, x, height);
      beamGradient.addColorStop(0, "rgba(114, 149, 191, 0)");
      beamGradient.addColorStop(0.28, `rgba(108, 146, 191, ${beam.alpha * alphaScale})`);
      beamGradient.addColorStop(0.54, `rgba(178, 202, 228, ${beam.alpha * alphaScale * 1.08})`);
      beamGradient.addColorStop(1, "rgba(114, 149, 191, 0)");
      context.fillStyle = beamGradient;
      context.fillRect(x - beamWidth / 2, 0, beamWidth, height);
    };

    const drawRoute = (points, progress, alpha, lineWidth) => {
      if (points.length < 2) {
        return;
      }

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length - 1; index += 1) {
        const middleX = (points[index].x + points[index + 1].x) / 2;
        const middleY = (points[index].y + points[index + 1].y) / 2;
        context.quadraticCurveTo(points[index].x, points[index].y, middleX, middleY);
      }
      context.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
      context.strokeStyle = `rgba(170, 196, 224, ${alpha})`;
      context.lineWidth = lineWidth;
      context.shadowBlur = 14;
      context.shadowColor = `rgba(107, 151, 205, ${alpha * 0.24})`;
      context.stroke();
      context.shadowBlur = 0;

      let totalLength = 0;
      const segments = [];
      for (let index = 1; index < points.length; index += 1) {
        const dx = points[index].x - points[index - 1].x;
        const dy = points[index].y - points[index - 1].y;
        const length = Math.hypot(dx, dy);
        totalLength += length;
        segments.push({ from: points[index - 1], to: points[index], length });
      }

      let travel = totalLength * progress;
      let marker = points[points.length - 1];
      for (const segment of segments) {
        if (travel <= segment.length) {
          const ratio = segment.length ? travel / segment.length : 0;
          marker = {
            x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
            y: segment.from.y + (segment.to.y - segment.from.y) * ratio
          };
          break;
        }
        travel -= segment.length;
      }

      drawDot(marker.x, marker.y, Math.max(4, lineWidth * 1.5), "231, 238, 246", alpha * 1.6, 10);
      drawDot(marker.x, marker.y, Math.max(1.6, lineWidth * 0.55), "121, 165, 221", alpha * 1.8, 6);
    };

    const drawTrendColumn = (x, baselineY, topY, columnWidth, alpha) => {
      const rectHeight = Math.max(0, baselineY - topY);
      if (rectHeight < 1) {
        return;
      }

      const gradient = context.createLinearGradient(x, topY, x, baselineY);
      gradient.addColorStop(0, `rgba(118, 154, 195, ${alpha})`);
      gradient.addColorStop(0.55, `rgba(58, 98, 151, ${alpha * 0.42})`);
      gradient.addColorStop(1, "rgba(15, 28, 45, 0)");
      fillRoundedRect(x - columnWidth / 2, topY, columnWidth, rectHeight, columnWidth / 2, gradient);
    };

    const drawTrendArea = (points, baselineY, alpha) => {
      if (points.length < 2) {
        return;
      }

      const gradient = context.createLinearGradient(0, baselineY - height * 0.62, 0, baselineY);
      gradient.addColorStop(0, `rgba(93, 143, 207, ${alpha * 0.42})`);
      gradient.addColorStop(0.42, `rgba(50, 92, 150, ${alpha * 0.18})`);
      gradient.addColorStop(1, "rgba(14, 25, 40, 0)");
      context.beginPath();
      context.moveTo(points[0].x, baselineY);
      points.forEach((point) => {
        context.lineTo(point.x, point.y);
      });
      context.lineTo(points[points.length - 1].x, baselineY);
      context.closePath();
      context.fillStyle = gradient;
      context.fill();
    };

    const drawTrendLine = (points, progress, color, alpha, lineWidth, blur = 0) => {
      if (points.length < 2 || progress <= 0) {
        return null;
      }

      const segments = [];
      let totalLength = 0;
      for (let index = 1; index < points.length; index += 1) {
        const from = points[index - 1];
        const to = points[index];
        const length = Math.hypot(to.x - from.x, to.y - from.y);
        totalLength += length;
        segments.push({ from, to, length });
      }

      let remaining = totalLength * clamp(progress);
      let marker = points[0];
      let previousPoint = points[0];

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (const segment of segments) {
        if (remaining >= segment.length) {
          context.lineTo(segment.to.x, segment.to.y);
          remaining -= segment.length;
          previousPoint = segment.from;
          marker = segment.to;
          continue;
        }

        const ratio = segment.length ? remaining / segment.length : 0;
        marker = {
          x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
          y: segment.from.y + (segment.to.y - segment.from.y) * ratio
        };
        previousPoint = segment.from;
        context.lineTo(marker.x, marker.y);
        remaining = 0;
        break;
      }

      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = `rgba(${color}, ${alpha})`;
      context.lineWidth = lineWidth;
      context.shadowBlur = blur;
      context.shadowColor = `rgba(${color}, ${alpha * 0.95})`;
      context.stroke();
      context.shadowBlur = 0;

      return { marker, previousPoint };
    };

    const drawTrendArrow = (from, to, color, alpha, size) => {
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const wing = size * 0.46;

      context.beginPath();
      context.moveTo(to.x, to.y);
      context.lineTo(
        to.x - Math.cos(angle - 0.38) * size + Math.sin(angle) * wing,
        to.y - Math.sin(angle - 0.38) * size - Math.cos(angle) * wing
      );
      context.lineTo(
        to.x - Math.cos(angle + 0.38) * size - Math.sin(angle) * wing,
        to.y - Math.sin(angle + 0.38) * size + Math.cos(angle) * wing
      );
      context.closePath();
      context.fillStyle = `rgba(${color}, ${alpha})`;
      context.shadowBlur = size;
      context.shadowColor = `rgba(${color}, ${alpha * 0.7})`;
      context.fill();
      context.shadowBlur = 0;
    };

    const renderFrame = (timestamp = performance.now()) => {
      if (!width || !height) {
        return;
      }

      const reducedMotion = reducedMotionQuery.matches;
      const elapsed = timestamp - startTime;
      const isCompact = width < 680;
      const activeTrend = isCompact ? compactTrendBlueprints : trendBlueprints;
      const introProgress = reducedMotion ? 1 : clamp(elapsed / 2200);
      const lineProgress = reducedMotion ? 1 : clamp((elapsed - 180) / 2600);
      const floatPhase = elapsed * 0.00022;
      const sweepProgress = reducedMotion ? 0.4 : (elapsed * 0.00006) % 1;

      context.clearRect(0, 0, width, height);

      const centerGlow = context.createRadialGradient(width * 0.52, height * 0.66, width * 0.08, width * 0.52, height * 0.66, width * 0.72);
      centerGlow.addColorStop(0, "rgba(42, 78, 126, 0.22)");
      centerGlow.addColorStop(0.34, "rgba(18, 37, 63, 0.14)");
      centerGlow.addColorStop(1, "rgba(4, 10, 18, 0)");
      context.fillStyle = centerGlow;
      context.fillRect(0, 0, width, height);

      const floorGlow = context.createRadialGradient(width * 0.5, height * 0.88, width * 0.04, width * 0.5, height * 0.88, width * 0.46);
      floorGlow.addColorStop(0, "rgba(30, 62, 104, 0.34)");
      floorGlow.addColorStop(0.44, "rgba(14, 30, 53, 0.16)");
      floorGlow.addColorStop(1, "rgba(4, 10, 18, 0)");
      context.fillStyle = floorGlow;
      context.fillRect(0, height * 0.56, width, height * 0.44);

      beamBlueprints.forEach((beam, index) => {
        drawBeam(beam, timestamp + index * 280, 1);
      });

      const sweepX = -width * 0.3 + width * 1.5 * sweepProgress;
      const sweep = context.createLinearGradient(sweepX, 0, sweepX + width * 0.22, height);
      sweep.addColorStop(0, "rgba(255, 255, 255, 0)");
      sweep.addColorStop(0.5, "rgba(188, 209, 234, 0.08)");
      sweep.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = sweep;
      context.fillRect(0, 0, width, height);

      ambientParticles.forEach((particle, index) => {
        const drift = Math.sin(timestamp * 0.00034 * particle.drift + particle.seed) * width * 0.018;
        const yOffset = (timestamp * 0.018 * particle.drift) % (height * 1.34);
        const x = width * (0.1 + particle.x * 0.8) + drift;
        const y = height * 1.08 - ((particle.y * height * 1.34 + yOffset) % (height * 1.34));
        const alpha = particle.alpha * (0.66 + Math.sin(timestamp * 0.0011 + index) * 0.16);

        if (particle.square) {
          drawSquare(x, y, particle.size * 1.08, "154, 177, 201", alpha, 6);
        } else {
          drawDot(x, y, particle.size, "210, 221, 233", alpha, 6);
        }
      });

      const chartLeft = width * (isCompact ? 0.08 : 0.06);
      const chartRight = width * (isCompact ? 0.93 : 0.94);
      const chartTop = height * (isCompact ? 0.18 : 0.14);
      const baselineY = height * (isCompact ? 0.8 : 0.76);
      const chartHeight = baselineY - chartTop;

      context.strokeStyle = "rgba(142, 165, 191, 0.08)";
      context.lineWidth = 1;
      for (let index = 0; index < 5; index += 1) {
        const y = chartTop + (chartHeight / 4) * index;
        context.beginPath();
        context.moveTo(chartLeft, y);
        context.lineTo(chartRight, y);
        context.stroke();
      }

      context.beginPath();
      context.moveTo(chartLeft, baselineY + 1);
      context.lineTo(chartRight, baselineY + 1);
      context.strokeStyle = "rgba(182, 199, 216, 0.16)";
      context.lineWidth = 1.2;
      context.stroke();

      const targetPoints = activeTrend.map((point) => {
        const x = chartLeft + point.x * (chartRight - chartLeft);
        const organic = reducedMotion ? 0 : Math.sin(floatPhase * 3 + point.phase * 14) * chartHeight * 0.01;
        return {
          x,
          y: baselineY - point.rise * chartHeight - organic
        };
      });

      const points = activeTrend.map((point, index) => {
        const x = chartLeft + point.x * (chartRight - chartLeft);
        const reveal = clamp((introProgress - index * 0.08) / 0.68);
        const organic = reducedMotion ? 0 : Math.sin(floatPhase * 3 + point.phase * 14) * chartHeight * 0.01;
        return {
          x,
          y: baselineY - point.rise * chartHeight * (0.16 + reveal * 0.84) - organic,
          reveal
        };
      });

      points.forEach((point, index) => {
        if (index === 0) {
          return;
        }

        drawTrendColumn(
          point.x,
          baselineY,
          point.y + chartHeight * 0.08,
          isCompact ? 14 : 20,
          0.22 * point.reveal
        );
      });

      drawTrendArea(points, baselineY, 0.72 * introProgress);
      drawTrendLine(targetPoints, 1, "129, 151, 178", 0.12, isCompact ? 1.2 : 1.5, 0);
      drawTrendLine(points, lineProgress, "88, 141, 209", 0.18, isCompact ? 8 : 10, isCompact ? 22 : 28);
      const lineState = drawTrendLine(points, lineProgress, "219, 231, 243", 0.96, isCompact ? 2.8 : 3.4, isCompact ? 12 : 16);

      points.forEach((point, index) => {
        const reveal = clamp((lineProgress - (index / Math.max(points.length - 1, 1)) * 0.94) / 0.14);
        if (reveal <= 0) {
          return;
        }

        drawDot(point.x, point.y, isCompact ? 5 : 6.5, "209, 224, 241", reveal * 0.22, 10);
        drawDot(point.x, point.y, isCompact ? 2.4 : 3.2, "235, 242, 248", reveal * 0.9, 6);
        drawDot(point.x, point.y, isCompact ? 1.2 : 1.6, "110, 168, 236", reveal, 4);
      });

      if (lineState) {
        drawTrendArrow(lineState.previousPoint, lineState.marker, "227, 236, 245", 0.96, isCompact ? 10 : 13);

        for (let index = 0; index < 3; index += 1) {
          const angle = timestamp * 0.001 + index * 1.6;
          const offsetX = Math.cos(angle) * (10 + index * 6);
          const offsetY = Math.sin(angle * 1.2) * (8 + index * 4);
          drawSquare(lineState.marker.x - offsetX, lineState.marker.y - 10 - offsetY, 2.6 + index * 0.7, "192, 214, 236", 0.14 + index * 0.05, 6);
        }
      }
    };

    const syncScene = () => {
      resizeCanvas();
      renderFrame();
    };

    resizeCanvas();

    if (reducedMotionQuery.matches) {
      syncScene();
      window.addEventListener("resize", syncScene);
    } else {
      const animate = (timestamp) => {
        renderFrame(timestamp);
        frameId = window.requestAnimationFrame(animate);
      };

      frameId = window.requestAnimationFrame(animate);
      window.addEventListener("resize", syncScene);
    }

    window.addEventListener("beforeunload", () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    });
  }
}

const demoForm = document.querySelector("[data-demo-form]");
const formMessage = document.querySelector(".form-message");

if (demoForm && formMessage) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "문의 초안을 확인했습니다. 실제 운영 단계에서는 상담 채널과 연결해 바로 응답 흐름으로 이어지게 설정하면 됩니다.";
    demoForm.reset();
  });
}
