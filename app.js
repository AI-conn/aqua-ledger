(function () {
  "use strict";

  var STORE_KEY = "aqualedger.entries.v1";
  var TARGET_KEY = "aqualedger.target.v1";
  var THEME_KEY = "aqualedger.theme.v1";

  var CATEGORIES = [
    { id: "drinking", label: "Drinking", defaultL: 2 },
    { id: "cooking", label: "Cooking", defaultL: 8 },
    { id: "hygiene", label: "Hygiene", defaultL: 30 },
    { id: "cleaning", label: "Cleaning", defaultL: 15 },
    { id: "garden", label: "Garden / other", defaultL: 10 }
  ];

  var $ = function (sel) { return document.querySelector(sel); };
  var form = $("#entry-form");
  var statusEl = $("#form-status");
  var entriesBody = $("#entries-table tbody");

  function todayISO() {
    var d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function shiftISO(iso, days) {
    var d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + days);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage may be disabled */ }
  }

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle("error", Boolean(isError));
  }

  function buildCategoryInputs() {
    var grid = $("#cat-grid");
    CATEGORIES.forEach(function (cat) {
      var wrap = document.createElement("div");
      wrap.className = "field";
      var label = document.createElement("label");
      label.textContent = cat.label + " (L)";
      label.htmlFor = "cat-" + cat.id;
      var input = document.createElement("input");
      input.type = "number";
      input.id = "cat-" + cat.id;
      input.min = "0";
      input.max = "10000";
      input.step = "0.1";
      input.inputMode = "decimal";
      input.value = "0";
      input.setAttribute("data-cat", cat.id);
      input.addEventListener("input", syncTotal);
      wrap.appendChild(label);
      wrap.appendChild(input);
      grid.appendChild(wrap);
    });
  }

  function catSum() {
    var sum = 0;
    CATEGORIES.forEach(function (cat) {
      var input = document.querySelector('[data-cat="' + cat.id + '"]');
      if (!input) return;
      var n = parseFloat(input.value);
      if (!isNaN(n) && n > 0) sum += n;
    });
    return Math.round(sum * 10) / 10;
  }

  function syncTotal() {
    $("#entry-total").value = String(catSum());
  }

  function entries() {
    var data = load(STORE_KEY, []);
    return Array.isArray(data) ? data : [];
  }

  function writeEntries(list) {
    save(STORE_KEY, list);
    render();
  }

  function target() {
    var t = parseFloat($("#target").value);
    return isNaN(t) || t <= 0 ? 100 : t;
  }

  function totalFor(dateISO) {
    return entries().reduce(function (sum, e) {
      return e.date === dateISO ? sum + (Number(e.total) || 0) : sum;
    }, 0);
  }

  function render() {
    var list = entries();
    var goal = target();

    var today = totalFor(todayISO());
    $("#stat-today").innerHTML = today.toFixed(1) + " <small>L</small>";

    var seven = [];
    for (var i = 6; i >= 0; i--) seven.push(shiftISO(todayISO(), -i));
    var vals = seven.map(totalFor);
    var avg = vals.reduce(function (a, b) { return a + b; }, 0) / 7;
    $("#stat-avg").innerHTML = avg.toFixed(1) + " <small>L</small>";

    var pct = goal > 0 ? Math.min(100, Math.round((today / goal) * 100)) : 0;
    $("#progress-bar").style.width = pct + "%";
    $("#progress").setAttribute("aria-valuenow", String(pct));
    $("#progress-pct").textContent = pct + "%";
    $("#goal-note").textContent = today === 0
      ? "Log an entry to see progress."
      : (today > goal
          ? "Over target by " + (today - goal).toFixed(1) + " L today."
          : (goal - today).toFixed(1) + " L under target today.");

    renderChart(seven, vals, goal);
    renderTable(list);
  }

  function renderChart(dates, vals, goal) {
    var chart = $("#chart");
    chart.innerHTML = "";
    var max = Math.max(goal, Math.max.apply(null, vals.concat([1]))) * 1.15;
    dates.forEach(function (date, idx) {
      var v = vals[idx];
      var col = document.createElement("div");
      col.className = "bar-col";

      var value = document.createElement("span");
      value.className = "bar-value";
      value.textContent = v.toFixed(0);

      var bar = document.createElement("div");
      bar.className = "bar" + (v > goal ? " over" : "");
      bar.style.height = Math.max(2, Math.round((v / max) * 100)) + "%";
      bar.title = date + ": " + v.toFixed(1) + " L";

      var label = document.createElement("span");
      label.className = "bar-label";
      label.textContent = date.slice(5);

      col.appendChild(value);
      col.appendChild(bar);
      col.appendChild(label);
      chart.appendChild(col);
    });
    chart.setAttribute("aria-label",
      "Water use for " + dates[0] + " through " + dates[6] +
      ": " + vals.map(function (v, i) { return dates[i] + " " + v.toFixed(1) + " litres"; }).join(", "));
  }

  function renderTable(list) {
    entriesBody.innerHTML = "";
    $("#empty-note").hidden = list.length > 0;
    list.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).forEach(function (e) {
      var tr = document.createElement("tr");

      var dateTd = document.createElement("td");
      dateTd.textContent = e.date;

      var catTd = document.createElement("td");
      var parts = CATEGORIES.filter(function (c) { return e.categories && e.categories[c.id]; })
        .map(function (c) { return c.label + " " + e.categories[c.id] + " L"; });
      catTd.textContent = parts.length ? parts.join(", ") : "—";

      var totalTd = document.createElement("td");
      totalTd.className = "num";
      totalTd.textContent = Number(e.total).toFixed(1);

      var actionTd = document.createElement("td");
      var del = document.createElement("button");
      del.type = "button";
      del.className = "del";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete entry for " + e.date);
      del.addEventListener("click", function () {
        writeEntries(entries().filter(function (x) { return x.date !== e.date; }));
        setStatus("Entry deleted.");
      });
      actionTd.appendChild(del);

      tr.appendChild(dateTd);
      tr.appendChild(catTd);
      tr.appendChild(totalTd);
      tr.appendChild(actionTd);
      entriesBody.appendChild(tr);
    });
  }

  function collectCategories() {
    var out = {};
    CATEGORIES.forEach(function (cat) {
      var input = document.querySelector('[data-cat="' + cat.id + '"]');
      if (!input) return;
      var n = parseFloat(input.value);
      if (!isNaN(n) && n > 0) out[cat.id] = n;
    });
    return out;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var date = $("#entry-date").value;
    var total = parseFloat($("#entry-total").value);
    if (!date) { setStatus("Pick a date first.", true); return; }
    if (isNaN(total) || total < 0) { setStatus("Enter a valid total in litres.", true); return; }

    var entry = { date: date, total: total, categories: collectCategories() };
    var list = entries().filter(function (e) { return e.date !== date; });
    list.push(entry);
    writeEntries(list);
    setStatus("Saved " + total.toFixed(1) + " L for " + date + ".");
    form.reset();
    $("#entry-date").value = todayISO();
    CATEGORIES.forEach(function (c) {
      var input = document.querySelector('[data-cat="' + c.id + '"]');
      if (input) input.value = "0";
    });
  });

  $("#clear-form").addEventListener("click", function () {
    form.reset();
    $("#entry-date").value = todayISO();
    CATEGORIES.forEach(function (c) {
      var input = document.querySelector('[data-cat="' + c.id + '"]');
      if (input) input.value = "0";
    });
    setStatus("");
  });

  $("#target").addEventListener("input", function () {
    save(TARGET_KEY, target());
    render();
  });

  $("#export").addEventListener("click", function () {
    var payload = { app: "aqua-ledger", version: 1, exportedAt: new Date().toISOString(), entries: entries() };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "aqua-ledger-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus("Export downloaded.");
  });

  $("#import-toggle").addEventListener("click", function () {
    var panel = $("#import-panel");
    panel.hidden = !panel.hidden;
  });

  $("#import-run").addEventListener("click", function () {
    try {
      var data = JSON.parse($("#import-text").value);
      var incoming = data && data.entries;
      if (!Array.isArray(incoming)) throw new Error("no entries array");
      var clean = incoming.filter(function (e) {
        return e && typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && !isNaN(parseFloat(e.total));
      }).map(function (e) {
        return { date: e.date, total: parseFloat(e.total), categories: e.categories || {} };
      });
      writeEntries(clean);
      setStatus("Imported " + clean.length + " entries.");
      $("#import-panel").hidden = true;
      $("#import-text").value = "";
    } catch (e) {
      setStatus("Import failed: invalid JSON or missing entries.", true);
    }
  });

  $("#seed").addEventListener("click", function () {
    var list = [];
    var samples = [42, 88, 65, 110, 73, 95, 58];
    for (var i = 6; i >= 0; i--) {
      list.push({
        date: shiftISO(todayISO(), -i),
        total: samples[6 - i],
        categories: { drinking: 2, cooking: 8, hygiene: samples[6 - i] - 30, cleaning: 10, garden: 10 }
      });
    }
    writeEntries(list);
    setStatus("Sample week loaded (replace with your own data before submitting).");
  });

  $("#theme-toggle").addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    save(THEME_KEY, next);
    this.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    this.textContent = next === "dark" ? "Light mode" : "Dark mode";
  });

  var storedTarget = load(TARGET_KEY, 100);
  if (typeof storedTarget === "number" && storedTarget > 0) $("#target").value = String(storedTarget);
  var storedTheme = load(THEME_KEY, "light");
  if (storedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    $("#theme-toggle").setAttribute("aria-pressed", "true");
    $("#theme-toggle").textContent = "Light mode";
  }

  buildCategoryInputs();
  $("#entry-date").value = todayISO();
  render();
})();
