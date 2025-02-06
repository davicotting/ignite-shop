import { AppProps } from "next/app";
import { globalStyles } from "../styles/global";
import igniteShopLogo from "../assets/ignite-shop-logo.svg";
import { Container, Header } from "../styles/pages/app";
import Image from "next/image";
globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={igniteShopLogo} alt="ignite shop logo"/>
      </Header>
      <Component {...pageProps} />
    </Container>
  );
}
