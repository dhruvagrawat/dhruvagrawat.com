import type { SVGProps } from "react";

// Simple C++ mark: blue hexagon with a white "C++" monogram.
export const Cplusplus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 288" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="#00599C"
      d="M128 0 252 72v144L128 288 4 216V72z"
    />
    <path
      fill="#004482"
      d="M128 288 252 216V72L128 144z"
      opacity=".45"
    />
    <text
      x="128"
      y="170"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      fontSize="92"
      fill="#fff"
    >
      C++
    </text>
  </svg>
);
