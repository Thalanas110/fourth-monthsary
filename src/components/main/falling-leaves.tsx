export const FALLING_LEAF_COUNT = 30;

export function FallingLeaves() {
  return (
    <div className="hero-leaf-layer" aria-hidden="true">
      {Array.from({ length: FALLING_LEAF_COUNT }, (_, index) => <span className="hero-leaf" key={index} />)}
    </div>
  );
}