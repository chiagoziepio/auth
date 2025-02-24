import { BiSolidMessageError } from "react-icons/bi";
const ErrorBox = ({ text }: { text: string }) => {
  return (
    <div className="bg-rose-400 text-red-500 p-2 rounded-md flex items-center gap-2 w-full h-fit my-3">
      <BiSolidMessageError size={30} />
      <p>{text}</p>
    </div>
  );
};

export default ErrorBox;
