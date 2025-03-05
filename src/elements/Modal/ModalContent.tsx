import React from "react";
import { motion } from "framer-motion";

interface ModalContentProps {
  title: string;
  body: string | React.ReactNode;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDispatch?: (value: any) => void;
  footer?: string | React.ReactNode;
  callback?: () => void;
}

function ModalContent({
  title,
  body,
  setOpenModal,
  setDispatch,
  footer,
  callback,
}: ModalContentProps) {

  const modalContentAnimate = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { delay: 0.3 } },
    exit: { x: 100, opacity: 0 },
  };

  return (
    <motion.div
      className="modalBackground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setOpenModal && setOpenModal(false);
        setDispatch && setDispatch(null);
      }}
    >
      <motion.div
        className="modalContainer"
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 0.3 } }}
        exit={{ scale: 0 }}
      >
        <motion.div className="title" {...modalContentAnimate}>
          <h1>{title}</h1>
        </motion.div>
        <motion.div className="body" {...modalContentAnimate}>
          <p>{body}</p>
        </motion.div>
        <motion.div className="footer" {...modalContentAnimate}>
          <button
            onClick={() => {
              setOpenModal && setOpenModal(false);
              setDispatch && setDispatch(null);
            }}
            id="cancelBtn"
          >
            {Array.isArray(footer) ? footer[0] : <div>Continue</div>}
          </button>
          <button
            onClick={async () => {
              setOpenModal && setOpenModal(false);
              setDispatch && setDispatch(null);
              callback && callback();
            }}
          >
            {Array.isArray(footer) ? footer[1] : <div>Cancel</div>}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ModalContent;
