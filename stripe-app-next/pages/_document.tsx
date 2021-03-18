import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body className="bg-blue-500 p-10">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
