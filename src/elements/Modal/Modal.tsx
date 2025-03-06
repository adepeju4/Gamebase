import { useState } from 'react';
import ModalContent from './ModalContent';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  title: string;
  body: string | React.ReactNode;
  footer?: string | React.ReactNode;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setDispatch?: (value: any) => void;
  callback?: () => void;
}

function Modal({ title, body, footer, setOpenModal, setDispatch, callback }: ModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const modalSetter = setOpenModal || setIsOpen;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            title={title}
            body={body}
            footer={footer}
            setOpenModal={modalSetter}
            setDispatch={setDispatch}
            callback={callback}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
