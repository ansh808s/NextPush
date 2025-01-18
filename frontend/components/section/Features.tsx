import { Rocket, Zap, BarChart, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export default function Features() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why Choose DeployEase?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            title: "Zero-Cost Deployment",
            icon: DollarSign,
            description: "Deploy your sites for free—no hidden charges.",
          },
          {
            title: "Built-In Analytics",
            icon: BarChart,
            description: "Track performance effortlessly with no added cost.",
          },
          {
            title: "Effortless Deployment",
            icon: Rocket,
            description:
              "Deploy directly from GitHub in just one step—simple and fast.",
          },
          {
            title: "Lightning Fast",
            icon: Zap,
            description:
              "Deploy your sites with unparalleled speed and efficiency.",
          },
        ].map((feature, index) => (
          <Card
            key={index}
            className="transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
          >
            <CardHeader>
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
