/** The client's «A» mark (spray bottle, brush, microfibre — from their own logo) + the AUTOHIM wordmark set in the display face. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="logo">
      <img src="/brand/mark-160.webp" alt="" width={size} height={Math.round(size * 0.82)} className="logo-mark" />
      <span className="logo-word">
        AUTO<b>HIM</b>
      </span>
    </span>
  );
}
