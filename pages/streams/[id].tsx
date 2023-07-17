import type { NextPage } from "next";
import Layout from "@/components/layout";
import Message from "@/components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { useEffect, useRef } from "react";

interface StreamMessages {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}

interface StreamWithMessages extends Stream {
  Message: StreamMessages[];
}

interface StreamResponse {
  ok: true;
  stream: StreamWithMessages;
}

interface MessageForm {
  message: string;
}
const StreamDetail: NextPage = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const router = useRouter();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );

  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            Message: [
              ...prev.stream.Message,
              {
                id: Date.now(),
                message: form.message,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, [data?.stream?.Message]);

  return (
    <Layout canGoBack>
      <div className="space-y-4 px-4  py-10">
        <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="mt-3 block text-2xl text-gray-900">
            {data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="flex flex-col space-y-3 overflow-scroll rounded-md bg-orange-400 p-5">
            <span>Stream Keys (secret)</span>
            <span className="text-white">
              <span className="font-medium text-gray-800">URL:</span>{" "}
              {data?.stream.cloudflareUrl}
            </span>
            <span className="text-white">
              <span className="font-medium text-gray-800">Key:</span>{" "}
              {data?.stream.cloudflareKey}
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="h-[50vh] space-y-4 overflow-y-scroll px-4  py-10 pb-16">
            {data?.stream?.Message?.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message.user.id === user?.id}
              />
            ))}
            <div ref={scrollRef} />
          </div>
          <div className="fixed inset-x-0 bottom-0  bg-white py-2">
            <form
              onSubmit={handleSubmit(onValid)}
              className="relative mx-auto flex w-full  max-w-md items-center"
            >
              <input
                {...register("message", { required: true })}
                type="text"
                className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetail;
