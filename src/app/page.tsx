import { prisma } from "@/client";

const HomePage = async () => {
  prisma;
  return <div>Hello World</div>;
};

export default HomePage;
export const metadata = {
  title: "Home",
  description: "Home page",
};
