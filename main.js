var app = document.getElementById('app');
app.innerHTML = '<p class="loading">読み込み中...</p>';

fetch('./links.json')
  .then(function(res) {
    if (!res.ok) throw new Error(res.status);
    return res.json();
  })
  .then(render)
  .catch(function() {
    document.getElementById('app').innerHTML =
      '<p class="error">リンクの読み込みに失敗しました。</p>';
  });

function render(data) {
  var app = document.getElementById('app');

  data.forEach(function(category) {
    if (!category.links || category.links.length === 0) return;

    var section = document.createElement('section');

    var heading = document.createElement('h2');
    heading.className = 'category-heading';
    heading.textContent = category.category;
    section.appendChild(heading);

    var grid = document.createElement('div');
    grid.className = 'link-grid';

    (category.links || []).forEach(function(link) {
      var card = document.createElement('a');
      card.className = 'link-card';
      card.href = link.url || '#';

      var title = document.createElement('span');
      title.className = 'link-title';
      title.textContent = link.title || '(無題)';

      var domain = document.createElement('span');
      domain.className = 'link-domain';
      // Relative URLs (e.g. "memo.html") throw in new URL(); treat them as same-site pages opened in the same tab.
      try {
        domain.textContent = new URL(link.url).hostname;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
      } catch (_) {
        domain.textContent = 'サイト内ページ';
      }

      card.appendChild(title);
      card.appendChild(domain);

      if (link.note) {
        var note = document.createElement('span');
        note.className = 'link-note';
        note.textContent = link.note;
        card.appendChild(note);
      }

      grid.appendChild(card);
    });

    section.appendChild(grid);
    app.appendChild(section);
  });
}
