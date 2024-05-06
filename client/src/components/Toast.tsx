import { useEffect } from "react";

type Props = {
  onClose: () => void;
  message: string;
  type: "SUCCESS" | "ERROR";
};

const Toast = ({ message, type, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const styles =
    type === "SUCCESS"
      ? "fixed top-4 right-4 px-5 w-[250px] py-6 bg-green-500 text-white"
      : "fixed top-4 right-4 px-5 py-4 bg-red-500 text-white";
  console.log(styles);
  return (
    <div className={styles}>
      <div className="text-white flex justify-center items-center text-center">
        {message}
      </div>
    </div>
  );
};

export default Toast;
