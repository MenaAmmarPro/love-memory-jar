"use strict";

/*
 * love-memory-jar — reach into a jar of little moments.
 *
 * The jar starts with window.MENA_MEMORIES (js/memories-data.js). Anything
 * added on the page is kept in localStorage, on this device only.
 */

(function () {
  const STORE_KEY = "mena-memory-jar";
  const PRESET = Array.isArray(window.MENA_MEMORIES) ? window.MENA_MEMORIES : [];

  const els = {
    jar: document.getElementById("jar"),
    count: document.getElementById("memory-count"),
    note: document.getElementById("note"),
    noteText: document.getElementById("note-text"),
    noteDate: document.getElementById("note-date"),
    draw: document.getElementById("draw"),
    status: document.getElementById("memory-status"),
    form: document.getElementById("memory-form"),
    text: document.getElementById("memory-text"),
    date: document.getElementById("memory-date"),
    reset: document.getElementById("memory-reset"),
    list: document.getElementById("memory-list")
  };

  let userMemories = load();
  let lastIndex = -1;

  function load() {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((m) => m && typeof m.text === "string") : [];
    } catch {
      return [];
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(userMemories));
    } catch {
      /* memories still work for this visit */
    }
  }

  function all() {
    return PRESET.concat(userMemories);
  }

  function setStatus(message) {
    if (els.status) els.status.textContent = message || "";
  }

  function toast(message) {
    if (typeof window.fxToast === "function") {
      window.fxToast(message);
    } else {
      setStatus(message);
    }
  }

  function renderCount() {
    if (!els.count) return;
    const total = all().length;
    els.count.textContent =
      total + (total === 1 ? " memory in the jar" : " memories in the jar") +
      (userMemories.length ? " \u2014 " + userMemories.length + " of them yours" : "");
  }

  function renderList() {
    if (!els.list) return;
    els.list.textContent = "";
    const items = all().slice().reverse();
    items.forEach((memory) => {
      const li = document.createElement("li");
      li.className = "memory-item";
      const text = document.createElement("p");
      text.className = "memory-item-text";
      text.textContent = memory.text;
      li.appendChild(text);
      if (memory.date) {
        const date = document.createElement("span");
        date.className = "memory-item-date";
        date.textContent = memory.date;
        li.appendChild(date);
      }
      els.list.appendChild(li);
    });
  }

  function shakeJar() {
    if (!els.jar) return;
    els.jar.classList.remove("is-shaking");
    void els.jar.offsetWidth;
    els.jar.classList.add("is-shaking");
    setTimeout(() => {
      if (els.jar) els.jar.classList.remove("is-shaking");
    }, 600);
  }

  function showMemory(memory, index) {
    if (els.note) {
      els.note.dataset.open = "false";
      requestAnimationFrame(() => {
        if (els.noteText) els.noteText.textContent = memory.text;
        if (els.noteDate) {
          els.noteDate.textContent = memory.date || "";
          els.noteDate.hidden = !memory.date;
        }
        els.note.dataset.open = "true";
      });
    }
    lastIndex = index;
  }

  function drawMemory() {
    const items = all();
    if (!items.length) {
      setStatus("The jar is empty \u2014 add a memory below \u2665");
      return;
    }
    let index = Math.floor(Math.random() * items.length);
    if (items.length > 1) {
      let guard = 0;
      while (index === lastIndex && guard < 10) {
        index = Math.floor(Math.random() * items.length);
        guard += 1;
      }
    }
    shakeJar();
    showMemory(items[index], index);
    setStatus("");
  }

  function addMemory(event) {
    if (event) event.preventDefault();
    const text = els.text ? els.text.value.trim() : "";
    if (!text) {
      setStatus("Write a little something first \u2665");
      if (els.text) els.text.focus();
      return;
    }
    const date = els.date ? els.date.value.trim() : "";
    userMemories.unshift({ text: text, date: date });
    save();
    if (els.form) els.form.reset();
    renderCount();
    renderList();
    toast("Saved to the jar \u2014 thank you \u2665");
  }

  function resetMemories() {
    if (!userMemories.length) {
      setStatus("There's nothing of yours to clear yet.");
      return;
    }
    userMemories = [];
    save();
    renderCount();
    renderList();
    setStatus("Cleared your added memories. Mine are still safe in there.");
  }

  function init() {
    renderCount();
    renderList();
    if (els.draw) els.draw.addEventListener("click", drawMemory);
    if (els.form) els.form.addEventListener("submit", addMemory);
    if (els.reset) els.reset.addEventListener("click", resetMemories);
    drawMemory();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
