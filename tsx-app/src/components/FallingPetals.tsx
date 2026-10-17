const petals = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${2 + ((index * 37) % 96)}%`,
  delay: `${(index % 9) * -1.8}s`,
  duration: `${22 + (index % 7) * 2}s`,
  size: `${9 + (index % 4) * 3}px`,
  drift: `${-70 + (index % 8) * 22}px`,
}));

export function FallingPetals() {
  return (
    <div className="global-falling-petals" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            ["--petal-drift" as string]: petal.drift,
          }}
        />
      ))}
    </div>
  );
}
