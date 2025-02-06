import { useRouter } from "next/router";
import Head from "next/head";
import {
  ProductContainer,
  ImageContainer,
  ProductDetails,
} from "../../styles/pages/product";
import { GetStaticPaths, GetStaticProps } from "next";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import Image from "next/image";

import axios from "axios";
import { useState } from "react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageURL: string;
    price: number;
    description: string;
    priceId: string;
  };
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  async function handleBuyProduct() {
    try {
      const response = await axios.post("/api/checkout", {
        priceId: product.priceId,
      });

      setIsCreatingCheckoutSession(true);

      const { checkoutURL } = response.data;
      window.location.href = checkoutURL;

      return;
    } catch (error) {
      setIsCreatingCheckoutSession(false);
      alert("Erro, tente novamente.");
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer key={product.id}>
        <ImageContainer>
          <Image src={product.imageURL} alt="" width={520} height={480} />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          <p>{product.description}</p>

          <button
            onClick={handleBuyProduct}
            disabled={isCreatingCheckoutSession}
          >
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "prod_RhS5DNeR71doSc" } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageURL: product.images[0],
        price: price.unit_amount / 100,
        description: product.description,
        priceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
