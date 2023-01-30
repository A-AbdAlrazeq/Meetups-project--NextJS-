import "../styles/globals.css";
import Layout from "../components/layout/Layout";
//it's like route component next js will render,will be the actual page content for diff pages
function HomePage({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default HomePage;
