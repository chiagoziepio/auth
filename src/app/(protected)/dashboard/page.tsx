import { auth } from "../../../../auth";

const page = async () => {
  const session = await auth();
  console.log(session);
  return <div>page</div>;
};

export default page;
