import { AiOutlineArrowLeft } from 'react-icons/ai/index.js';
import PropTypes from 'prop-types';

interface BackButtonProps {
  handleBackButton: () => void;
}

function BackButton({ handleBackButton }: BackButtonProps) {
  return (
    <button onClick={handleBackButton} id="back-btn">
      <AiOutlineArrowLeft />
    </button>
  );
}

BackButton.propTypes = {
  handleBackButton: PropTypes.func.isRequired,
};

export default BackButton;
