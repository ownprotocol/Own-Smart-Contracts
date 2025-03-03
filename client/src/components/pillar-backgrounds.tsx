function PillarBackgrounds() {
  return (
    <>
      <div
        className="absolute -left-24 top-0 h-full w-full hidden md:block"
        style={{
          backgroundImage: "url('/home-page/hero/left-pillar.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
          opacity: 0.3,
        }}
      />

      <div
        className="absolute -right-24 top-0 h-full w-full hidden md:block"
        style={{
          backgroundImage: "url('/home-page/hero/right-pillar.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          opacity: 0.3,
        }}
      />
    </>
  );
}

export default PillarBackgrounds;
