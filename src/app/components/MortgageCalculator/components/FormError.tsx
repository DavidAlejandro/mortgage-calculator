export const FormError = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <span className={`bg-error font-bold p-2 text-xs text-white ${className}`}>
      {message}
    </span>
  );
};
