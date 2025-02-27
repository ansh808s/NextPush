import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { pricingPlans } from "@/lib/config";

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the plan that&apos;s right for you and start deploying your
          projects with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${
              !plan.available
                ? "border-gray-300 dark:border-gray-700 relative overflow-hidden"
                : "border-rose-500 shadow-lg dark:border-rose-500"
            }`}
          >
            {!plan.available && (
              <div className="absolute top-6 right-6">
                <Badge
                  variant="outline"
                  className="bg-gray-100 dark:bg-gray-800 flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  <span>Coming Soon</span>
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {plan.period}
                  </span>
                )}
              </div>
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={plan.buttonVariant}
                className={`w-full ${
                  plan.buttonVariant === "default"
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900"
                }`}
                disabled={!plan.available}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
