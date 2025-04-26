interface Props {
  number: number;
}

const Notifications = ({ number }: Props) => {
  return (
    <span className="absolute top-0 -right-1 h-4 w-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-75"></span>
      <span className="flex h-full w-full items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
        {number}
      </span>
    </span>
  );
};

export default Notifications;
