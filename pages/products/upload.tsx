import type { NextPage } from "next";
import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";

interface UploadProductForm {
  name: string;
  price: string;
  image: FileList;
  description: string;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  const [productPreview, setProductPreview] = useState("");

  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] =
    useMutation<UploadProductMutation>("/api/products");
  const onValid = async ({
    name,
    price,
    description,
    image,
  }: UploadProductForm) => {
    if (loading) return;
    if (image && image.length > 0) {
      const cloudflareRequest = await fetch(`/api/files`);
      const { uploadURL } = await cloudflareRequest.json();

      const form = new FormData();
      form.append("file", image[0], name);

      const request = await fetch(uploadURL, {
        method: "POST",
        body: form,
      });

      const {
        result: { id },
      } = await request.json();
      uploadProduct({ name, price, description, image: id });
    } else {
      uploadProduct({ name, price, description });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);

  const image = watch("image");
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setProductPreview(URL.createObjectURL(file));
    }
  }, [image]);

  return (
    <Layout canGoBack title="Upload Product">
      <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
        <div>
          {productPreview ? (
            <img
              src={productPreview}
              className="h-46 w-full  rounded-md text-gray-600"
            />
          ) : (
            <label className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("image")}
                accept="image/*"
                className="hidden"
                type="file"
              />
            </label>
          )}
        </div>
        <Input
          register={register("name", { required: true })}
          label="Name"
          name="name"
          type="text"
          required
        />
        <Input
          register={register("price", { required: true })}
          label="Price"
          name="price"
          type="text"
          kind="price"
          required
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
          required
        />
        <Button text={loading ? "loading..." : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;
