import Layout from "@/components/layout";
import type { NextPage } from "next";

const Chats: NextPage = () => {
  return (
    <Layout title="채팅" hasTabBar>
      <div className="divide-y-[1px] py-10 ">
      {[1, 1, 1, 1, 1, 1, 1].map((_, i) => (
        <div
          key={i}
          className="flex cursor-pointer items-center space-x-3 px-4 py-3"
        >
          <div className="h-12 w-12 rounded-full bg-slate-300" />
          <div>
            <p className="text-gray-700">Steve Jebs</p>
            <p className="text-sm  text-gray-500">
              See you tomorrow in the corner at 2pm!
            </p>
          </div>
        </div>
      ))}
    </div>
    </Layout>    
  );
};

export default Chats;
