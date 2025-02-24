import React from "react";
import { Button } from "../ui/button";
import { LogoutAction } from "@/Actions/actions";

const Logout = () => {
  return (
    <Button onClick={LogoutAction} className="bg-red-300 text-white">
      Logout
    </Button>
  );
};

export default Logout;
