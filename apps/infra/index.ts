import { NextJsSite } from "@giweb/pulumi-nextjs";

const site = new NextJsSite("calepi", {
  path: "../web",
  fixSymLinks: true,
});

export const url = site.url;
