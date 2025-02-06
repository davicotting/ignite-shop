import { styled } from "../styles/";
import { HomeContainer, Product } from "../styles/pages/home";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { stripe } from "../lib/stripe";
import { GetStaticProps } from "next";
import Link from "next/link";
import Stripe from "stripe";
import Head from "next/head";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageURL: string;
    price: number;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef, instanseRef] = useKeenSlider({
    slides: {
      perView: 2.5,
      spacing: 48,
    },
  });
  return (
    <>
    <Head>
      <title>Home | Ignite Shop</title>
    </Head>
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
          <Product className="keen-slider__slide">
            <Image src={product.imageURL} height={520} width={480} alt="" />

            <footer>
              <strong>{product.name}</strong>
              <span>
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </footer>
          </Product>
        </Link>
      ))}
    </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageURL: product.images[0],
      price: price.unit_amount / 100,
    };
  });

  return {
    props: {
      products: products,
    },
    revalidate: 60 * 60 * 2,
  };
};
