import Link from "next/link";
import { SucessContainer, ImageContainer } from "../styles/pages/success";
import { GetServerSideProps } from "next";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import Image from "next/image";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";

interface ProductProps {
  customerName: string;
  product: {
    name: string;
    imageURL: string;
  };
}
export default function Success({ customerName, product }: ProductProps) {
  return (
    <>
      <Head>
        <title>Sucesso na compra! | Ignite Shop</title>
      </Head>
      <SucessContainer>
        <h1>Compra efetuada</h1>

        <ImageContainer>
          <Image
            src={product.imageURL}
            alt="imagem do produto que foi comprado"
            width={120}
            height={110}
          />
        </ImageContainer>

        <p>
          Uhuul <strong>{customerName}</strong>, sua{" "}
          <strong>{product.name}</strong> já está a caminho da sua casa.
        </p>

        <Link href="/">Voltar ao Catálogo</Link>
      </SucessContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const customerName = session.customer_details.name;
  const product = session.line_items.data[0].price.product as Stripe.Product;

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageURL: product.images[0],
      },
    },
  };
};
