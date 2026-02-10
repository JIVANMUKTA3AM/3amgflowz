
const CyberBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1e] to-[#030712]" />

      {/* Grid mesh */}
      <div className="grid-mesh-bg opacity-40" />

      {/* Radial glow accents */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float-particle"
          style={{
            left: `${8 + (i * 7.5) % 90}%`,
            top: `${5 + (i * 13) % 85}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${6 + (i % 4) * 2}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default CyberBackground;
