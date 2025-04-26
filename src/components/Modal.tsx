import ReactDOM from "react-dom";

export const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

interface PortalProps {
  children: React.ReactNode;
}

export const Portal = ({ children }: PortalProps) => {
  return ReactDOM.createPortal(
    <>{children}</>,
    document.getElementById("modal-root")!
  );
};

interface BackdropProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Backdrop = ({ children, onClick }: BackdropProps) => {
  const onBackdropClickHandler = () => {
    onClick && onClick();
  };
  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 z-20 flex 
                 items-center justify-center bg-[#0000009a]"
      onClick={onBackdropClickHandler}
    >
      {children}
    </div>
  );
};

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  onBackdropClick?: () => void;
}

const Modal = ({ children, className, onBackdropClick }: ModalProps) => {
  const onBackdropClickHandler = () => {
    onBackdropClick && onBackdropClick();
  };
  return (
    <Portal>
      <Backdrop onClick={onBackdropClickHandler}>
        <div
          className={`shadow-2xl ${className ? className : ""}`}
          onClick={stopPropagation}
        >
          {children}
        </div>
      </Backdrop>
    </Portal>
  );
};

export default Modal;
