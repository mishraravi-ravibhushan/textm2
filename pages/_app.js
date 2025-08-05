// import node module libraries
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import SSRProvider from "react-bootstrap/SSRProvider";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "../context/AuthContext";

// import theme style scss file
import "../styles/theme.scss";

// import default layouts
import DefaultDashboardLayout from "layouts/DefaultDashboardLayout";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pageURL = process.env.baseURL + router.pathname;
  const [loading, setLoading] = useState(true);
  const title = "Text Min - Next.Js Admin Dashboard Template";
  const description =
    "Dash is a fully responsive and yet modern premium Nextjs template & snippets. Geek is feature-rich Nextjs components and beautifully designed pages that help you create the best possible website and web application projects. Nextjs Snippet ";
  const keywords =
    "Text Min, Nextjs, Next.js, Course, Sass, landing, Marketing, admin themes, Nextjs admin, Nextjs dashboard, ui kit, web app, multipurpose";

  // Identify the layout, which will be applied conditionally
  const Layout =
    Component.Layout ||
    (router.pathname.includes("dashboard")
      ? router.pathname.includes("instructor") ||
        router.pathname.includes("student")
        ? DefaultDashboardLayout
        : DefaultDashboardLayout
      : DefaultDashboardLayout);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div style={styles.loaderWrapper}>
        <img
          src="/images/logo/loader.gif"
          alt="Loading..."
          style={styles.loader}
        />
      </div>
    );
  }
  return (
    <SSRProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <NextSeo
        title={title}
        description={description}
        canonical={pageURL}
        openGraph={{
          url: pageURL,
          title: title,
          description: description,
          site_name: process.env.siteName,
        }}
      />
      <Layout>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
        <Analytics />
      </Layout>
    </SSRProvider>
  );
}
const styles = {
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f7f7f7",
  },
  loader: {
    width: "auto",
    height: "auto",
  },
};

export default MyApp;
