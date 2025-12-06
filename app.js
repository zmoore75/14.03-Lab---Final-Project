// small helper for year
document.querySelectorAll('#year,#year2,#year3,#year4').forEach(el => {
  if (el) el.textContent = new Date().getFullYear();
});

// mobile nav toggles 
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = document.getElementById(btn.getAttribute('aria-controls'));
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (nav) nav.classList.toggle('open');
  });
});

(function () {
  const form = document.getElementById('commentForm');
  const list = document.getElementById('commentsList');
  const clearBtn = document.getElementById('clearComments');
  if (!form || !list) return;

  function readComments() {
    const raw = localStorage.getItem('dd_comments_v1');
    return raw ? JSON.parse(raw) : [];
  }

  function saveComments(arr) {
    localStorage.setItem('dd_comments_v1', JSON.stringify(arr));
  }

  function renderComments() {
    const arr = readComments();
    list.innerHTML = '';
    if (!arr.length) {
      list.innerHTML = '<p class="muted">No comments yet — be the first!</p>';
      return;
    }
    arr.slice().reverse().forEach((c, idx) => {
      const el = document.createElement('div');
      el.className = 'comment';
      el.innerHTML = `
        <div class="meta"><strong>${escapeHtml(c.name)}</strong> • <span class="muted">${new Date(c.t).toLocaleString()}</span></div>
        <div class="text">${escapeHtml(c.text)}</div>
        <div style="margin-top:8px;text-align:right"><button data-index="${idx}" class="btn small outline delete">Delete</button></div>
      `;
      list.appendChild(el);
    });

    list.querySelectorAll('.delete').forEach(btn => btn.addEventListener('click', ev => {
      const arr = readComments();
      arr.pop();
      saveComments(arr);
      renderComments();
    }));
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const name = document.getElementById('name').value.trim() || 'Anonymous';
    const message = document.getElementById('message').value.trim();
    if (!message) return;
    const arr = readComments();
    arr.push({ name, text: message, t: Date.now() });
    saveComments(arr);
    form.reset();
    renderComments();
  });

  clearBtn && clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all local demo comments?')) return;
    localStorage.removeItem('dd_comments_v1');
    renderComments();
  });

  renderComments();
})();
