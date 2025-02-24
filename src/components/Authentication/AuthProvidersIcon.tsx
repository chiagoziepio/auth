import { FaGithub } from "react-icons/fa";
const AuthProvidersIcon = () => {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
      <div className="flex items-center gap-2 border border-black rounded-md p-1">
        <FaGithub size={24} />
        <span>Github</span>
      </div>
    </div>
  );
};

export default AuthProvidersIcon;
