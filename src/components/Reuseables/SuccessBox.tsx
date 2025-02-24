import { IoShieldCheckmark } from "react-icons/io5";
const SuccessBox = ({ text }: { text: string }) => {
  return (
    <div className="bg-emerald-400 text-white p-2 rounded-md flex items-center gap-2 w-full h-fit my-3">
      <IoShieldCheckmark size={30} />
      <p>{text}</p>
    </div>
  );
};

export default SuccessBox;
