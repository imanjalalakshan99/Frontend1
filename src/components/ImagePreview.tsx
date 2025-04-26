import { useCallback, useEffect, useRef, useState } from "react";
import Img from "./Img";
import Modal, { stopPropagation } from "./Modal";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { IoCloseCircle, IoCloseCircleOutline } from "react-icons/io5";
import { apiURL } from "utils/fetchApi";

interface ImageProps {
  src: string;
  onExit: () => void;
}

const Image = ({ src, onExit }: ImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onResizeHandler = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    const smaller = scaleX < scaleY ? scaleX : scaleY;
    const width = Math.floor(imageWidth * smaller);
    imageRef.current.style.width = `${width}px`;
  }, [src, containerRef.current, imageRef.current]);

  useEffect(() => onResizeHandler(), [src, containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(onResizeHandler);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [containerRef.current, onResizeHandler]);

  return (
    <div
      className="h-full w-full flex-none snap-center md:p-10 lg:p-20"
      onClick={onExit}
    >
      <div
        className="relative h-full w-full"
        ref={containerRef}
        onResize={onResizeHandler}
      >
        <img
          src={`${apiURL}/image/${src}`}
          className="absolute top-1/2 left-1/2 block h-auto flex-none -translate-x-1/2 -translate-y-1/2"
          ref={imageRef}
          onClick={stopPropagation}
        />
      </div>
    </div>
  );
};

interface Props {
  images: string[];
  onExit: () => void;
}

const ImagePreview = ({ images, onExit }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLeftArrow, setIsLeftArrow] = useState(false);
  const [isRightArrow, setIsRightArrow] = useState(false);
  const [index, setIndex] = useState(0);

  const onScrollHandler = () => {
    if (!ref.current) return;
    const scrollLeft = ref.current.scrollLeft;
    setIsLeftArrow(scrollLeft > 10);
    setIsRightArrow(
      scrollLeft < ref.current.scrollWidth - ref.current.offsetWidth - 10
    );
    const width = ref.current.offsetWidth;
    const scrollIndex = Math.round(scrollLeft / width);
    setIndex(scrollIndex + 1);
  };

  useEffect(() => onScrollHandler(), [images, ref.current]);

  const scrollLeft = () => {
    if (!ref.current) return;
    const width = ref.current.offsetWidth;
    const scrollLeft = ref.current.scrollLeft;
    const scrollTarget = scrollLeft - width;
    ref.current.scrollTo({
      left: scrollTarget > 0 ? scrollTarget : 0,
      behavior: "smooth",
    });
  };
  const scrollRight = () => {
    if (!ref.current) return;
    const width = ref.current.offsetWidth;
    const scrollLeft = ref.current.scrollLeft;
    const scrollTarget = scrollLeft + width;
    ref.current.scrollTo({
      left: scrollTarget,
      behavior: "smooth",
    });
  };

  return (
    <Modal className="relative flex h-full w-full" onBackdropClick={onExit}>
      {isLeftArrow && (
        <div
          className="absolute left-0 z-10 flex h-full min-h-0 cursor-pointer items-center overflow-hidden px-4"
          onClick={scrollLeft}
        >
          <BsArrowLeftCircleFill className="h-8 w-8 text-white drop-shadow-[0_0_4px_rgba(0,0,0,100)]" />
        </div>
      )}
      <div
        className="absolute bottom-[10%] left-1/2 z-20 -translate-x-1/2 cursor-pointer rounded-full bg-white px-4 py-1.5 font-bold"
        onClick={onExit}
      >
        Close
      </div>
      <div
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-auto bg-transparent"
        ref={ref}
        onScroll={onScrollHandler}
        onResize={onScrollHandler}
      >
        {images.map((image) => {
          return <Image key={image} src={image} onExit={onExit} />;
        })}
      </div>
      <div className="absolute bottom-[20%] left-1/2 z-10 -translate-x-1/2 rounded-full bg-black px-2 py-1 text-sm font-semibold text-white">
        {index} / {images.length}
      </div>
      {isRightArrow && (
        <div
          className="absolute right-0 z-10 flex h-full min-h-0 cursor-pointer items-center overflow-hidden px-4"
          onClick={scrollRight}
        >
          <BsArrowRightCircleFill className="h-8 w-8 text-white drop-shadow-[0_0_4px_rgba(0,0,0,100)]" />
        </div>
      )}
    </Modal>
  );
};

export default ImagePreview;
