import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  title: string;
  description: string;
  imageSrc: string;
  path: string;
}

function GameCard({ title, description, imageSrc, path }: GameCardProps) {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(path);
  };

  return (
    <Card className="w-[300px] overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="h-[160px] overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Challenge your friends to a game of {title} and see who comes out on top!
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePlay} className="w-full">
          Play Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default GameCard;
