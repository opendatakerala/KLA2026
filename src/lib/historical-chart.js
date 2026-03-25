import * as echarts from "echarts";

const STORAGE_KEY = "historicalViewMode";
const COLORS = {
  LDF: "#D94040",
  UDF: "#1565C0",
  NDA: "#E07828",
  Others: "#33AA55"
};

let chart = null;
let currentView = "bars";
let currentData = null;

function getStoredView() {
  return localStorage.getItem(STORAGE_KEY) || "bars";
}

function saveView(view) {
  localStorage.setItem(STORAGE_KEY, view);
}

export function initHistoricalChart(dataStr) {
  currentView = getStoredView();
  currentData = JSON.parse(dataStr);
  
  const container = document.getElementById("modal-historical");
  if (!container || !currentData || currentData.length === 0) {
    container.innerHTML = "";
    return;
  }

  const switcherHtml = `
    <div class="historical-chart-container" id="historical-chart-container">
      <div class="historical-switcher">
        <button class="hist-switch-btn ${currentView === 'bars' ? 'active' : ''}" data-view="bars">Bars</button>
        <button class="hist-switch-btn ${currentView === 'line' ? 'active' : ''}" data-view="line">Line</button>
        <button class="hist-switch-btn ${currentView === 'stacked' ? 'active' : ''}" data-view="stacked">Stacked</button>
      </div>
      <div class="historical-content" id="historical-content"></div>
      <div class="historical-chart" id="historical-chart"></div>
    </div>
  `;
  
  container.innerHTML = switcherHtml;
  
  const btns = container.querySelectorAll(".hist-switch-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentView = btn.dataset.view;
      saveView(currentView);
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render(currentData);
    });
  });
  
  render(currentData);
}

function render(data) {
  if (!data) return;
  
  const content = document.getElementById("historical-content");
  const chartEl = document.getElementById("historical-chart");
  if (!content || !chartEl) return;

  if (currentView === "bars") {
    renderBars(data, content, chartEl);
  } else if (currentView === "line") {
    renderLine(data, content, chartEl);
  } else if (currentView === "stacked") {
    renderStacked(data, content, chartEl);
  }
}

function renderBars(data, content, chartEl) {
  chartEl.style.display = "none";
  content.style.display = "block";

  let html = '<div class="modal-historical">';
  data.forEach(d => {
    html += `<div class="historical-year"><div class="historical-year-label">${d.year}</div>`;
    ["LDF", "UDF", "NDA", "Others"].forEach(al => {
      if (d.allianceVotes[al] > 0) {
        const pct = d.totalVotes > 0 ? ((d.allianceVotes[al] / d.totalVotes) * 100).toFixed(1) : 0;
        html += `<div class="historical-bar"><span class="historical-alliance ${al}">${al}</span><div class="historical-bar-track"><div class="historical-bar-fill" style="width:${pct}%;background:${COLORS[al]}"></div></div><span class="historical-pct">${pct}%</span></div>`;
      }
    });
    html += "</div>";
  });
  html += "</div>";
  content.innerHTML = html;
}

function renderLine(data, content, chartEl) {
  content.style.display = "none";
  chartEl.style.display = "block";

  if (chart) chart.dispose();
  chart = echarts.init(chartEl, null, { renderer: "svg" });

  const series = ["LDF", "UDF", "NDA", "Others"].map(alliance => {
    const values = data.map(d => {
      const pct = d.totalVotes > 0 ? (d.allianceVotes[alliance] / d.totalVotes) * 100 : 0;
      return parseFloat(pct.toFixed(1));
    });
    return {
      name: alliance,
      type: "line",
      data: values,
      smooth: true,
      itemStyle: { color: COLORS[alliance] },
      lineStyle: { width: 2 },
      symbol: "circle",
      symbolSize: 8
    };
  });

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        return params.map(p => `${p.seriesName}: ${p.value}%`).join("<br>");
      }
    },
    legend: {
      data: ["LDF", "UDF", "NDA", "Others"],
      bottom: 0,
      textStyle: { fontFamily: "DM Mono", fontSize: 10 }
    },
    grid: { left: 40, right: 20, top: 20, bottom: 50 },
    xAxis: {
      type: "category",
      data: data.map(d => d.year),
      axisLabel: { fontFamily: "DM Mono", fontSize: 10 },
      axisLine: { lineStyle: { color: "#ccc" } }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
        fontFamily: "DM Mono",
        fontSize: 10
      },
      max: 100,
      splitLine: { lineStyle: { color: "#eee" } }
    },
    series
  };

  chart.setOption(option);
}

function renderStacked(data, content, chartEl) {
  content.style.display = "none";
  chartEl.style.display = "block";

  if (chart) chart.dispose();
  chart = echarts.init(chartEl, null, { renderer: "svg" });

  const series = ["LDF", "UDF", "NDA", "Others"]
    .filter(alliance => data.some(d => d.allianceVotes[alliance] > 0))
    .map(alliance => ({
      name: alliance,
      type: "bar",
      stack: "total",
      data: data.map(d => {
        const pct = d.totalVotes > 0 ? (d.allianceVotes[alliance] / d.totalVotes) * 100 : 0;
        return parseFloat(pct.toFixed(1));
      }),
      itemStyle: { color: COLORS[alliance] },
      barWidth: 40
    }));

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        let total = params.reduce((sum, p) => sum + p.value, 0);
        return params.map(p => `${p.seriesName}: ${p.value}%`).join("<br>") + `<br><strong>Total: ${total.toFixed(1)}%</strong>`;
      }
    },
    legend: {
      data: series.map(s => s.name),
      bottom: 0,
      textStyle: { fontFamily: "DM Mono", fontSize: 10 }
    },
    grid: { left: 40, right: 20, top: 20, bottom: 50 },
    xAxis: {
      type: "category",
      data: data.map(d => d.year),
      axisLabel: { fontFamily: "DM Mono", fontSize: 10 },
      axisLine: { lineStyle: { color: "#ccc" } }
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
        fontFamily: "DM Mono",
        fontSize: 10
      },
      max: 100,
      splitLine: { lineStyle: { color: "#eee" } }
    },
    series
  };

  chart.setOption(option);
}

window.addEventListener("resize", () => {
  if (chart) chart.resize();
});
