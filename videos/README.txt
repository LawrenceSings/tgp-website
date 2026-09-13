EVENT VIDEOS
============
Videos drop in here with these exact filenames:

  collide.mp4   — plays (muted, looping) in the Collide block on the Events page.
                  If the file is absent, collide-block.jpg (or the placeholder) shows.

Specs: MP4 (H.264), 1280 x 720 landscape, 10-30 seconds, no audio needed
(it plays muted). Keep it under ~10 MB — compress/trim in any video tool —
so the page loads fast and Netlify bandwidth stays low.

CULTURE CODE VIDEOS (culture-codes.html)
========================================
Drop each code's video in here with these exact filenames — the matching
card on the Culture Codes page automatically switches from "Video coming
soon" to a click-to-play player (with sound + controls):

  code-01-we-love-first.mp4
  code-02-spirit-led-bible-fed.mp4
  code-03-we-pray.mp4
  code-04-we-dont-do-life-alone.mp4
  code-05-accountability.mp4
  code-06-we-are-the-church.mp4
  code-07-we-multiply.mp4
  code-08-good-stewards.mp4
  code-09-we-do-not-conform.mp4

PLAN OF RECORD (decided Sep 13, 2026): these videos are hosted on the TGP
YouTube channel as Unlisted, NOT as local files — the raw exports are
350-760 MB each, over GitHub's 100 MB per-file limit. Paste each video's
YouTube ID into the matching card's data-youtube-id attribute in
culture-codes.html. The local-file slots above remain as a fallback and
activate automatically if a correctly-named MP4 ever lands here.
