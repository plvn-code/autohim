# Status — started 2026-11-13

Local only: http://localhost:3013. No git repo, GitHub or Vercel yet — ask the user first.

## Done
Full shop in Ukrainian: home (intro, video hero with search, brand marquee, section bento, manifest, hits rail, 6-step care ritual, brand wall, protection video band, own AUTOHIM line, winter picks, perks, gift certificate, store band), catalogue with filters (section / sub-category / brand / price / search / sort, all in the URL, mobile filter sheet), 12 section pages, 42 brand pages, 1021 product pages (zoom lens, quantity, one-click order, delivery info, related), cart drawer + checkout (Nova Poshta / pickup / courier, pay on delivery or card link), instant ⌘K search, call-back modal, delivery & payment page with FAQ, contacts, 404, sitemap, robots, redirects from old ps.me URLs. Checked at 1440 and 390 px, no horizontal scroll.

## Order delivery: must be decided before launch
`src/lib/orders.ts` sends orders and call-backs to Telegram (`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`) and/or email via Resend (`RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM`). With neither set it appends to `data/orders.jsonl` — local disk only; on Vercel every order would fail with 502 (the visitor then sees the phone number). Ask the client where orders should arrive.

## Questions for the client
1. **Where should orders go?** Telegram (which account/group), email, or both?
2. **Online payment.** The old shop had LiqPay connected for ФОП Погорілець. The redesign only says «менеджер надішле посилання на оплату». Connect LiqPay checkout?
3. **Stock.** The old data has no stock levels, so the site never says «в наявності». Is there a stock feed (Poster POS?) we could sync?
4. **Delivery facts** not stated on the old site and kept generic: Nova Poshta dispatch time, courier zone/price in Ternopil, free-delivery threshold, returns policy.
5. **Prices**: one product has price 0 (K2 Turbo Brake Fluid DOT-4) → shows «Ціна за запитом». Correct?
6. **16 products have no photo** and ~140 photos are on a green carpet / store shelf (incl. the whole AUTOHIM own line). Studio photos would lift those pages.
7. **Descriptions**: only ~35 of 1021 products have one. Should we write descriptions for the top products (hits, GYEON, Koch, SOFT99)?
8. **Own line «Хімія AUTOHIM»** — is it really their own brand (site says «засоби під власною маркою магазину»)?
9. **Hero/band videos** are licensed stock (Pexels), not their store. Do they have footage of their shop or detailing work?
10. **Domain**: stay on ps.me or move to their own domain? Redirects from ps.me paths are ready.

## Licences
Pexels licence (free commercial use, no attribution needed): hero https://www.pexels.com/video/6157786/ (cropped, a third-party logo removed from frame) · wash band https://www.pexels.com/video/6873168/ · drops https://www.pexels.com/video/40006857/ · polish https://www.pexels.com/video/6159294/ (encoded by build_video.py, files deleted from public/ — not used yet). Logo, product photos, prices and texts are the client's own (old shop).

## Launch checklist
Order delivery configured and tested · payment decision · `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_SITE_LIVE=1` · domain · test old-URL redirects on the real domain.
