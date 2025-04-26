interface ItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CarouselItem = ({ children, className, onClick }: ItemProps) => {
  const onClickHandler = () => {
    if (onClick) onClick();
  };
  return (
    <div
      className={`relative flex-none snap-x overflow-auto bg-transparent ${
        className ? className : " "
      }`}
      onClick={onClickHandler}
    >
      {children}
    </div>
  );
};

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Carousel = ({ children, className }: Props) => {
  return (
    <div
      className={`z-10 flex flex-none snap-start scroll-mb-4 justify-end bg-transparent ${
        className ? className : " "
      }`}
    >
      {children}
    </div>
  );
};
