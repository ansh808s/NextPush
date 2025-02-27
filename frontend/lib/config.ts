export const pricingPlans = [
  {
    name: "Hobby",
    price: "$0",
    description: "Perfect for personal projects and experiments",
    features: [
      "1 Project",
      "Basic analytics",
      "Manual deployments",
      "GitHub integration",
      "1 team member",
    ],
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    available: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals and small teams",
    features: [
      "Upto 10 projects",
      "Advanced analytics",
      "Automatic deployments",
      "Environment variables",
      "Up to 5 team members",
    ],
    buttonText: "Coming Soon",
    buttonVariant: "outline" as const,
    available: false,
  },
];
