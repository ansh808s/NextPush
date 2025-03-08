import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import placeholder from "../public/images/placeholder.svg";
import Features from "@/components/section/Features";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4">
        <section className="pb-20 pt-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[130%]">
                <span className=" bg-clip-text text-light leading-[130%]">
                  One click,
                </span>{" "}
                <span className=" lg:block xl:inline leading-[130%]">
                  <span className="bg-gradient-to-r leading-[130%] from-primary to-primary bg-clip-text text-transparent">
                    Ship-it
                  </span>
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Experience lightning-fast deployments, unparalleled performance,
                and effortless scaling. Your website, your way, in record time.
              </p>
              <div className="flex space-x-4">
                <Link href={"/select-repo"}>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-lg text-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-rose-500 rounded-3xl blur-2xl opacity-30"></div>
              <Card className="relative overflow-hidden rounded-3xl border-2 border-primary/20">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Image
                    src={placeholder}
                    alt="DeployEase Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <Features />
      </div>
      <Footer />
    </>
  );
}
