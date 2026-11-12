import Link from "next/link";

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="page-hero-glow" aria-hidden="true" />
      <div className="container">
        <p className="notfound-num" aria-hidden="true">404</p>
        <p className="eyebrow">Сторінку не знайдено</p>
        <h1 className="display-lg">
          Тут <em>чисто</em> — аж занадто
        </h1>
        <p className="page-lead">Схоже, сторінку перенесли. Зазирніть у каталог — там понад тисячу товарів.</p>
        <div className="band-actions">
          <Link href="/katalog" className="btn btn-lg btn-glow">
            До каталогу
          </Link>
          <Link href="/" className="btn btn-lg btn-outline">
            На головну
          </Link>
        </div>
      </div>
    </section>
  );
}
