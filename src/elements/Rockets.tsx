import rocket1 from '../assets/6-removebg-preview 1.svg';
import rocket2 from '../assets/5-removebg-preview 1.svg';

function Rockets() {
  const rockets = [
    <img className="rocket-left" src={rocket1} key={1} />,
    <img className="rocket-right" src={rocket2} key={2} />,
  ];
  return <>{rockets};</>;
}

export default Rockets;
