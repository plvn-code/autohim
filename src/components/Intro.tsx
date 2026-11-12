/**
 * First-visit curtain: the mark fades up through a blue mist, a light streak sweeps the wordmark
 * (like a lamp across fresh paint), then the panel lifts. Pure CSS, so content never waits for JavaScript.
 * The layout script adds html.no-intro on repeat visits and inner pages.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-mist" />
      <div className="intro-center">
        <img className="intro-mark" src="/brand/mark-320.webp" alt="" width={150} height={123} />
        <p className="intro-word">
          AUTO<b>HIM</b>
          <i className="intro-streak" />
        </p>
        <p className="intro-caption">все для догляду автомобіля</p>
      </div>
    </div>
  );
}
