import { useAppSelector } from "hooks/redux-hooks";
import { RiMapPinLine } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { FaRegClock } from "react-icons/fa";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import Img from "components/Img";
import IOpeningHours from "types/IOpeningHours";
import { useEffect, useRef, useState } from "react";
import { days } from "utils/dateTime";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import ImagePreview from "components/ImagePreview";

const HoursOverview = ({ openingHours }: { openingHours: IOpeningHours[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClickHandler = () => {
    setIsOpen((prev) => !prev);
  };
  const date = new Date();
  const dayOfWeek = date.getDay();
  const time = `${date.getHours()}:${date.getMinutes()}`;
  const isOpenNow = openingHours.some(
    (hour) =>
      hour.dayOfWeek === dayOfWeek &&
      hour.from !== "--:--" &&
      hour.to !== "--:--" &&
      hour.from <= time &&
      hour.to >= time
  );
  const todayTime = openingHours.find(
    (hour) => hour.dayOfWeek === dayOfWeek && hour.from !== "--:--"
  );
  let nextDayOpen;
  if (todayTime && todayTime?.from > time) {
    nextDayOpen = todayTime;
  } else {
    for (let i = 1; i < 7; i++) {
      const nextDay = (dayOfWeek + i) % 7;
      const nextDayTime = openingHours.find(
        (hour) => hour.dayOfWeek === nextDay && hour.from !== "--:--"
      );
      if (nextDayTime) {
        nextDayOpen = nextDayTime;
        break;
      }
    }
  }
  return (
    <div
      className="flex cursor-pointer flex-col gap-2 py-2"
      onClick={onClickHandler}
    >
      <div className="flex items-center text-gray-500">
        <FaRegClock className="mr-4 inline-block text-xl text-blue-500" />
        {isOpenNow && (
          <span className="mr-2 font-medium">
            <span className="mr-1 text-green-500">Open</span>
            {todayTime && <span>⋅ Closing: {todayTime.to}</span>}
          </span>
        )}
        {!isOpenNow && (
          <span className="mr-2 font-medium">
            <span className="mr-1 text-red-500">Closed</span>
            {nextDayOpen && (
              <span className="">
                ⋅ Opening {days[nextDayOpen.dayOfWeek]} {nextDayOpen.from}
              </span>
            )}
          </span>
        )}
        {isOpen ? (
          <MdExpandLess className="inline-block text-xl" />
        ) : (
          <MdExpandMore className="inline-block text-xl" />
        )}
      </div>
      <div
        className={`${
          isOpen ? "" : "hidden"
        } flex flex-col gap-2 overflow-hidden text-sm
        font-medium text-gray-500 transition-all`}
      >
        {openingHours.map((hour) => {
          return (
            <div
              className="flex cursor-pointer items-center"
              key={hour.dayOfWeek}
            >
              <FaRegClock className="mr-4 inline-block text-xl opacity-0" />
              <span className="w-1/4">{days[hour.dayOfWeek]}</span>
              {hour.from !== "--:--" && (
                <span className="ml-4">
                  {hour.from} - {hour.to}
                </span>
              )}
              {hour.from === "--:--" && <span className="ml-4">Closed</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Images = ({ images }: { images: string[] | null }) => {
  const isEmpty = !images || images.length === 0;
  const ref = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [width, setWidth] = useState(0);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  const onScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    setScroll(event.currentTarget.scrollLeft);
    setWidth(event.currentTarget.offsetWidth);
  };
  const onResizeHandler = (event: ResizeObserverEntry[]) => {
    setWidth(event[0].contentRect.width);
    if (!ref.current) return;
    setScroll(ref.current.scrollLeft);
  };

  const scrollLeft = () => {
    if (!ref.current) return;
    const scrollStep = width * 0.8;
    const scrollTarget = scroll - scrollStep;
    ref.current.scrollTo({
      left: scrollTarget > 0 ? scrollTarget : 0,
      behavior: "smooth",
    });
  };
  const scrollRight = () => {
    if (!ref.current) return;
    const scrollStep = width * 0.8;
    const scrollTarget = scroll + scrollStep;
    ref.current.scrollTo({
      left: scrollTarget,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(onResizeHandler);
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [ref.current, onScrollHandler]);

  const isLeftArrow = scroll > 10;
  const isRightArrow =
    ref.current &&
    scroll < ref.current.scrollWidth - ref.current.offsetWidth - 10;

  return (
    <>
      <div className={"relative -mx-4 flex items-center" + (isEmpty && "h-0")}>
        {isLeftArrow && (
          <BsArrowLeftCircleFill
            className="absolute top-1/2 left-4 z-10 h-8 w-8 -translate-y-1/2 cursor-pointer drop-shadow-[0_0_2px_rgba(255,255,255,10)] hover:scale-105"
            onClick={scrollLeft}
          />
        )}
        <div
          className="no-scrollbar flex h-fit items-center gap-2 overflow-x-auto py-2 px-4"
          ref={ref}
          onScroll={onScrollHandler}
        >
          {!isEmpty &&
            images.map((image) => {
              return (
                <Img
                  key={image}
                  src={`/${image}`}
                  className="h-40 w-24 flex-none cursor-pointer rounded-xl object-cover hover:scale-105"
                  onClick={() => setImagePreviewOpen(true)}
                />
              );
            })}
        </div>
        {isRightArrow && (
          <BsArrowRightCircleFill
            className="absolute top-1/2 right-4 z-10 h-8 w-8 -translate-y-1/2 cursor-pointer drop-shadow-[0_0_2px_rgba(255,255,255,10)] hover:scale-105"
            onClick={scrollRight}
          />
        )}
      </div>
      {imagePreviewOpen && images && (
        <ImagePreview
          images={images}
          onExit={() => setImagePreviewOpen(false)}
        />
      )}
    </>
  );
};

const Overview = () => {
  const place = useAppSelector((state) => state.places.focused);

  const address = place?.address;
  const images = place?.images && place.images.length > 0 ? place.images : null;
  const phone = place?.contactInfo.phone;
  const email = place?.contactInfo.email;
  const tags = place?.tags;
  const hours = place?.openingHours;
  const showOpeningHours = place?.showOpeningHours;

  return (
    <div className="py-2">
      <Images images={images} />
      {address && (
        <div className="flex cursor-pointer items-center py-2">
          <RiMapPinLine className="mr-4 inline-block text-xl text-blue-500" />
          <a
            className="font-medium text-gray-500"
            href={`http://maps.google.com/?q=${address}`}
            target="_blank"
          >
            {address}
          </a>
        </div>
      )}
      {hours && showOpeningHours && <HoursOverview openingHours={hours} />}
      {phone && (
        <div className="flex cursor-pointer items-center py-2">
          <FiPhone className="mr-4 inline-block text-xl text-blue-500" />
          <a className="font-medium text-gray-500" href={`tel:${phone}`}>
            {phone}
          </a>
        </div>
      )}
      {email && (
        <div className="flex cursor-pointer items-center py-2">
          <AiOutlineMail className="mr-4 inline-block text-xl text-blue-500" />
          <span className="font-medium text-gray-500">{email}</span>
        </div>
      )}
      {tags && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span className="text-sm font-medium text-gray-300" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;
