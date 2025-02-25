const page = async () => {
  const res = await fetch("http://localhost:3000/api/user", {
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data);
  return <div className="dark:text-rose-400">page</div>;
};

export default page;
