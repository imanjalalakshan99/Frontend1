import React from "react";
import { apiURL } from "utils/fetchApi";

interface Props {
  src: string;
  alt?: string;
  className?: string;
  onClick?: (() => void) | ((e: React.MouseEvent) => void);
}

const Img = ({ src, alt, className, onClick }: Props) => {
  const onClickHandler = (e: React.MouseEvent) => onClick && onClick(e);
  return (
    <img
      src={`${apiURL}/image${src}`}
      className={`${className ? className : ""}`}
      alt={alt}
      onClick={onClickHandler}
    />
  );
};

export default Img;
