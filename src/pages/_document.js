import React from "react";
import Script from "next/script"
import Document, { Html, Head, Main, NextScript } from "next/document";
import theme from "../../theme";

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>

        <Script type="application/ld+json">
        
         "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": "Analyzing Google Search traffic drops",
          "datePublished": "2021-07-20T08:00:00+08:00",
          "dateModified": "2021-07-20T09:20:00+08:00"
        
        </Script>
     
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="title" content="Bergquist Applications | Algorand Blockchain Development" />
          <meta name="description" content="Bergquist Applications creates web applications equipped with the Algorand Blockchain. 
          Learn the benefits of a blockchain business custom to your brand and use case. 
          With continued research into smart contracts, Bergquist Applications is seeking to revolutionize the way users interact with online business." />
          <meta name="keywords" content="Algorand, Blockchain, Website, Web, Application" />

          <meta name="theme-color" content={theme.palette.primary.main} />

          <meta property="og:url" content="https://andersbergquist.com/" key="ogurl" />
          <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/cleaning-7852d.appspot.com/o/MoonIcon.png?alt=media&token=71ebd6c6-330d-48c2-87d9-f74395af2007" key="ogimage" />
          <meta property="og:image:alt" content="" key="ogimagealt" />
          <meta property="og:title" content="Bergquist Applications | Algorand Blockchain Development" key="ogtitle" />
          <meta property="og:description" content="Bergquist Applications creates web applications equipped with the Algorand Blockchain. 
          Learn the benefits of a blockchain business custom to your brand and use case. 
          With continued research into smart contracts, Bergquist Applications is seeking to revolutionize the way users interact with online business." key="ogdesc" />
          
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />

          <link rel="icon" href="/images/favicon.ico"/>
          <link rel="shortcut icon" href="/images/favicon.ico"/>


          
          
        </Head>
        <body style={{ backgroundImage: "linear-gradient(#6C63FF, #FF6584)"}}>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

