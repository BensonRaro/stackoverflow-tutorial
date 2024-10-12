"use client";

import { useEffect } from "react";

import Prism from "prismjs";
import parse from "html-react-parser";

import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

const ParseHTML = ({ explanation }: { explanation: string }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div
      className={
        "max-w-full prose dark:prose-p:text-light-700 dark:prose-ol:text-light-700 dark:prose-ul:text-light-500 dark:prose-strong:text-white dark:prose-headings:text-white prose-headings:text-dark-400 prose-h1:text-dark-300 prose-h2:text-dark-300 prose-p:text-dark-500 prose-ul:text-dark-500 prose-ol:text-dark-500 w-full min-w-full"
      }
    >
      {parse(explanation!)}
    </div>
  );
};

export default ParseHTML;
