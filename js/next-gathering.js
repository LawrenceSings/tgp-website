/* Auto-updates the homepage "This Sunday" block, the "What's Coming Up" cards,
   and every page's footer "Next Gathering" from TGP's monthly rhythm:
   1st Sunday — First Fellowship · 2nd & 4th — Grow Home · 3rd — TGP LIVE · 5th — The Fifth Table
   Plus, when the calendar feed is reachable (proxied at /calendar.ics via Netlify),
   the upcoming cards use the real event list (incl. Gather + Grow Bible Study) and
   First Fellowship shows its exact location for the week.

   IMAGES — standing photos per gathering type, swapped in automatically when the
   files exist (until then the brand gradient placeholders show):
     images/hero-first-fellowship.jpg   big "This Sunday" photo (~1200px wide)
     images/card-first-fellowship.jpg   smaller upcoming-card photo (~800px wide)
     ...same pattern: hero-/card- + grow-home, tgp-live, fifth-table,
     and card-gather-grow.jpg, card-collide.jpg for non-Sunday events. */

(function () {
  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var calLink = '<a href="events.html#calendar" style="color:#C38A84; font-weight:700;">check the calendar</a>';

  var META = {
    'first-fellowship': {
      name: 'First Fellowship', sub: 'First Sunday Gathering', bg: 'gold-bg',
      desc: 'A meal, an engaging activity, and insightful teaching around the table with our neighbors.',
      heroDesc: 'A gathering of friends, family, and community around a table. Join us for a meal, an engaging activity, and insightful teaching with our neighbors.',
      when: '12:30–2:30 PM', where: 'Location varies — ' + calLink,
      footWhere: 'Location varies — see the calendar', link: 'sundays.html'
    },
    'grow-home': {
      name: 'Grow Home', sub: 'Living Room Gatherings', bg: 'rose-bg',
      desc: 'Intimate worship and real conversation in living rooms across the Twin Cities.',
      heroDesc: 'We’re in living rooms across Minneapolis and Saint Paul this weekend — intimate worship, meaningful discussion, and the kind of community that knows your name.',
      when: '12:30–2:30 PM · Living rooms across the Twin Cities',
      where: 'Location shared when you sign up — ' + calLink,
      footWhere: 'Living rooms across the Twin Cities', link: 'sundays.html'
    },
    'tgp-live': {
      name: 'TGP LIVE', sub: 'In Person + Online', bg: 'navy-bg',
      desc: 'Our monthly all-family worship experience — in person at Proximity Collective and streaming online.',
      heroDesc: 'The whole TGP family gathers for an unforgettable worship experience — the worship, the Word, and a discussion worth staying for. In person or streaming live.',
      when: '12:30–2:30 PM · Proximity Collective',
      where: '2520 N 2nd St, Minneapolis — or join live on YouTube &amp; Facebook',
      footWhere: 'Proximity Collective + streaming online', link: 'sundays.html'
    },
    'fifth-table': {
      name: 'The Fifth Table', sub: 'Digital Sabbath', bg: '',
      desc: 'Our digital sabbath — rest, worship anywhere, and gather at your own table.',
      heroDesc: 'Instead of gathering at a set time, we rest, worship from wherever we are, and gather around our own tables — just like the early church in Acts 2.',
      when: 'Wherever you are',
      where: 'Rest, worship from anywhere, and invite someone to your table',
      footWhere: 'Wherever you are · your table', link: 'sundays.html'
    },
    'gather-grow': {
      name: 'Gather + Grow Bible Study', sub: 'First Saturdays', bg: 'rose-bg',
      desc: 'Dig into the Word with Pastor Angela at Proximity Collective.',
      link: 'connect.html'
    },
    'collide': {
      name: 'Collide Night', sub: 'Worship Night', bg: 'navy-bg',
      desc: 'A night of unfiltered worship — where heaven and earth collide.',
      link: 'events.html#collide'
    },
    'other': { name: '', sub: '', bg: '', desc: '', link: 'events.html' }
  };

  function slugFor(name) {
    if (/fellowship/i.test(name)) return 'first-fellowship';
    if (/grow home/i.test(name)) return 'grow-home';
    if (/tgp\s*live/i.test(name)) return 'tgp-live';
    if (/fifth/i.test(name)) return 'fifth-table';
    if (/gather.*grow|bible/i.test(name)) return 'gather-grow';
    if (/collide/i.test(name)) return 'collide';
    return 'other';
  }

  function fmtTime(h, m) {
    var ap = h >= 12 ? 'PM' : 'AM';
    var hr = h % 12 || 12;
    return hr + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ap;
  }

  /* ---------- the coming Sunday, from the rhythm ---------- */
  var now = new Date();
  var sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var add = (7 - now.getDay()) % 7;
  if (now.getDay() === 0 && now.getHours() >= 15) add = 7;
  sunday.setDate(sunday.getDate() + add);

  function sundaySlug(d) {
    var nth = Math.ceil(d.getDate() / 7);
    return nth === 1 ? 'first-fellowship' : nth === 3 ? 'tgp-live' :
           nth === 5 ? 'fifth-table' : 'grow-home';
  }

  var slug = sundaySlug(sunday);
  var cfg = META[slug];
  var dateStr = MONTHS[sunday.getMonth()] + ' ' + sunday.getDate();

  function set(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  /* ---------- homepage "This Sunday" block ---------- */
  set('ts-tag', 'This Sunday · ' + dateStr);
  set('ts-title', cfg.name + ' — ' + cfg.sub);
  set('ts-when', cfg.when);
  set('ts-where', cfg.where);
  set('ts-desc', cfg.heroDesc);

  // hero photo: use images/hero-<type>.jpg when the file exists
  var photoBox = document.getElementById('ts-photo');
  if (photoBox) {
    var heroImg = new Image();
    heroImg.onload = function () {
      photoBox.style.backgroundImage = 'url("images/hero-' + slug + '.jpg")';
      photoBox.style.backgroundSize = 'cover';
      photoBox.style.backgroundPosition = 'center';
      var lbl = photoBox.querySelector('.label');
      if (lbl) lbl.style.display = 'none';
    };
    heroImg.src = 'images/hero-' + slug + '.jpg';
  }

  /* ---------- footer "Next Gathering" (every page) ---------- */
  document.querySelectorAll('footer .next-g').forEach(function (p) {
    p.innerHTML = '<strong>' + cfg.name + '</strong> · Sunday<br>' +
                  dateStr + (slug === 'fifth-table' ? '' : ' · 12:30 PM') + '<br>' + cfg.footWhere;
  });

  /* ---------- "What's Coming Up" cards ---------- */
  var grid = document.getElementById('upcoming-cards');

  function renderCards(events) {
    if (!grid) return;
    grid.innerHTML = '';
    events.slice(0, 3).forEach(function (ev) {
      var m = META[ev.slug];
      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<div class="ph short ' + m.bg + '"></div>' +
        '<div class="pad">' +
          '<span class="meta">' + ev.meta + '</span>' +
          '<h3>' + m.name + '</h3>' +
          '<p>' + (ev.desc || m.desc) + '</p>' +
          '<a class="text-link" href="' + m.link + '">Details →</a>' +
        '</div>';
      var ph = card.querySelector('.ph');
      var img = new Image();
      img.onload = function () {
        ph.style.backgroundImage = 'url("images/card-' + ev.slug + '.jpg")';
        ph.style.backgroundSize = 'cover';
        ph.style.backgroundPosition = 'center';
      };
      img.src = 'images/card-' + ev.slug + '.jpg';
      grid.appendChild(card);
    });
  }

  // Fallback: the next three Sundays, straight from the rhythm
  function rhythmCards() {
    var list = [];
    var d = new Date(sunday);
    for (var i = 0; i < 3; i++) {
      var s = sundaySlug(d);
      list.push({
        slug: s,
        meta: 'Sun · ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate() +
              (s === 'fifth-table' ? '' : ' · 12:30 PM')
      });
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
    }
    return list;
  }
  renderCards(rhythmCards());

  /* ---------- events-page calendar lists (Church Rhythm / Special Events) ----------
     Rhythm gatherings fill the first list; ANYTHING else on the calendar —
     Collide Nights, Brilliance, one-offs — automatically lands in Special Events. */
  function renderEventLists(events) {
    var rhythmEl = document.getElementById('rhythm-list');
    var specialEl = document.getElementById('special-list');
    if (!rhythmEl && !specialEl) return;
    var RHYTHM = { 'first-fellowship': 1, 'grow-home': 1, 'tgp-live': 1,
                   'fifth-table': 1, 'gather-grow': 1 };
    var BOX = {
      'first-fellowship': 'background:var(--navy); color:var(--gold);',
      'grow-home': 'background:var(--slate); color:#fff;',
      'tgp-live': 'background:var(--navy); color:var(--gold);',
      'fifth-table': 'background:var(--navy); color:var(--gold);',
      'gather-grow': 'background:var(--rose); color:#fff;'
    };
    var boxBase = 'border-radius:10px; min-width:86px; text-align:center; padding:10px 8px; ' +
                  "font-family:'Anton'; text-transform:uppercase; line-height:1.15;";
    function dateBox(ev, style) {
      return '<div style="' + style + boxBase + '">' + DAYS[ev.date.getDay()] + '<br>' +
             MONTHS[ev.date.getMonth()].slice(0, 3) + ' ' + ev.date.getDate() + '</div>';
    }
    function detailLine(ev) {
      var bits = [];
      if (ev.time) bits.push(ev.time);
      if (ev.loc) bits.push(ev.loc.replace(' - ', ', '));
      return bits.join(' · ');
    }
    var rhythm = events.filter(function (e) { return RHYTHM[e.slug]; }).slice(0, 6);
    var special = events.filter(function (e) { return !RHYTHM[e.slug]; }).slice(0, 5);

    // keep the Collide block's "Next night" line current
    var collideNext = document.getElementById('collide-next');
    var nextCollide = events.filter(function (e) { return e.slug === 'collide'; })[0];
    if (collideNext && nextCollide) {
      var FULLDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var d = nextCollide.date;
      collideNext.innerHTML = 'Next night: <strong style="color:#fff;">' +
        FULLDAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + '</strong>' +
        (nextCollide.loc ? ' at ' + nextCollide.loc.replace(' - ', ', ') : '') +
        (nextCollide.time ? '. ' + nextCollide.time : '') + '. Free — bring someone.';
    }

    if (rhythmEl && rhythm.length) {
      rhythmEl.innerHTML = rhythm.map(function (ev) {
        return '<div style="background:var(--paper); border-radius:12px; box-shadow:var(--shadow); display:flex; gap:20px; align-items:center; padding:16px 20px;">' +
          dateBox(ev, BOX[ev.slug]) +
          '<div><strong style="color:var(--navy);">' + (META[ev.slug].name || ev.name) +
          '</strong><br><span style="font-size:0.88rem;">' + detailLine(ev) + '</span></div></div>';
      }).join('');
    }
    if (specialEl) {
      if (!special.length) {
        specialEl.innerHTML = '<p style="font-size:0.92rem;">Nothing extra on the calendar right now — follow ' +
          '<a href="https://www.instagram.com/collideexperience" target="_blank" rel="noopener" style="color:#C38A84; font-weight:700;">@collideexperience</a> and ' +
          '<a href="https://www.instagram.com/iambrillianceemerge" target="_blank" rel="noopener" style="color:#C38A84; font-weight:700;">@iambrillianceemerge</a> for what\'s next.</p>';
        return;
      }
      specialEl.innerHTML = special.map(function (ev) {
        var isBrill = /brilliance/i.test(ev.name);
        var cardBg = isBrill ? '#8f5e58' : '#0e1c28';
        var accent = isBrill ? '#f3d9c4' : 'var(--gold)';
        var tag = isBrill ? 'Brilliance' : (ev.slug === 'collide' ? 'Collide' : 'Special');
        return '<div style="background:' + cardBg + '; border-radius:12px; box-shadow:var(--shadow); display:flex; gap:20px; align-items:center; padding:16px 20px;">' +
          dateBox(ev, 'background:' + accent + '; color:' + cardBg + ';') +
          '<div><strong style="color:#fff;">' + ev.name + '</strong> ' +
          '<span style="color:' + accent + '; font-size:0.75rem; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; margin-left:6px;">' + tag + '</span><br>' +
          '<span style="font-size:0.88rem; color:rgba(255,255,255,0.78);">' + detailLine(ev) + '</span></div></div>';
      }).join('');
    }
  }

  /* ---------- live calendar feed (works on the deployed site) ---------- */
  fetch('/calendar.ics').then(function (r) {
    if (!r.ok) throw new Error('feed unavailable');
    return r.text();
  }).then(function (ics) {
    var unfolded = ics.replace(/\r?\n[ \t]/g, '');
    var todayStamp = now.getFullYear() +
                     String(now.getMonth() + 1).padStart(2, '0') +
                     String(now.getDate()).padStart(2, '0');
    var events = [];
    unfolded.split('BEGIN:VEVENT').slice(1).forEach(function (ev) {
      var dm = ev.match(/DTSTART[^:]*:(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
      if (!dm) return;
      var stamp = dm[1] + dm[2] + dm[3];
      if (stamp < todayStamp) return;
      var em = ev.match(/DTEND[^:]*:\d{8}T(\d{2})(\d{2})/);
      var summary = ((ev.match(/SUMMARY:([^\r\n]*)/) || [])[1] || '').trim()
                      .replace(/^(.+?): \1\s*$/, '$1');
      var loc = ((ev.match(/LOCATION:([^\r\n]*)/) || [])[1] || '')
                  .replace(/\\,/g, ',').replace(/, USA\s*$/, '');
      var d = new Date(+dm[1], +dm[2] - 1, +dm[3]);
      var time = dm[4] ? fmtTime(+dm[4], +dm[5]) : '';
      if (time && em) {
        var endT = fmtTime(+em[1], +em[2]);
        // compress "6:30 PM–8:30 PM" to "6:30–8:30 PM"
        if (time.slice(-2) === endT.slice(-2)) time = time.slice(0, -3);
        time += '–' + endT;
      }
      events.push({
        stamp: stamp,
        slug: slugFor(summary),
        name: summary,
        date: d,
        loc: loc,
        time: time,
        meta: DAYS[d.getDay()] + ' · ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' +
              d.getDate() + (time ? ' · ' + time : ''),
        desc: null
      });
    });
    events.sort(function (a, b) { return a.stamp < b.stamp ? -1 : 1; });
    if (events.length >= 2) renderCards(events);
    renderEventLists(events);

    // exact First Fellowship location for the This Sunday block
    if (slug === 'first-fellowship') {
      var sundayStamp = sunday.getFullYear() +
                        String(sunday.getMonth() + 1).padStart(2, '0') +
                        String(sunday.getDate()).padStart(2, '0');
      for (var i = 0; i < events.length; i++) {
        if (events[i].stamp === sundayStamp && events[i].slug === 'first-fellowship' && events[i].loc) {
          var parts = events[i].loc.split(' - ');
          set('ts-when', '12:30–2:30 PM · ' + parts[0]);
          set('ts-where', (parts[1] || events[i].loc) + ' — location changes monthly, ' + calLink);
          break;
        }
      }
    }
  }).catch(function () { /* rhythm-based fallback already rendered */ });

  /* ---------- YouTube archive (watch page): latest videos from the channel feed,
     proxied at /youtube.xml via Netlify ---------- */
  var ytGrid = document.getElementById('yt-archive');
  if (ytGrid) {
    fetch('/youtube.xml').then(function (r) {
      if (!r.ok) throw new Error('yt feed unavailable');
      return r.text();
    }).then(function (xml) {
      var entries = [];
      xml.split('<entry>').slice(1).forEach(function (e) {
        var id = (e.match(/<yt:videoId>([^<]+)/) || [])[1];
        var title = (e.match(/<media:title>([^<]+)/) || [])[1];
        var pub = e.match(/<published>(\d{4})-(\d{2})-(\d{2})/) || [];
        if (id && title) entries.push({ id: id, title: title, y: pub[1], m: pub[2], d: pub[3] });
      });
      if (!entries.length) return;
      ytGrid.innerHTML = entries.slice(0, 6).map(function (v) {
        var dateStr = v.m ? MONTHS[+v.m - 1].slice(0, 3) + ' ' + (+v.d) + ', ' + v.y : '';
        var kind = /petition/i.test(v.title) ? 'Petition' :
                   /collide/i.test(v.title) ? 'Collide' : 'Message';
        return '<a class="card" href="https://www.youtube.com/watch?v=' + v.id +
          '" target="_blank" rel="noopener" style="text-decoration:none;">' +
          '<div class="ph short navy-bg" style="background-image:url(\'https://i.ytimg.com/vi/' +
          v.id + '/hqdefault.jpg\'); background-size:cover; background-position:center;"></div>' +
          '<div class="pad"><span class="meta">' + dateStr + ' · ' + kind + '</span>' +
          '<h3 style="font-size:1.02rem;">' + v.title + '</h3></div></a>';
      }).join('');
    }).catch(function () { /* static fallback cards remain */ });
  }

  /* ---------- generic image slots: any element with data-img swaps in its
     photo automatically once the file exists (placeholder shows until then) */
  document.querySelectorAll('[data-img]').forEach(function (el) {
    var pre = new Image();
    pre.onload = function () {
      el.style.backgroundImage = 'url("' + el.getAttribute('data-img') + '")';
      if (!el.style.backgroundSize) el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      var lbl = el.querySelector('.label');
      if (lbl) lbl.style.display = 'none';
    };
    pre.src = el.getAttribute('data-img');
  });
})();
