
function ShootingStars() {
  const shootingStars = [
    <section key={1} className="shootingWrapper">
      <span className="shootingStars" key={1}></span>
      <span className="shootingStars" key={2}></span>
      <span className="shootingStars" key={3}></span>
      <span className="shootingStars" key={4}></span>
      <span className="shootingStars" key={5}></span>
      <span className="shootingStars" key={6}></span>
      <span className="shootingStars" key={7}></span>
      <span className="shootingStars" key={8}></span>
      <span className="shootingStars" key={9}></span>
    </section>,
  ];

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const STAR_COUNT = 100;
  let result = '';
  for (let i = 0; i < STAR_COUNT; i++) {
    result += `${randomNumber(-50, 50)}vw ${randomNumber(
      -50,
      50
    )}vh ${randomNumber(0, 3)}px ${randomNumber(0, 3)}px #fff,`;
  }

  const starBg = (
    <div
      className="starsbg"
      style={{ boxShadow: result.substring(0, result.length - 1) }}
    ></div>
  );

  return (
    <>
      {shootingStars}
      {starBg}
    </>
  );
}

export default ShootingStars;
