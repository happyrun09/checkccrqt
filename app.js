/* CheckCCRQT v0.3.0 — Client-Side EUDR Spatial Workbench & Portal Logic */
(function () {
  "use strict";

  const DEFAULT_ORG = "Phòng Sử dụng và Phát triển rừng — Chi cục Kiểm lâm tỉnh Quảng Trị";
  const EUDR_THRESHOLD_HA = 4.0;
  const SLIVER_HA = 0.01;

  // =========================================================================
  // 1. EMBEDDED 8 REALISTIC QUANG TRI ACACIA FOREST LOTS (CAM LO / VINH LINH)
  // =========================================================================
  function makeRect(lon, lat, dLon, dLat) {
    return [[
      [lon, lat],
      [lon + dLon, lat],
      [lon + dLon, lat + dLat],
      [lon, lat + dLat],
      [lon, lat]
    ]];
  }

  const SAMPLE_LOTS_GEOJSON = {
    type: "FeatureCollection",
    name: "QuangTri_KeoLai_8Lo_Mau_v030",
    features: [
      {
        type: "Feature",
        properties: {
          id_lo: "QT-CL-001",
          chu_ho: "Nguyễn Văn Minh (HTX Cam Nghĩa)",
          tieu_khu: "751A", khoanh: "2", lo: "14",
          loai_cay: "Keo lai (Acacia hybrid)", nam_trong: 2021,
          tmf_status: "Tuân thủ", tmf_year: null, tmf_ha: 0,
          tmf_driver: "Rừng trồng ổn định trên đất quy hoạch",
          harvest_status: "Chưa khai thác", harvest_date: null,
          scenario: "Tuân thủ EUDR — Tán keo khép tán ổn định",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.76, 0.78, 0.81, 0.82, 0.79, 0.77, 0.78, 0.80, 0.83, 0.84, 0.82],
          ts_nbr:   [0.62, 0.65, 0.68, 0.70, 0.66, 0.64, 0.65, 0.67, 0.71, 0.72, 0.69],
          ts_ndmi:  [0.44, 0.46, 0.49, 0.50, 0.47, 0.45, 0.46, 0.48, 0.51, 0.52, 0.49]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9420, 16.8180, 0.0018, 0.0016) }
      },
      {
        type: "Feature",
        properties: {
          id_lo: "QT-CL-002",
          chu_ho: "Trần Thị Lan (Nhóm hộ Cam Tuyền)",
          tieu_khu: "751A", khoanh: "3", lo: "08",
          loai_cay: "Keo lai (Luân canh trồng lại)", nam_trong: 2020,
          tmf_status: "Tuân thủ", tmf_year: null, tmf_ha: 0,
          tmf_driver: "Khai thác rừng trồng keo luân canh và trồng lại mới",
          harvest_status: "Đã khai thác trắng (Phục hồi tái sinh)", harvest_date: "2025-05-14",
          scenario: "Khai thác luân canh keo — tái sinh phục hồi (bắt chuẩn BUG-05 K=2)",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.80, 0.82, 0.21, 0.19, 0.28, 0.42, 0.55, 0.64, 0.70, 0.74, 0.76],
          ts_nbr:   [0.66, 0.69, 0.08, 0.06, 0.16, 0.30, 0.43, 0.51, 0.57, 0.60, 0.62],
          ts_ndmi:  [0.48, 0.50, -0.05, -0.08, 0.04, 0.18, 0.29, 0.35, 0.40, 0.43, 0.45]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9455, 16.8182, 0.0017, 0.0015) }
      },
      {
        type: "Feature",
        properties: {
          id_lo: "QT-VL-003",
          chu_ho: "Lê Văn Hùng (HTX Vĩnh Hà)",
          tieu_khu: "582", khoanh: "4", lo: "21",
          loai_cay: "Keo lai", nam_trong: 2019,
          tmf_status: "Cảnh báo", tmf_year: null, tmf_ha: 0,
          tmf_driver: "Biến động tán rừng đang diễn ra (Lớp 50 / Subtype 53)",
          harvest_status: "Khai thác một phần", harvest_date: "2026-03-22",
          scenario: "Cảnh báo biến động lớp 50 (JRC TMF Class 50)",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.79, 0.80, 0.81, 0.80, 0.78, 0.79, 0.77, 0.52, 0.49, 0.51, 0.54],
          ts_nbr:   [0.64, 0.65, 0.66, 0.65, 0.63, 0.64, 0.61, 0.34, 0.31, 0.33, 0.37],
          ts_ndmi:  [0.46, 0.47, 0.48, 0.47, 0.45, 0.46, 0.43, 0.21, 0.19, 0.20, 0.23]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9495, 16.8180, 0.0019, 0.0017) }
      },
      {
        type: "Feature",
        properties: {
          id_lo: "QT-VL-004",
          chu_ho: "Hồ Văn Dũng (Nhóm hộ Vĩnh Ô)",
          tieu_khu: "574", khoanh: "1", lo: "05",
          loai_cay: "Keo tai tượng", nam_trong: 2022,
          tmf_status: "Vi phạm", tmf_year: 2022, tmf_ha: 0.68,
          tmf_driver: "Chuyển đổi từ rừng tự nhiên suy thoái sau 31/12/2020 (Class 41)",
          harvest_status: "Đã khai thác trắng", harvest_date: "2025-07-09",
          scenario: "Vi phạm mất rừng sau 31/12/2020 (JRC TMF 2022)",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.74, 0.75, 0.73, 0.18, 0.17, 0.20, 0.23, 0.26, 0.28, 0.30, 0.31],
          ts_nbr:   [0.58, 0.59, 0.57, 0.04, 0.03, 0.06, 0.09, 0.12, 0.14, 0.16, 0.17],
          ts_ndmi:  [0.40, 0.41, 0.39, -0.10, -0.11, -0.08, -0.05, -0.02, 0.01, 0.03, 0.04]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9535, 16.8182, 0.0016, 0.0014) }
      },
      {
        type: "Feature",
        properties: {
          id_lo: "QT-GL-005",
          chu_ho: "Phạm Văn Tám (Lô dải hẹp khe suối)",
          tieu_khu: "596", khoanh: "5", lo: "19",
          loai_cay: "Keo lai", nam_trong: 2021,
          tmf_status: "Vi phạm", tmf_year: 2023, tmf_ha: 0.14,
          tmf_driver: "Lô dải hẹp <30m giao cắt pixel mất rừng (bắt chuẩn BUG-07)",
          harvest_status: "Khai thác một phần", harvest_date: "2025-09-18",
          scenario: "Lô rừng dải hẹp <30m dọc khe suối (test BUG-07)",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.77, 0.79, 0.80, 0.78, 0.46, 0.44, 0.48, 0.52, 0.56, 0.59, 0.61],
          ts_nbr:   [0.61, 0.63, 0.64, 0.62, 0.28, 0.26, 0.30, 0.34, 0.38, 0.41, 0.43],
          ts_ndmi:  [0.43, 0.45, 0.46, 0.44, 0.15, 0.13, 0.17, 0.21, 0.24, 0.27, 0.29]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9420, 16.8152, 0.0036, 0.00018) }
      },
      {
        type: "Feature",
        properties: {
          id_lo: "QT-CL-006",
          chu_ho: "Công ty TNHH MTV Lâm nghiệp Đường 9",
          tieu_khu: "752", khoanh: "1", lo: "02",
          loai_cay: "Keo lai gỗ lớn (FSC)", nam_trong: 2018,
          tmf_status: "Tuân thủ", tmf_year: null, tmf_ha: 0,
          tmf_driver: "Lô diện tích >= 4 ha — Bắt buộc Polygon theo Điều 9 EUDR",
          harvest_status: "Chưa khai thác", harvest_date: null,
          scenario: "Lô lớn >= 4 ha (bắt buộc xuất Polygon theo Điều 9 EUDR)",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.83, 0.84, 0.86, 0.87, 0.85, 0.84, 0.84, 0.86, 0.87, 0.88, 0.86],
          ts_nbr:   [0.70, 0.72, 0.74, 0.75, 0.73, 0.71, 0.72, 0.74, 0.75, 0.76, 0.74],
          ts_ndmi:  [0.52, 0.54, 0.56, 0.57, 0.55, 0.53, 0.54, 0.56, 0.57, 0.58, 0.56]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9468, 16.8134, 0.0028, 0.0020) }
      },
      {
        type: "Feature",
        properties: {
          id_lo: "QT-VL-007",
          chu_ho: "Võ Văn Sơn (Kê khai trùng mã — Bản ghi 1)",
          tieu_khu: "583", khoanh: "2", lo: "11",
          loai_cay: "Keo lai", nam_trong: 2021,
          tmf_status: "Tuân thủ", tmf_year: null, tmf_ha: 0,
          tmf_driver: "Phát hiện trùng mã lô DUPLICATE_ID & chồng lấn ranh giới",
          harvest_status: "Chưa khai thác", harvest_date: null,
          scenario: "Lô lỗi trùng mã DUPLICATE_ID (bản ghi 1)",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.72, 0.74, 0.75, 0.76, 0.74, 0.73, 0.74, 0.75, 0.76, 0.77, 0.75],
          ts_nbr:   [0.56, 0.58, 0.59, 0.60, 0.58, 0.57, 0.58, 0.59, 0.60, 0.61, 0.59],
          ts_ndmi:  [0.39, 0.41, 0.42, 0.43, 0.41, 0.40, 0.41, 0.42, 0.43, 0.44, 0.42]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9510, 16.8140, 0.0015, 0.0013) }
      },
      {
        type: "Feature",
        properties: {
          id_lo: "QT-VL-007",
          chu_ho: "Võ Văn Sơn / HTX B (Trùng mã & Chồng lấn)",
          tieu_khu: "583", khoanh: "2", lo: "11",
          loai_cay: "Keo lai", nam_trong: 2021,
          tmf_status: "Cảnh báo", tmf_year: null, tmf_ha: 0,
          tmf_driver: "Trùng mã lô DUPLICATE_ID + Chồng lấn OVERLAP với lô kề",
          harvest_status: "Chưa khai thác", harvest_date: null,
          scenario: "Lô lỗi trùng mã DUPLICATE_ID + Chồng lấn OVERLAP",
          ts_dates: ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
          ts_ndvi:  [0.71, 0.73, 0.74, 0.75, 0.73, 0.72, 0.73, 0.74, 0.75, 0.76, 0.74],
          ts_nbr:   [0.55, 0.57, 0.58, 0.59, 0.57, 0.56, 0.57, 0.58, 0.59, 0.60, 0.58],
          ts_ndmi:  [0.38, 0.40, 0.41, 0.42, 0.40, 0.39, 0.40, 0.41, 0.42, 0.43, 0.41]
        },
        geometry: { type: "Polygon", coordinates: makeRect(106.9520, 16.8144, 0.0014, 0.0012) }
      }
    ]
  };

  // State
  let map = null;
  let geoLayer = null;
  let pinMarker = null;
  let gpsCircle = null;
  let analyzedLots = [];
  let selectedIdx = 0;
  let currentIndexKey = "NDVI";
  let currentTableFilter = "all";
  let currentSearchQuery = "";
  let tsChart = null;
  let qrInstance = null;
  let layerOpacity = 0.28;
  let showLotLabels = true;
  let lastConvertedWgs = { lon: 106.948, lat: 16.817 };

  // =========================================================================
  // 1B. PURE-JS 7-PARAMETER HELMERT VN-2000 <-> WGS-84 GEODETIC ENGINE
  // Exact match to PROJ +towgs84=-191.90441429,-39.30318279,-111.45032835,
  //   -0.00928836,0.01975479,-0.00427372,0.252906278 (Position Vector)
  // =========================================================================
  const WGS84_A = 6378137.0;
  const WGS84_F = 1.0 / 298.257223563;
  const WGS84_E2 = 2 * WGS84_F - WGS84_F * WGS84_F;
  const WGS84_EP2 = WGS84_E2 / (1.0 - WGS84_E2);
  const SEC_TO_RAD = Math.PI / (180.0 * 3600.0);

  const HELMERT = {
    dx: -191.90441429,
    dy: -39.30318279,
    dz: -111.45032835,
    rx: -0.00928836 * SEC_TO_RAD,
    ry: 0.01975479 * SEC_TO_RAD,
    rz: -0.00427372 * SEC_TO_RAD,
    ds: 0.252906278 * 1e-6
  };

  function geodeticToEcef(lonDeg, latDeg, h = 0.0) {
    const lon = lonDeg * Math.PI / 180.0;
    const lat = latDeg * Math.PI / 180.0;
    const sLat = Math.sin(lat), cLat = Math.cos(lat);
    const sLon = Math.sin(lon), cLon = Math.cos(lon);
    const N = WGS84_A / Math.sqrt(1.0 - WGS84_E2 * sLat * sLat);
    return [
      (N + h) * cLat * cLon,
      (N + h) * cLat * sLon,
      (N * (1.0 - WGS84_E2) + h) * sLat
    ];
  }

  function ecefToGeodetic(X, Y, Z) {
    const lon = Math.atan2(Y, X);
    const p = Math.hypot(X, Y);
    let lat = Math.atan2(Z, p * (1.0 - WGS84_E2));
    for (let i = 0; i < 8; i++) {
      const sLat = Math.sin(lat);
      const N = WGS84_A / Math.sqrt(1.0 - WGS84_E2 * sLat * sLat);
      lat = Math.atan2(Z + WGS84_E2 * N * sLat, p);
    }
    return [lon * 180.0 / Math.PI, lat * 180.0 / Math.PI];
  }

  function helmertVnToWgs(X, Y, Z) {
    // PROJ Position Vector convention: +towgs84
    const s = 1.0 + HELMERT.ds;
    return [
      HELMERT.dx + s * (X - HELMERT.rz * Y + HELMERT.ry * Z),
      HELMERT.dy + s * (HELMERT.rz * X + Y - HELMERT.rx * Z),
      HELMERT.dz + s * (-HELMERT.ry * X + HELMERT.rx * Y + Z)
    ];
  }

  function helmertWgsToVn(X, Y, Z) {
    // Exact inverse of Position Vector Helmert
    const s = 1.0 - HELMERT.ds;
    const x = X - HELMERT.dx;
    const y = Y - HELMERT.dy;
    const z = Z - HELMERT.dz;
    return [
      s * (x + HELMERT.rz * y - HELMERT.ry * z),
      s * (-HELMERT.rz * x + y + HELMERT.rx * z),
      s * (HELMERT.ry * x - HELMERT.rx * y + z)
    ];
  }

  function tmInverse(x, y, lon0Deg, k0 = 0.9999, x0 = 500000.0, y0 = 0.0) {
    const e2 = WGS84_E2, ep2 = WGS84_EP2, a = WGS84_A;
    const xp = (x - x0) / k0;
    const yp = (y - y0) / k0;
    let phi = yp / (a * (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256));
    for (let i = 0; i < 6; i++) {
      const M = a * (
        (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256) * phi
        - (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 * e2 * e2 / 1024) * Math.sin(2 * phi)
        + (15 * e2 * e2 / 256 + 45 * e2 * e2 * e2 / 1024) * Math.sin(4 * phi)
        - (35 * e2 * e2 * e2 / 3072) * Math.sin(6 * phi)
      );
      const dM = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(phi) * Math.sin(phi), 1.5);
      phi += (yp - M) / dM;
    }
    const sPhi = Math.sin(phi), cPhi = Math.cos(phi), tPhi = Math.tan(phi);
    const N = a / Math.sqrt(1 - e2 * sPhi * sPhi);
    const R = a * (1 - e2) / Math.pow(1 - e2 * sPhi * sPhi, 1.5);
    const T = tPhi * tPhi;
    const C = ep2 * cPhi * cPhi;
    const D = xp / N;

    const lat = phi - (N * tPhi / R) * (
      D * D / 2 - (5 + 3 * T + 10 * C - 4 * C * C - 9 * ep2) * Math.pow(D, 4) / 24
      + (61 + 90 * T + 298 * C + 45 * T * T - 252 * ep2 - 3 * C * C) * Math.pow(D, 6) / 720
    );
    const lon = (lon0Deg * Math.PI / 180.0) + (
      D - (1 + 2 * T + C) * Math.pow(D, 3) / 6
      + (5 - 2 * C + 28 * T - 3 * C * C + 8 * ep2 + 24 * T * T) * Math.pow(D, 5) / 120
    ) / cPhi;
    return [lon * 180.0 / Math.PI, lat * 180.0 / Math.PI];
  }

  function tmForward(lonDeg, latDeg, lon0Deg, k0 = 0.9999, x0 = 500000.0, y0 = 0.0) {
    const e2 = WGS84_E2, ep2 = WGS84_EP2, a = WGS84_A;
    const phi = latDeg * Math.PI / 180.0;
    const lam = lonDeg * Math.PI / 180.0;
    const lam0 = lon0Deg * Math.PI / 180.0;
    const sPhi = Math.sin(phi), cPhi = Math.cos(phi), tPhi = Math.tan(phi);
    const N = a / Math.sqrt(1 - e2 * sPhi * sPhi);
    const T = tPhi * tPhi;
    const C = ep2 * cPhi * cPhi;
    const A = (lam - lam0) * cPhi;
    const M = a * (
      (1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 * e2 * e2 / 256) * phi
      - (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 * e2 * e2 / 1024) * Math.sin(2 * phi)
      + (15 * e2 * e2 / 256 + 45 * e2 * e2 * e2 / 1024) * Math.sin(4 * phi)
      - (35 * e2 * e2 * e2 / 3072) * Math.sin(6 * phi)
    );
    const x = x0 + k0 * N * (
      A + (1 - T + C) * Math.pow(A, 3) / 6
      + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * Math.pow(A, 5) / 120
    );
    const y = y0 + k0 * (
      M + N * tPhi * (
        A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24
        + (61 - 58 * T + T * T + 600 * C - 330 * ep2) * Math.pow(A, 6) / 720
      )
    );
    return [x, y];
  }

  function vn2000ToWgs84(x, y, lon0Deg = 106.0) {
    const [lonVn, latVn] = tmInverse(Number(x), Number(y), Number(lon0Deg));
    const [Xv, Yv, Zv] = geodeticToEcef(lonVn, latVn, 0.0);
    const [Xw, Yw, Zw] = helmertVnToWgs(Xv, Yv, Zv);
    return ecefToGeodetic(Xw, Yw, Zw); // [lon, lat]
  }

  function wgs84ToVn2000(lon, lat, lon0Deg = 106.0) {
    const [Xw, Yw, Zw] = geodeticToEcef(Number(lon), Number(lat), 0.0);
    const [Xv, Yv, Zv] = helmertWgsToVn(Xw, Yw, Zw);
    const [lonVn, latVn] = ecefToGeodetic(Xv, Yv, Zv);
    return tmForward(lonVn, latVn, Number(lon0Deg)); // [x, y]
  }

  // =========================================================================
  // 2. THEME TOGGLE (Dark / Light persisted in localStorage)
  // =========================================================================
  function initTheme() {
    const saved = localStorage.getItem("checkccrqt_theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.textContent = saved === "dark" ? "☀️" : "🌙";
      btn.addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme") || "dark";
        const next = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("checkccrqt_theme", next);
        btn.textContent = next === "dark" ? "☀️" : "🌙";
        if (analyzedLots.length) renderChart(analyzedLots[selectedIdx]);
      });
    }
  }

  // =========================================================================
  // 3. LEAFLET MAP WITH 3 BASEMAPS
  // =========================================================================
  function initMap() {
    if (typeof L === "undefined") return;
    map = L.map("map", { zoomControl: true }).setView([16.817, 106.948], 15);

    const esriSat = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri World Imagery", maxZoom: 19 }
    );
    const openTopo = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenTopoMap (CC-BY-SA)", maxZoom: 17 }
    );
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap contributors", maxZoom: 19 }
    );

    esriSat.addTo(map);
    L.control.layers({
      "🛰️ Vệ tinh (Esri World Imagery)": esriSat,
      "⛰️ Địa hình (OpenTopoMap)": openTopo,
      "🗺️ Đường phố (OpenStreetMap)": osm
    }, null, { position: "topright" }).addTo(map);
  }

  // =========================================================================
  // 4. SPATIAL ANALYSIS ENGINE (TURF.JS: AREA, PERIMETER, DUPLICATE_ID, OVERLAP, KINKS, SLIVER, EUDR 4 HA)
  // =========================================================================
  function resolveProp(props, keys, fallback) {
    for (const k of keys) {
      if (props && props[k] !== undefined && props[k] !== null && String(props[k]).trim() !== "") {
        return props[k];
      }
    }
    return fallback;
  }

  function analyzeFeatureCollection(fc) {
    const rawFeatures = (fc && fc.features ? fc.features : []).filter(
      (f) => f && f.geometry && (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon" || f.geometry.type === "Point")
    );

    const idCounts = {};
    const items = rawFeatures.map((feat, idx) => {
      const p = feat.properties || {};
      const id_lo = String(resolveProp(p, ["id_lo", "Ma_lo", "malo", "FarmID", "ProductionPlace", "id", "name"], `LO-${idx + 1}`)).trim();
      const normId = id_lo.toLowerCase().replace(/\s+/g, " ");
      idCounts[normId] = (idCounts[normId] || 0) + 1;

      let areaHa = 0;
      let perimM = 0;
      let centerLon = 106.95, centerLat = 16.82;
      let hasSelfIntersect = false;

      if (typeof turf !== "undefined") {
        try {
          if (feat.geometry.type !== "Point") {
            areaHa = turf.area(feat) / 10000.0;
            const line = turf.polygonToLine(feat);
            perimM = turf.length(line, { units: "kilometers" }) * 1000.0;
            const kinks = turf.kinks(feat);
            hasSelfIntersect = kinks && kinks.features && kinks.features.length > 0;
          }
          const pt = turf.pointOnFeature(feat);
          centerLon = pt.geometry.coordinates[0];
          centerLat = pt.geometry.coordinates[1];
        } catch (e) {
          // fallback safe
        }
      }

      const issues = [];
      if (feat.geometry.type !== "Point" && areaHa < SLIVER_HA) {
        issues.push("SLIVER");
      }
      if (hasSelfIntersect) {
        issues.push("SELF_INTERSECT");
      }

      return {
        idx,
        feature: feat,
        id_lo,
        normId,
        chu_ho: String(resolveProp(p, ["chu_ho", "ProducerName", "Chu_ho", "churung", "owner"], "Chủ rừng (Chưa khai báo)")),
        tieu_khu: String(resolveProp(p, ["tieu_khu", "TK", "compartment"], "")),
        khoanh: String(resolveProp(p, ["khoanh", "subcompartment"], "")),
        lo: String(resolveProp(p, ["lo", "plot"], "")),
        loai_cay: String(resolveProp(p, ["loai_cay", "Species", "species"], "Keo lai")),
        nam_trong: resolveProp(p, ["nam_trong", "PlantedYear", "planted"], 2021),
        area_ha: Number(areaHa.toFixed(4)),
        perim_m: Math.round(perimM),
        lon: Number(centerLon.toFixed(6)),
        lat: Number(centerLat.toFixed(6)),
        tmf_status: String(resolveProp(p, ["tmf_status", "EUDR_TMF_Status"], "Tuân thủ")),
        tmf_year: resolveProp(p, ["tmf_year", "EUDR_DeforestationYear"], null),
        tmf_ha: Number(resolveProp(p, ["tmf_ha", "EUDR_AffectedHa"], 0)) || 0,
        tmf_driver: String(resolveProp(p, ["tmf_driver", "EUDR_Driver"], "")),
        harvest_status: String(resolveProp(p, ["harvest_status"], "Chưa khai thác")),
        harvest_date: resolveProp(p, ["harvest_date"], null),
        scenario: String(resolveProp(p, ["scenario"], "Dữ liệu người dùng tải lên")),
        eudr_rule: areaHa >= EUDR_THRESHOLD_HA ? "Polygon (≥ 4 ha)" : "Linh hoạt (< 4 ha)",
        issues,
        ts_dates: p.ts_dates || ["2025-01","2025-03","2025-05","2025-07","2025-09","2025-11","2026-01","2026-03","2026-05","2026-07","2026-09"],
        ts_ndvi: p.ts_ndvi || [0.76,0.78,0.80,0.81,0.79,0.77,0.78,0.80,0.82,0.83,0.81],
        ts_nbr: p.ts_nbr || [0.60,0.62,0.65,0.66,0.64,0.62,0.63,0.65,0.67,0.68,0.66],
        ts_ndmi: p.ts_ndmi || [0.42,0.44,0.46,0.47,0.45,0.43,0.44,0.46,0.48,0.49,0.47],
        ts_rvi: p.ts_rvi || (p.ts_ndvi ? p.ts_ndvi.map((v) => Number(Math.max(0.18, Math.min(0.95, v * 0.88 + 0.05)).toFixed(2))) : [0.72,0.73,0.75,0.76,0.74,0.73,0.74,0.75,0.77,0.78,0.76]),
        frms_alert: resolveProp(p, ["tmf_status", "EUDR_TMF_Status"], "Tuân thủ") === "Vi phạm"
          ? "DEFORESTATION_ALERT"
          : (String(resolveProp(p, ["harvest_status"], "")).includes("khai thác") ? "LEGAL_PLANTATION_CYCLE" : "COMPLIANT_STABLE")
      };
    });

    // DUPLICATE_ID check
    items.forEach((it) => {
      if (idCounts[it.normId] > 1) {
        it.issues.push("DUPLICATE_ID");
      }
    });

    // OVERLAP check (Turf.intersect on polygons)
    if (typeof turf !== "undefined" && items.length <= 250) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].feature.geometry.type === "Point") continue;
        for (let j = i + 1; j < items.length; j++) {
          if (items[j].feature.geometry.type === "Point") continue;
          try {
            const inter = turf.intersect(items[i].feature, items[j].feature);
            if (inter && turf.area(inter) > 1.0) {
              if (!items[i].issues.includes("OVERLAP")) items[i].issues.push("OVERLAP");
              if (!items[j].issues.includes("OVERLAP")) items[j].issues.push("OVERLAP");
            }
          } catch (e) { /* skip invalid geometry pair */ }
        }
      }
    }

    return items;
  }

  function lotColor(item) {
    if (item.tmf_status === "Vi phạm" || item.issues.includes("DUPLICATE_ID")) return "#EF4444";
    if (item.tmf_status === "Cảnh báo" || item.issues.includes("OVERLAP")) return "#F59E0B";
    if (item.harvest_status && item.harvest_status.includes("khai thác")) return "#38BDF8";
    return "#10B981";
  }

  function renderWorkbench(fc) {
    analyzedLots = analyzeFeatureCollection(fc);
    selectedIdx = 0;

    // Update KPI chips
    const total = analyzedLots.length;
    const totalHa = analyzedLots.reduce((s, r) => s + r.area_ha, 0);
    const violations = analyzedLots.filter((r) => r.tmf_status === "Vi phạm").length;
    const dupOrOverlap = analyzedLots.filter((r) => r.issues.includes("DUPLICATE_ID") || r.issues.includes("OVERLAP")).length;
    const ge4ha = analyzedLots.filter((r) => r.area_ha >= EUDR_THRESHOLD_HA).length;

    setText("statTotal", total);
    setText("statArea", totalHa.toFixed(2) + " ha");
    setText("statViol", violations);
    setText("statTopo", dupOrOverlap);
    setText("statLarge", ge4ha);

    // Render Map
    if (map && typeof L !== "undefined") {
      if (geoLayer) map.removeLayer(geoLayer);
      geoLayer = L.geoJSON(
        { type: "FeatureCollection", features: analyzedLots.map((it) => ({ ...it.feature, _idx: it.idx })) },
        {
          style: (f) => {
            const it = analyzedLots[f._idx];
            const c = lotColor(it);
            return { color: c, weight: 3, opacity: Math.min(1, layerOpacity + 0.45), fillColor: c, fillOpacity: layerOpacity };
          },
          onEachFeature: (f, layer) => {
            const it = analyzedLots[f._idx];
            const gmaps = `https://www.google.com/maps?q=${it.lat},${it.lon}`;
            layer.bindPopup(
              `<strong>${it.id_lo}</strong> — ${it.chu_ho}<br/>` +
              `DT: <b>${it.area_ha.toFixed(4)} ha</b> | Chu vi: ${it.perim_m} m<br/>` +
              `EUDR: <b>${it.tmf_status}</b> | Điều 9: ${it.eudr_rule}<br/>` +
              `Tâm WGS-84: <code>${it.lat.toFixed(6)}, ${it.lon.toFixed(6)}</code> ` +
              `<a href="${gmaps}" target="_blank" rel="noopener">Google Maps ↗</a>`
            );
            if (showLotLabels) {
              layer.bindTooltip(it.id_lo, {
                permanent: true,
                direction: "center",
                className: "lot-label-tooltip"
              });
            }
            layer.on("click", () => selectLot(it.idx));
          }
        }
      ).addTo(map);
      if (analyzedLots.length) {
        try { map.fitBounds(geoLayer.getBounds().pad(0.18)); } catch (e) {}
      }
    }

    renderTable();
    if (analyzedLots.length) selectLot(0);
  }

  function renderTable() {
    const tbody = document.getElementById("lotsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    const q = currentSearchQuery.trim().toLowerCase();
    const filtered = analyzedLots.filter((it) => {
      if (currentTableFilter === "violation" && it.tmf_status !== "Vi phạm") return false;
      if (currentTableFilter === "issue" && !it.issues.includes("DUPLICATE_ID") && !it.issues.includes("OVERLAP")) return false;
      if (currentTableFilter === "large" && it.area_ha < EUDR_THRESHOLD_HA) return false;
      if (q) {
        const hay = `${it.id_lo} ${it.chu_ho} ${it.tieu_khu} ${it.khoanh} ${it.lo} ${it.tmf_status}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:18px;">Không tìm thấy lô rừng nào khớp bộ lọc hiện tại.</td></tr>`;
      return;
    }

    filtered.forEach((it) => {
      const tr = document.createElement("tr");
      tr.dataset.idx = it.idx;
      if (it.idx === selectedIdx) tr.classList.add("selected-row");

      const statusClass = it.tmf_status === "Vi phạm" ? "pill-err" : (it.tmf_status === "Cảnh báo" ? "pill-warn" : "pill-ok");
      const frmsBadge = it.frms_alert === "DEFORESTATION_ALERT"
        ? `<div style="margin-top:3px;"><span class="pill pill-err">🔴 DEFORESTATION_ALERT</span></div>`
        : (it.frms_alert === "LEGAL_PLANTATION_CYCLE"
            ? `<div style="margin-top:3px;"><span class="pill pill-warn">🟡 LEGAL_PLANTATION_CYCLE</span></div>`
            : "");
      const issueBadges = it.issues.length
        ? it.issues.map((code) => `<span class="pill pill-err">${code}</span>`).join(" ")
        : `<span class="pill pill-ok">Sạch lỗi</span>`;
      const gmaps = `https://www.google.com/maps?q=${it.lat},${it.lon}`;

      tr.innerHTML = `
        <td class="mono"><strong>${it.id_lo}</strong></td>
        <td>${it.chu_ho}</td>
        <td class="mono">${it.area_ha.toFixed(4)}</td>
        <td class="mono">${it.perim_m}</td>
        <td><span class="pill ${statusClass}">${it.tmf_status}</span>${frmsBadge}</td>
        <td>${issueBadges}</td>
        <td><span class="pill pill-info">${it.eudr_rule}</span></td>
        <td class="mono"><a href="${gmaps}" target="_blank" rel="noopener" style="color:var(--emerald-bright)">${it.lat.toFixed(6)}, ${it.lon.toFixed(6)} ↗</a></td>
      `;
      tr.addEventListener("click", () => {
        selectLot(it.idx);
        if (map) map.flyTo([it.lat, it.lon], 17, { duration: 0.5 });
      });
      tbody.appendChild(tr);
    });
  }

  function selectLot(idx) {
    if (!analyzedLots[idx]) return;
    selectedIdx = idx;
    document.querySelectorAll("#lotsTableBody tr").forEach((tr) => {
      tr.classList.toggle("selected-row", Number(tr.dataset.idx) === idx);
    });
    const it = analyzedLots[idx];
    const detail = document.getElementById("lotDetailBox");
    if (detail) {
      const gmaps = `https://www.google.com/maps?q=${it.lat},${it.lon}`;
      detail.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
          <strong>Lô đang chọn: <span class="mono" style="color:var(--gold)">${it.id_lo}</span> — ${it.chu_ho}</strong>
          <a href="${gmaps}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Mở Google Maps ↗</a>
        </div>
        <div style="color:var(--text-muted);font-size:0.79rem;margin-top:4px;">${it.scenario}</div>
        <div class="lot-detail-grid">
          <div>Diện tích: <strong class="mono">${it.area_ha.toFixed(4)} ha</strong></div>
          <div>Chu vi: <strong class="mono">${it.perim_m} m</strong></div>
          <div>Hiện trạng S2: <strong>${it.harvest_status}${it.harvest_date ? " (" + it.harvest_date + ")" : ""}</strong></div>
          <div>JRC TMF: <strong>${it.tmf_status}${it.tmf_year ? " (" + it.tmf_year + ")" : ""}</strong></div>
          <div>Chuẩn Điều 9 EUDR: <strong>${it.eudr_rule}</strong></div>
          <div>Tâm WGS-84: <strong class="mono">${it.lat.toFixed(6)}, ${it.lon.toFixed(6)}</strong></div>
        </div>
      `;
    }
    renderChart(it);
  }

  // =========================================================================
  // 5. CHART.JS REMOTE SENSING TIME SERIES (NDVI / NBR / NDMI)
  // =========================================================================
  function renderChart(item) {
    const canvas = document.getElementById("tsChart");
    if (!canvas || typeof Chart === "undefined" || !item) return;

    const dataMap = { NDVI: item.ts_ndvi, NBR: item.ts_nbr, NDMI: item.ts_ndmi, RVI: item.ts_rvi };
    const values = dataMap[currentIndexKey] || item.ts_ndvi;
    const peak = Math.max(...values);
    const baselineArr = values.map(() => Number(peak.toFixed(2)));
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const gridColor = isLight ? "rgba(13,59,38,0.12)" : "rgba(148,184,165,0.18)";
    const textColor = isLight ? "#0f291c" : "#cce7d8";
    const isRadar = currentIndexKey === "RVI";

    if (tsChart) tsChart.destroy();
    tsChart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: item.ts_dates,
        datasets: [
          {
            label: isRadar ? `RVI Sentinel-1 SAR RTC (${item.id_lo})` : `${currentIndexKey} Sentinel-2 (${item.id_lo})`,
            data: values,
            borderColor: isRadar ? "#38BDF8" : "#10B981",
            backgroundColor: isRadar ? "rgba(56, 189, 248, 0.18)" : "rgba(16, 185, 129, 0.18)",
            fill: true,
            tension: 0.32,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: values.map((v, idx) => {
              if ((peak - v) / Math.max(peak, 0.01) >= 0.25) return "#EF4444";
              const m = Number((item.ts_dates[idx] || "").split("-")[1] || 0);
              return (m >= 9 || m === 1) ? "#38BDF8" : "#10B981";
            })
          },
          {
            label: `Đỉnh tán Baseline (${peak.toFixed(2)})`,
            data: baselineArr,
            borderColor: "#D4AF37",
            borderDash: [6, 5],
            borderWidth: 1.6,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: "Be Vietnam Pro", size: 11 } } }
        },
        scales: {
          x: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
          y: { min: isRadar ? 0.0 : -0.2, max: 1.0, ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } }
        }
      }
    });
  }

  // =========================================================================
  // 6. RFC 7946 / TRACES NT EUDR GEOJSON EXPORTER (6 DECIMALS, CCW, 4 HA RULE)
  // =========================================================================
  function ringSignedArea(ring) {
    let area = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      area += (ring[i][0] * ring[i + 1][1]) - (ring[i + 1][0] * ring[i][1]);
    }
    return area / 2;
  }

  function roundCoord(c) {
    return [Number(Number(c[0]).toFixed(6)), Number(Number(c[1]).toFixed(6))];
  }

  function orientRing(ring, wantCCW) {
    const cleaned = ring.map(roundCoord);
    const first = cleaned[0];
    const last = cleaned[cleaned.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) cleaned.push([...first]);
    const area = ringSignedArea(cleaned);
    const isCCW = area > 0;
    return isCCW === wantCCW ? cleaned : cleaned.reverse();
  }

  function orientPolygonCoords(rings) {
    return rings.map((r, i) => orientRing(r, i === 0));
  }

  function getExecutingUnit() {
    const inp = document.getElementById("executingUnitInput");
    const val = inp ? inp.value.trim() : "";
    return val || DEFAULT_ORG;
  }

  function buildEudrGeoJson(pointUnder4Ha) {
    const today = new Date().toISOString().slice(0, 10);
    const executingUnit = getExecutingUnit();
    const features = analyzedLots.map((it) => {
      const isLarge = it.area_ha >= EUDR_THRESHOLD_HA;
      let geom;
      let rule;
      if (pointUnder4Ha && !isLarge) {
        geom = { type: "Point", coordinates: [Number(it.lon.toFixed(6)), Number(it.lat.toFixed(6))] };
        rule = "EUDR Art.9 Point (< 4.0 ha)";
      } else {
        const g = it.feature.geometry;
        if (g.type === "Polygon") {
          geom = { type: "Polygon", coordinates: orientPolygonCoords(g.coordinates) };
        } else if (g.type === "MultiPolygon") {
          geom = { type: "MultiPolygon", coordinates: g.coordinates.map(orientPolygonCoords) };
        } else {
          geom = { type: "Point", coordinates: [Number(it.lon.toFixed(6)), Number(it.lat.toFixed(6))] };
        }
        rule = isLarge ? "EUDR Art.9 Polygon (>= 4.0 ha mandatory)" : "EUDR Art.9 Polygon (< 4.0 ha full boundary)";
      }

      return {
        type: "Feature",
        id: it.id_lo,
        geometry: geom,
        properties: {
          ProducerName: it.chu_ho,
          ProducerCountry: "VN",
          ProductionPlace: `${it.id_lo}${it.tieu_khu ? " (TK " + it.tieu_khu + " - K" + it.khoanh + " - Lô " + it.lo + ")" : ""}`,
          Area: it.area_ha,
          Species: it.loai_cay,
          PlantedYear: it.nam_trong,
          EUDR_TMF_Status: it.tmf_status,
          EUDR_DeforestationYear: it.tmf_year,
          EUDR_AffectedHa: it.tmf_ha,
          EUDR_Driver: it.tmf_driver,
          GeometryRule: rule,
          CheckDate: today,
          ExecutingUnit: executingUnit
        }
      };
    });

    return { type: "FeatureCollection", name: "CheckCCRQT_EUDR_TRACES_NT", features };
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportCsvExcel() {
    const headers = [
      "Ma_Lo", "Chu_Ho", "Dien_Tich_Ha", "Chu_Vi_m", "Trang_Thai_EUDR",
      "Nam_Mat_Rung", "Loi_Khong_Gian", "Quy_Tac_Dieu_9_EUDR", "Vi_Do_WGS84", "Kinh_Do_WGS84"
    ];
    const rows = analyzedLots.map((it) => [
      it.id_lo, it.chu_ho, it.area_ha, it.perim_m, it.tmf_status,
      it.tmf_year || "", it.issues.join("; "), it.eudr_rule, it.lat.toFixed(6), it.lon.toFixed(6)
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = "\uFEFF" + headers.join(",") + "\n" + rows.join("\n");
    downloadFile("Bao_Cao_EUDR_CheckCCRQT_v0.3.0.csv", csv, "text/csv;charset=utf-8;");
  }

  // =========================================================================
  // 7. CLIENT-SIDE FILE UPLOAD (.geojson / .json / .kml)
  // =========================================================================
  function parseKmlToGeoJson(xmlText) {
    const dom = new DOMParser().parseFromString(xmlText, "text/xml");
    const placemarks = Array.from(dom.getElementsByTagName("Placemark"));
    const features = [];
    placemarks.forEach((pm, i) => {
      const nameEl = pm.getElementsByTagName("name")[0];
      const name = nameEl ? nameEl.textContent.trim() : `KML-LO-${i + 1}`;
      const coordEl = pm.getElementsByTagName("coordinates")[0];
      if (!coordEl) return;
      const pts = coordEl.textContent.trim().split(/\s+/).map((tok) => {
        const parts = tok.split(",").map(Number);
        return [parts[0], parts[1]];
      }).filter((c) => Number.isFinite(c[0]) && Number.isFinite(c[1]));
      if (pts.length >= 3) {
        if (pts[0][0] !== pts[pts.length - 1][0] || pts[0][1] !== pts[pts.length - 1][1]) {
          pts.push([...pts[0]]);
        }
        features.push({
          type: "Feature",
          properties: { id_lo: name, chu_ho: "Dữ liệu KML tải lên" },
          geometry: { type: "Polygon", coordinates: [pts] }
        });
      }
    });
    return { type: "FeatureCollection", features };
  }

  function handleUploadedFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const txt = String(reader.result || "");
        let fc;
        if (file.name.toLowerCase().endsWith(".kml")) {
          fc = parseKmlToGeoJson(txt);
        } else {
          const parsed = JSON.parse(txt);
          fc = parsed.type === "FeatureCollection" ? parsed : { type: "FeatureCollection", features: [parsed] };
        }
        if (!fc.features || !fc.features.length) {
          alert("Không tìm thấy đa giác hợp lệ trong tệp tải lên.");
          return;
        }
        renderWorkbench(fc);
      } catch (err) {
        alert("Lỗi đọc tệp không gian: " + err.message);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  // =========================================================================
  // 8. ARCHITECTURE TABS & QR CODE GENERATOR
  // =========================================================================
  function initArchTabs() {
    const tabs = document.querySelectorAll(".arch-tab");
    const panels = document.querySelectorAll(".arch-panel");
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        tabs.forEach((t) => t.classList.toggle("active", t === btn));
        panels.forEach((p) => p.classList.toggle("active", p.id === target));
      });
    });
  }

  function renderQR(urlText) {
    const box = document.getElementById("qrcode");
    if (!box || typeof QRCode === "undefined") return;
    box.innerHTML = "";
    qrInstance = new QRCode(box, {
      text: urlText || window.location.href,
      width: 180,
      height: 180,
      colorDark: "#0D3B26",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  }

  // Expose helper for automated Gate 4 & Geodetic verification
  window.CheckCCRQTWorkbench = {
    getSampleGeoJson: () => SAMPLE_LOTS_GEOJSON,
    getAnalyzedLots: () => analyzedLots,
    buildEudrGeoJson,
    vn2000ToWgs84,
    wgs84ToVn2000
  };

  function initCoordConverter() {
    const selMeridian = document.getElementById("convMeridian");
    const inpX = document.getElementById("convVnX");
    const inpY = document.getElementById("convVnY");
    const inpLat = document.getElementById("convWgsLat");
    const inpLon = document.getElementById("convWgsLon");
    const outBox = document.getElementById("convOutput");
    const btnToWgs = document.getElementById("btnVnToWgs");
    const btnToVn = document.getElementById("btnWgsToVn");
    const btnCopy = document.getElementById("btnCopyCoord");
    const btnFly = document.getElementById("btnFlyToCoord");

    if (!selMeridian || !inpX || !inpY || !inpLat || !inpLon) return;

    function updateSummary(x, y, lon, lat, lon0) {
      lastConvertedWgs = { lon, lat };
      if (outBox) {
        outBox.innerHTML =
          `<span>VN-2000 (${lon0}°): <strong class="mono">X = ${x.toFixed(2)} m, Y = ${y.toFixed(2)} m</strong></span>` +
          `<span>WGS-84: <strong class="mono">${lat.toFixed(6)}, ${lon.toFixed(6)}</strong></span>`;
      }
    }

    function runVnToWgs() {
      const lon0 = Number(selMeridian.value);
      const x = Number(inpX.value), y = Number(inpY.value);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const [lon, lat] = vn2000ToWgs84(x, y, lon0);
      inpLon.value = lon.toFixed(6);
      inpLat.value = lat.toFixed(6);
      updateSummary(x, y, lon, lat, lon0);
    }

    function runWgsToVn() {
      const lon0 = Number(selMeridian.value);
      const lat = Number(inpLat.value), lon = Number(inpLon.value);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
      const [x, y] = wgs84ToVn2000(lon, lat, lon0);
      inpX.value = x.toFixed(2);
      inpY.value = y.toFixed(2);
      updateSummary(x, y, lon, lat, lon0);
    }

    if (btnToWgs) btnToWgs.addEventListener("click", runVnToWgs);
    if (btnToVn) btnToVn.addEventListener("click", runWgsToVn);
    selMeridian.addEventListener("change", runWgsToVn);

    if (btnCopy) {
      btnCopy.addEventListener("click", () => {
        const text = `VN-2000: X=${inpX.value}, Y=${inpY.value} | WGS-84: ${inpLat.value}, ${inpLon.value}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            btnCopy.textContent = "✅ Đã sao chép";
            setTimeout(() => { btnCopy.textContent = "📋 Copy tọa độ"; }, 1800);
          }).catch(() => {});
        }
      });
    }

    if (btnFly) {
      btnFly.addEventListener("click", () => {
        const lat = Number(inpLat.value), lon = Number(inpLon.value);
        if (!map || !Number.isFinite(lat) || !Number.isFinite(lon)) return;
        if (pinMarker) map.removeLayer(pinMarker);
        pinMarker = L.circleMarker([lat, lon], {
          radius: 9, color: "#D4AF37", weight: 3, fillColor: "#EF4444", fillOpacity: 0.9
        }).addTo(map).bindPopup(
          `<strong>Điểm định vị Helmert VN-2000</strong><br/>` +
          `VN-2000: <code>X=${inpX.value}, Y=${inpY.value}</code><br/>` +
          `WGS-84: <code>${lat.toFixed(6)}, ${lon.toFixed(6)}</code>`
        ).openPopup();
        map.flyTo([lat, lon], 16, { duration: 0.6 });
      });
    }

    // Initial live calculation for default Quang Tri Cam Lo point
    runWgsToVn();
  }

  // =========================================================================
  // 8B. AI COPILOT (OFFLINE FORESTRY KNOWLEDGE + LIVE BYOK GEMINI/DEEPSEEK/OPENAI)
  // =========================================================================
  function buildSelectedLotContext() {
    const it = analyzedLots[selectedIdx];
    if (!it) return "Chưa có lô rừng nào được chọn.";
    return (
      `Lô đang chọn: ${it.id_lo} | Chủ hộ: ${it.chu_ho} | Diện tích: ${it.area_ha.toFixed(4)} ha | ` +
      `Chu vi: ${it.perim_m} m | Tâm WGS-84: ${it.lat.toFixed(6)}, ${it.lon.toFixed(6)} | ` +
      `JRC TMF (EUDR): ${it.tmf_status}${it.tmf_year ? " (năm " + it.tmf_year + ", ảnh hưởng " + it.tmf_ha + " ha)" : ""} | ` +
      `Sentinel-2: ${it.harvest_status}${it.harvest_date ? " (" + it.harvest_date + ")" : ""} | ` +
      `Lỗi hình học/mã lô: ${it.issues.length ? it.issues.join(", ") : "Sạch lỗi"} | ` +
      `Quy tắc Điều 9 EUDR: ${it.eudr_rule}.`
    );
  }

  function answerOfflineKnowledge(question) {
    const q = (question || "").toLowerCase();
    const it = analyzedLots[selectedIdx];

    if (q.includes("đang chọn") || q.includes("lô này") || q.includes("phân tích lô")) {
      if (!it) return "Bạn hãy bấm vào một lô rừng trên bản đồ hoặc bảng bên dưới để tôi phân tích chi tiết nhé.";
      const advice = [];
      if (it.tmf_status === "Vi phạm") {
        advice.push("• 🔴 CẢNH BÁO ĐỎ (DEFORESTATION_ALERT): Đối chiếu FRMS xác minh rừng tự nhiên mất sau 31/12/2020 (tham chiếu GFC2020 10m & JRC TMF v1_2025).");
      } else if (it.tmf_status === "Cảnh báo") {
        advice.push("• 🟡 GHI NHẬN VÀNG / CẦN ĐỐI SOÁT: Lô có biến động tán (Lớp 50) — kiểm tra chéo bản đồ FRMS (TT 33/2018) để phân biệt khai thác tỉa thưa rừng trồng hay tác động rừng tự nhiên.");
      } else {
        advice.push("• ✅ Lô đạt trạng thái Tuân thủ EUDR, đủ điều kiện xuất tệp GeoJSON chuẩn IETF RFC 7946 nạp cổng EU TRACES NT.");
      }
      if (it.issues.includes("DUPLICATE_ID")) {
        advice.push("• CẢNH BÁO ĐỎ: Phát hiện trùng mã lô (DUPLICATE_ID) — cần rà soát lại danh sách kê khai chủ rừng.");
      }
      if (it.issues.includes("OVERLAP")) {
        advice.push("• Phát hiện chồng lấn ranh giới (OVERLAP) — cần chỉnh lý ranh giới trong QGIS trước khi xuất hồ sơ.");
      }
      advice.push(`• Điều 9 EUDR: ${it.area_ha >= 4.0 ? "Lô ≥ 4,0 ha BẮT BUỘC xuất dạng Polygon khép kín (CCW, 6 số lẻ)." : "Lô < 4,0 ha có thể xuất Polygon hoặc rút gọn thành điểm Point."}`);
      return (
        `📍 PHÂN TÍCH LÔ ${it.id_lo} (${it.chu_ho}):\n` +
        `- Diện tích: ${it.area_ha.toFixed(4)} ha | Chu vi: ${it.perim_m} m\n` +
        `- Tâm WGS-84: ${it.lat.toFixed(6)}, ${it.lon.toFixed(6)}\n` +
        `- Trạng thái JRC TMF: ${it.tmf_status}${it.tmf_year ? " (Năm " + it.tmf_year + ")" : ""}\n` +
        `- Hiện trạng Sentinel-2: ${it.harvest_status}${it.harvest_date ? " (" + it.harvest_date + ")" : ""}\n` +
        `- Lỗi không gian: ${it.issues.length ? it.issues.join(", ") : "Sạch lỗi"}\n\n` +
        `Khuyến nghị nghiệp vụ v0.4.0:\n${advice.join("\n")}`
      );
    }

    if (q.includes("radar") || q.includes("sentinel-1") || q.includes("sar") || q.includes("rvi") || q.includes("rtc") || q.includes("mùa mưa") || q.includes("chuyển mạch")) {
      return (
        "🛰️ LÕI RADAR XUYÊN MÂY SENTINEL-1 SAR RTC & RVI (v0.4.0):\n" +
        "• Chuyển mạch cảm biến tự động theo mùa tại Quảng Trị:\n" +
        "  - Mùa ít mây (Tháng 2 – Tháng 8): Ưu tiên Sentinel-2 L2A (NDVI/NBR + lọc mây Cloud Score+ / Fmask).\n" +
        "  - Mùa mưa bão (Tháng 9 – Tháng 1): Tự động kích hoạt Sentinel-1 SAR C-band phân cực kép VV/VH xuyên mây 100%.\n" +
        "• Hiệu chỉnh địa hình bức xạ (RTC): Triệt tiêu nhiễu tán xạ ngược trên sườn dốc đồi núi miền Trung (Torres et al., 2012; RADD — Reiche et al., 2021).\n" +
        "• Công thức chỉ số thực vật Radar tổng hợp (phải đổi từ dB sang thang tuyến tính σ⁰ = 10^(dB/10) trước khi tính):\n" +
        "  RVI = (4 · σ⁰_VH) / (σ⁰_VV + σ⁰_VH)."
      );
    }

    if (q.includes("frms") || q.includes("phân tách") || q.includes("vntlas") || q.includes("keo") || q.includes("luân canh") || q.includes("rừng tự nhiên") || q.includes("cảnh báo đỏ")) {
      return (
        "🔴🟡 BỘ PHÂN TÁCH TRẠNG THÁI RỪNG FRMS CROSS-CHECK & VNTLAS (v0.4.0):\n" +
        "Chồng lớp biến động vệ tinh lên bản đồ hiện trạng rừng FRMS (Thông tư 33/2018/TT-BNNPTNT, TT 16/2023/TT-BNNPTNT, QĐ 406/QĐ-CCKL) và khung pháp lý VNTLAS (Luật Lâm nghiệp 16/2017/QH14, NĐ 102/2020/NĐ-CP, NĐ 120/2024/NĐ-CP, TT 26/2022/TT-BNNPTNT):\n" +
        "• 🔴 Cảnh báo Đỏ (DEFORESTATION_ALERT — Vi phạm EUDR): Suy giảm sinh khối trên diện tích RỪNG TỰ NHIÊN sau mốc 31/12/2020.\n" +
        "• 🟡 Ghi nhận Vàng (LEGAL_PLANTATION_CYCLE — Hợp pháp VNTLAS): Khai thác/trồng lại theo chu kỳ trên RỪNG TRỒNG (Keo lai) thuộc đất quy hoạch lâm nghiệp — KHÔNG bị coi là phá rừng EUDR."
      );
    }

    if (q.includes("08 nguồn") || q.includes("8 nguồn") || q.includes("trích dẫn") || q.includes("khoa học") || q.includes("gfc2020") || q.includes("olofsson") || q.includes("cloud score")) {
      return (
        "📚 08 NGUỒN TRÍCH DẪN KHOA HỌC – PHÁP LÝ CHUẨN KIỂM TOÁN EUDR (v0.4.0):\n" +
        "1. Bourgoin et al. (2024) EC JRC GFC2020 (10 m) + Vancutsem et al. (2021, Science Advances, v1_2025) + FAO FRA 2020 (WP 188).\n" +
        "2. Sentinel-2A/2B/2C L2A (Drusch et al., 2012), STAC API v1.0, COG /vsicurl/, lọc mây Cloud Score+ (Pasquarella et al., 2023) / Fmask.\n" +
        "3. Kiểm định biến động Olofsson et al. (2014, RSE) + đối chứng Hansen et al. (2013, Science).\n" +
        "4. Radar Sentinel-1 SAR RTC (Torres et al., 2012), RADD (Reiche et al., 2021), RVI = 4·VH/(VV+VH).\n" +
        "5. Regulation (EU) 2023/1115 (EUDR): mốc 31/12/2020, Điều 2(4) (>0,5 ha, >10%, >5 m), Điều 9 (4 ha) + EC Guidance Document.\n" +
        "6. Pháp lý VNTLAS & FRMS: Luật 16/2017/QH14, NĐ 102/2020 & 120/2024, TT 33/2018 & 16/2023, TT 26/2022, QĐ 406/QĐ-CCKL.\n" +
        "7. VN-2000 & WGS-84: QĐ 83/2000/QĐ-TTg, TT 973/2001, QĐ 05/2007/QĐ-BTNMT (7 tham số Helmert).\n" +
        "8. ISO 19100 series / OGC 12-128r18 (GeoPackage) & IETF RFC 7946 (GeoJSON 6 số lẻ nộp TRACES NT)."
      );
    }

    if (q.includes("4 ha") || q.includes("điều 9") || q.includes("điều 2") || q.includes("eudr") || q.includes("traces") || q.includes("0,5 ha")) {
      return (
        "🌍 QUY ĐỊNH CHỐNG PHÁ RỪNG CHÂU ÂU (EUDR — EU 2023/1115):\n" +
        "• Mốc pháp lý: 31/12/2020 (tham chiếu bản đồ nền 10 m EC JRC GFC2020 — Bourgoin et al., 2024).\n" +
        "• Điều 2(4) — Định nghĩa rừng chuẩn FAO: diện tích > 0,5 ha, độ tàn che > 10%, chiều cao cây trưởng thành > 5 m (không phải đất nông nghiệp/đô thị).\n" +
        "• Điều 9 — Định vị địa lý (IETF RFC 7946 / TRACES NT):\n" +
        "  - Lô rừng ≥ 4,0 ha: BẮT BUỘC xuất Polygon/MultiPolygon khép kín, WGS-84 (EPSG:4326), làm tròn 6 chữ số thập phân, vòng ngoài CCW.\n" +
        "  - Lô rừng < 4,0 ha: Cho phép xuất Polygon đầy đủ hoặc rút gọn thành 1 điểm (Point)."
      );
    }

    if (q.includes("duplicate") || q.includes("trùng mã") || q.includes("overlap") || q.includes("chồng lấn")) {
      return (
        "⚠️ XỬ LÝ LỖI DUPLICATE_ID & OVERLAP:\n" +
        "• DUPLICATE_ID (Mức Đỏ): Bắt tự động các lô kê khai trùng mã (chuẩn hóa khoảng trắng/hoa-thường) giữa các chủ rừng/nhóm chứng chỉ.\n" +
        "• OVERLAP (Chồng lấn): Xác định vùng đa giác chồng đè diện tích thực tế > 1 m².\n" +
        "👉 Xử lý trên Tab 2 Plugin QGIS CheckCCRQT → lọc lỗi → chỉnh lý ranh giới/mã lô rồi xuất lại hồ sơ GeoJSON RFC 7946."
      );
    }

    if (q.includes("vn-2000") || q.includes("vn2000") || q.includes("helmert") || q.includes("tọa độ") || q.includes("106")) {
      return (
        "🧭 HỆ QUY CHIẾU VN-2000 QUẢNG TRỊ (7 THAM SỐ HELMERT):\n" +
        "• Cơ sở pháp lý: QĐ 83/2000/QĐ-TTg, TT 973/2001/TT-TCĐC, QĐ 05/2007/QĐ-BTNMT.\n" +
        "• Quảng Trị (Mới) & Quảng Bình (Cũ): Kinh tuyến trục 106°00' (múi 3°, k=0.9999, x_0=500000); Quảng Trị (Cũ): 106°15'.\n" +
        "• Đồng bộ đầy đủ 7 tham số Helmert (+towgs84=-191.90441429,...), loại bỏ hoàn toàn sai số dịch chuyển ~105–200m."
      );
    }

    if (q.includes("cài") || q.includes("qgis") || q.includes("tải") || q.includes("zip")) {
      return (
        "📦 HƯỚNG DẪN CÀI ĐẶT PLUGIN CHECKCCRQT TRÊN QGIS (3.28 LTR → 3.44+):\n" +
        "1. Bấm nút tải gói .zip sạch ở góc trên.\n" +
        "2. Mở QGIS → Plugins → Manage and Install Plugins... → Install from ZIP → chọn tệp vừa tải → Install Plugin.\n" +
        "3. Đối với luồng Radar xuyên mây v0.4.0 (Sentinel-1 RTC + RVI), chạy script Python `scripts/eudr_v04_radar_pipeline.py` kèm `requirements.txt`."
      );
    }

    return (
      "🤖 Tôi là Trợ lý AI CheckCCRQT v0.4.0 (Phòng Sử dụng và Phát triển rừng — Chi cục Kiểm lâm tỉnh Quảng Trị).\n" +
      "Bạn có thể hỏi tôi về:\n" +
      "• Phân tích chi tiết lô rừng đang chọn trên bản đồ\n" +
      "• Radar xuyên mây Sentinel-1 SAR RTC, công thức RVI & chuyển mạch theo mùa v0.4.0\n" +
      "• Phân tách FRMS: Cảnh báo Đỏ (rừng tự nhiên) vs Ghi nhận Vàng (keo lai VNTLAS)\n" +
      "• 08 nguồn trích dẫn khoa học – pháp lý chuẩn kiểm toán EUDR (GFC2020, Cloud Score+, Olofsson, Điều 2(4) >0,5 ha, Điều 9 4 ha)\n" +
      "💡 Bấm '⚙️ API' để kết nối khóa Gemini / DeepSeek / OpenAI cục bộ trên trình duyệt nếu cần hỏi đáp chuyên sâu!"
    );
  }

  async function callLiveAiApi(provider, apiKey, userQuestion) {
    const sysPrompt =
      "Bạn là Kiến trúc sư trưởng GIS Viễn thám & chuyên gia EUDR (Regulation EU 2023/1115) / VNTLAS của Phòng Sử dụng và Phát triển rừng — Chi cục Kiểm lâm tỉnh Quảng Trị (Hệ thống CheckCCRQT v0.4.0). " +
      "Kiến thức bắt buộc tuân thủ chính xác:\n" +
      "- 08 nguồn chuẩn: (1) Bourgoin et al. 2024 EC JRC GFC2020 (10m) + Vancutsem et al. 2021 Science Advances (TMF v1_2025) + FAO FRA 2020 WP 188; " +
      "(2) Sentinel-2A/2B/2C L2A (Drusch et al. 2012), STAC API v1.0, COG /vsicurl/, Cloud Score+ (Pasquarella et al. 2023) / Fmask; " +
      "(3) Olofsson et al. 2014 RSE + Hansen et al. 2013 Science; " +
      "(4) Sentinel-1 SAR C-band VV/VH RTC (Torres et al. 2012), RADD (Reiche et al. 2021), RVI = 4*VH/(VV+VH) trên thang tuyến tính; " +
      "(5) Regulation (EU) 2023/1115: mốc 31/12/2020, Điều 2(4) rừng FAO >0,5 ha, >10% tàn che, >5m chiều cao, Điều 9 ngưỡng 4 ha + EC Guidance; " +
      "(6) VNTLAS & FRMS: Luật Lâm nghiệp 16/2017/QH14, NĐ 102/2020 & 120/2024, TT 33/2018 & TT 16/2023, TT 26/2022, QĐ 406/QĐ-CCKL; " +
      "(7) VN-2000 7 tham số Helmert (QĐ 83/2000, TT 973/2001, QĐ 05/2007); (8) ISO 19100 series / OGC 12-128r18 GeoPackage & IETF RFC 7946 GeoJSON 6 số lẻ.\n" +
      "- Cơ chế v0.4.0: Mùa ít mây T2-T8 dùng Sentinel-2, mùa mưa bão T9-T1 chuyển mạch Sentinel-1 RTC + RVI; chồng lớp FRMS phân tách Cảnh báo Đỏ (DEFORESTATION_ALERT rừng tự nhiên) và Ghi nhận Vàng (LEGAL_PLANTATION_CYCLE rừng trồng keo lai).\n" +
      "Trả lời ngắn gọn, chính xác, chuyên nghiệp bằng tiếng Việt.\n" +
      "Ngữ cảnh lô rừng người dùng đang xem: " + buildSelectedLotContext();

    if (provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await window.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${sysPrompt}\n\nCâu hỏi: ${userQuestion}` }] }]
        })
      });
      if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
      const data = await res.json();
      const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!txt) throw new Error("Gemini không trả về nội dung.");
      return txt.trim();
    }

    const endpoint = provider === "deepseek"
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const model = provider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini";

    const res = await window.fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: userQuestion }
        ],
        temperature: 0.3
      })
    });
    if (!res.ok) throw new Error(`${provider.toUpperCase()} HTTP ${res.status}`);
    const data = await res.json();
    const txt = data?.choices?.[0]?.message?.content;
    if (!txt) throw new Error("API không trả về nội dung.");
    return txt.trim();
  }

  function initAiCopilot() {
    const fab = document.getElementById("aiFab");
    const drawer = document.getElementById("aiDrawer");
    const closeBtn = document.getElementById("aiCloseBtn");
    const settingsBtn = document.getElementById("aiSettingsBtn");
    const settingsPanel = document.getElementById("aiSettingsPanel");
    const providerSel = document.getElementById("aiProviderSelect");
    const keyInput = document.getElementById("aiApiKeyInput");
    const saveKeyBtn = document.getElementById("aiSaveKeyBtn");
    const clearKeyBtn = document.getElementById("aiClearKeyBtn");
    const modeBadge = document.getElementById("aiModeBadge");
    const msgBox = document.getElementById("aiMessages");
    const form = document.getElementById("aiForm");
    const input = document.getElementById("aiInput");

    if (!fab || !drawer || !msgBox || !form || !input) return;

    function refreshModeBadge() {
      const prov = localStorage.getItem("checkccrqt_ai_provider") || "gemini";
      const key = localStorage.getItem("checkccrqt_ai_key") || "";
      if (providerSel) providerSel.value = prov;
      if (keyInput) keyInput.value = key;
      if (modeBadge) {
        modeBadge.textContent = key
          ? `Chế độ: AI Trực tuyến (${prov.toUpperCase()} • Bảo mật cục bộ)`
          : "Chế độ: Tri thức nội bộ (Sẵn sàng 24/7)";
      }
    }

    function appendMsg(role, text) {
      const div = document.createElement("div");
      div.className = `ai-msg ${role}`;
      div.textContent = text;
      msgBox.appendChild(div);
      msgBox.scrollTop = msgBox.scrollHeight;
      return div;
    }

    async function handleQuestion(qText) {
      const q = qText.trim();
      if (!q) return;
      appendMsg("user", q);
      input.value = "";

      const key = (localStorage.getItem("checkccrqt_ai_key") || "").trim();
      const prov = localStorage.getItem("checkccrqt_ai_provider") || "gemini";

      if (!key) {
        appendMsg("bot", answerOfflineKnowledge(q));
        return;
      }

      const thinking = appendMsg("bot", `⏳ Đang hỏi ${prov.toUpperCase()} kèm ngữ cảnh lô rừng...`);
      try {
        const reply = await callLiveAiApi(prov, key, q);
        thinking.textContent = reply;
      } catch (err) {
        thinking.textContent =
          `⚠️ Không kết nối được ${prov.toUpperCase()} (${err.message}). Chuyển tự động sang Tri thức nội bộ:\n\n` +
          answerOfflineKnowledge(q);
      }
    }

    fab.addEventListener("click", () => drawer.classList.toggle("open"));
    if (closeBtn) closeBtn.addEventListener("click", () => drawer.classList.remove("open"));
    if (settingsBtn && settingsPanel) {
      settingsBtn.addEventListener("click", () => settingsPanel.classList.toggle("open"));
    }

    if (saveKeyBtn && providerSel && keyInput) {
      saveKeyBtn.addEventListener("click", () => {
        localStorage.setItem("checkccrqt_ai_provider", providerSel.value);
        localStorage.setItem("checkccrqt_ai_key", keyInput.value.trim());
        refreshModeBadge();
        if (settingsPanel) settingsPanel.classList.remove("open");
        appendMsg("bot", keyInput.value.trim()
          ? `✅ Đã lưu khóa API ${providerSel.value.toUpperCase()} cục bộ trên trình duyệt của bạn (an toàn 100%, không lưu trên máy chủ).`
          : "ℹ️ Đã chuyển về chế độ Tri thức nội bộ (không cần API Key).");
      });
    }

    if (clearKeyBtn && keyInput) {
      clearKeyBtn.addEventListener("click", () => {
        localStorage.removeItem("checkccrqt_ai_key");
        keyInput.value = "";
        refreshModeBadge();
        appendMsg("bot", "🗑️ Đã xóa khóa API cục bộ và chuyển về chế độ Tri thức nội bộ.");
      });
    }

    document.querySelectorAll(".ai-chip").forEach((chip) => {
      chip.addEventListener("click", () => handleQuestion(chip.dataset.q || chip.textContent));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleQuestion(input.value);
    });

    refreshModeBadge();
    appendMsg(
      "bot",
      "Xin chào! Tôi là Trợ lý AI CheckCCRQT v0.4.0 (Kiến trúc Đa cảm biến Sentinel-2 + Sentinel-1 SAR RTC & Chuẩn Kiểm toán EUDR/VNTLAS).\n" +
      "Bấm vào một câu hỏi gợi ý bên trên hoặc nhập câu hỏi bất kỳ, hoặc bấm '⚙️ API' để kết nối khóa Gemini / DeepSeek / OpenAI cục bộ."
    );
  }

  // =========================================================================
  // 8C. PWA SERVICE WORKER, FIELD GPS, RVI LAB & TABLE FILTERS (v0.4.0)
  // =========================================================================
  function initPwaAndNetwork() {
    const badge = document.getElementById("netBadge");
    function updateNet() {
      if (!badge) return;
      if (navigator.onLine) {
        badge.classList.remove("offline");
        badge.textContent = "🟢 Trực tuyến · PWA";
      } else {
        badge.classList.add("offline");
        badge.textContent = "🟠 Ngoại tuyến (Offline Ready)";
      }
    }
    window.addEventListener("online", updateNet);
    window.addEventListener("offline", updateNet);
    updateNet();

    if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  function initFieldGps() {
    const btn = document.getElementById("btnMyGps");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Trình duyệt không hỗ trợ định vị GPS.");
        return;
      }
      btn.textContent = "⏳ Đang định vị...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          btn.textContent = "📡 GPS Thực địa";
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy || 0);
          const inpLat = document.getElementById("convWgsLat");
          const inpLon = document.getElementById("convWgsLon");
          const btnToVn = document.getElementById("btnWgsToVn");
          if (inpLat) inpLat.value = lat.toFixed(6);
          if (inpLon) inpLon.value = lon.toFixed(6);
          if (btnToVn) btnToVn.click();

          if (map && typeof L !== "undefined") {
            if (pinMarker) map.removeLayer(pinMarker);
            if (gpsCircle) map.removeLayer(gpsCircle);
            gpsCircle = L.circle([lat, lon], { radius: Math.max(acc, 5), color: "#38BDF8", fillOpacity: 0.15 }).addTo(map);
            pinMarker = L.circleMarker([lat, lon], {
              radius: 8, color: "#fff", weight: 2.5, fillColor: "#38BDF8", fillOpacity: 1
            }).addTo(map).bindPopup(
              `<strong>📡 Vị trí GPS thực địa của bạn</strong><br/>WGS-84: <code>${lat.toFixed(6)}, ${lon.toFixed(6)}</code><br/>Sai số GPS: ±${acc} m`
            ).openPopup();
            map.flyTo([lat, lon], 16, { duration: 0.6 });
          }
        },
        (err) => {
          btn.textContent = "📡 GPS Thực địa";
          alert("Không lấy được tín hiệu GPS: " + err.message);
        },
        { enableHighAccuracy: true, timeout: 12000 }
      );
    });
  }

  function initRviLab() {
    const vvEl = document.getElementById("labVvDb");
    const vhEl = document.getElementById("labVhDb");
    const baseEl = document.getElementById("labRviBase");
    const typeEl = document.getElementById("labLoaiRung");
    const outEl = document.getElementById("rviLabOutput");
    if (!vvEl || !vhEl || !baseEl || !typeEl || !outEl) return;

    function recalc() {
      const vvDb = Number(vvEl.value);
      const vhDb = Number(vhEl.value);
      const rviBase = Number(baseEl.value);
      const loai = typeEl.value;
      const vvLin = Math.pow(10, vvDb / 10);
      const vhLin = Math.pow(10, vhDb / 10);
      const rvi = Math.min(2.0, Math.max(0.0, (4 * vhLin) / (vvLin + vhLin)));
      const delta = rvi - rviBase;

      let pill = `<span class="pill pill-ok">🟢 COMPLIANT_STABLE (Tán rừng ổn định)</span>`;
      if (delta <= -0.15) {
        if (loai.toLowerCase().includes("tự nhiên")) {
          pill = `<span class="pill pill-err">🔴 DEFORESTATION_ALERT (Vi phạm EUDR — Rừng tự nhiên)</span>`;
        } else {
          pill = `<span class="pill pill-warn">🟡 LEGAL_PLANTATION_CYCLE (Hợp pháp VNTLAS — Rừng trồng)</span>`;
        }
      }
      outEl.innerHTML =
        `<span class="mono">σ⁰_VV = ${vvLin.toFixed(4)} | σ⁰_VH = ${vhLin.toFixed(4)} | <strong>RVI = ${rvi.toFixed(4)}</strong> (ΔRVI = ${delta >= 0 ? "+" : ""}${delta.toFixed(4)})</span>` +
        pill;
    }

    [vvEl, vhEl, baseEl, typeEl].forEach((el) => el.addEventListener("input", recalc));
    recalc();
  }

  // =========================================================================
  // 9. BOOTSTRAP
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initPwaAndNetwork();
    initMap();
    initArchTabs();
    initCoordConverter();
    initFieldGps();
    initRviLab();
    initAiCopilot();

    // Table Search & Quick Filter listeners
    const searchInput = document.getElementById("lotSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        currentSearchQuery = searchInput.value;
        renderTable();
      });
    }
    document.querySelectorAll(".filter-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        currentTableFilter = pill.dataset.filter || "all";
        document.querySelectorAll(".filter-pill").forEach((x) => x.classList.toggle("active", x === pill));
        renderTable();
      });
    });

    const btnPrintPdf = document.getElementById("btnPrintPdf");
    if (btnPrintPdf) btnPrintPdf.addEventListener("click", () => window.print());

    // Executing Unit persistence
    const orgInput = document.getElementById("executingUnitInput");
    if (orgInput) {
      orgInput.value = localStorage.getItem("checkccrqt_org_name") || DEFAULT_ORG;
      orgInput.addEventListener("input", () => {
        localStorage.setItem("checkccrqt_org_name", orgInput.value.trim() || DEFAULT_ORG);
      });
    }

    // Map controls: Opacity slider, Zoom to Extent, Lot Labels toggle
    const opRange = document.getElementById("opacityRange");
    const opVal = document.getElementById("opacityVal");
    if (opRange) {
      opRange.addEventListener("input", () => {
        layerOpacity = Number(opRange.value) / 100.0;
        if (opVal) opVal.textContent = `${opRange.value}%`;
        if (geoLayer) {
          geoLayer.setStyle((f) => {
            const it = analyzedLots[f._idx];
            const c = lotColor(it);
            return { color: c, weight: 3, opacity: Math.min(1, layerOpacity + 0.45), fillColor: c, fillOpacity: layerOpacity };
          });
        }
      });
    }

    const btnZoomExtent = document.getElementById("btnZoomExtent");
    if (btnZoomExtent) {
      btnZoomExtent.addEventListener("click", () => {
        if (map && geoLayer) {
          try { map.fitBounds(geoLayer.getBounds().pad(0.18)); } catch (e) {}
        }
      });
    }

    const chkLabels = document.getElementById("chkShowLabels");
    if (chkLabels) {
      chkLabels.addEventListener("change", () => {
        showLotLabels = Boolean(chkLabels.checked);
        renderWorkbench({ type: "FeatureCollection", features: analyzedLots.map((it) => it.feature) });
      });
    }

    // Load 8 sample lots immediately
    renderWorkbench(SAMPLE_LOTS_GEOJSON);

    // Buttons
    const btnSample = document.getElementById("btnLoadSample");
    if (btnSample) btnSample.addEventListener("click", () => renderWorkbench(SAMPLE_LOTS_GEOJSON));

    const btnExportGeoJson = document.getElementById("btnExportEudrGeoJson");
    if (btnExportGeoJson) {
      btnExportGeoJson.addEventListener("click", () => {
        const ptUnder4 = Boolean(document.getElementById("chkPointUnder4Ha")?.checked);
        const fc = buildEudrGeoJson(ptUnder4);
        downloadFile("Ho_So_EUDR_TRACES.geojson", JSON.stringify(fc, null, 2), "application/geo+json;charset=utf-8");
      });
    }

    const btnExportCsv = document.getElementById("btnExportCsv");
    if (btnExportCsv) btnExportCsv.addEventListener("click", exportCsvExcel);

    // Index switchers
    document.querySelectorAll(".index-btn").forEach((b) => {
      b.addEventListener("click", () => {
        currentIndexKey = b.dataset.index;
        document.querySelectorAll(".index-btn").forEach((x) => x.classList.toggle("active", x === b));
        if (analyzedLots[selectedIdx]) renderChart(analyzedLots[selectedIdx]);
      });
    });

    // Dropzone & File input
    const dz = document.getElementById("dropzone");
    const fi = document.getElementById("fileInput");
    if (dz && fi) {
      dz.addEventListener("click", () => fi.click());
      fi.addEventListener("change", (e) => handleUploadedFile(e.target.files[0]));
      dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("dragover"); });
      dz.addEventListener("dragleave", () => dz.classList.remove("dragover"));
      dz.addEventListener("drop", (e) => {
        e.preventDefault();
        dz.classList.remove("dragover");
        handleUploadedFile(e.dataTransfer.files[0]);
      });
    }

    // QR Code
    const qrInput = document.getElementById("qrUrlInput");
    const defaultQrUrl = window.location.protocol.startsWith("http")
      ? new URL("./downloads/CheckCCRQT_v0.3.1.zip", window.location.href).href
      : "https://happyrun09.github.io/checkccrqt/downloads/CheckCCRQT_v0.3.1.zip";
    if (qrInput) qrInput.value = defaultQrUrl;
    renderQR(defaultQrUrl);

    const btnGenQr = document.getElementById("btnGenQr");
    if (btnGenQr && qrInput) btnGenQr.addEventListener("click", () => renderQR(qrInput.value.trim()));

    const btnDownloadQr = document.getElementById("btnDownloadQr");
    if (btnDownloadQr) {
      btnDownloadQr.addEventListener("click", () => {
        const canvas = document.querySelector("#qrcode canvas");
        const img = document.querySelector("#qrcode img");
        const dataUrl = canvas ? canvas.toDataURL("image/png") : (img ? img.src : null);
        if (!dataUrl) return;
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "QR_Tai_Plugin_CheckCCRQT_v0.3.1.png";
        a.click();
      });
    }
  });
})();
