import React from "react";
import { Link } from "react-router-dom";
import { Check, Truck, CreditCard, ShoppingBag } from "lucide-react";

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="my-6 relative">
      <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-200">
        <div
          className={`absolute left-0 w-1/2 h-full ${
            step2 || step3 ? "bg-green-500" : "bg-gray-200"
          }`}
        ></div>

        <div
          className={`absolute right-0 w-1/2 h-full ${
            step3 ? "bg-green-500" : "bg-gray-200"
          }`}
        ></div>
      </div>

      <div className="flex justify-between items-center w-full relative z-10">
        <Step
          title="Shipping"
          link="/shipping"
          active={step1}
          completed={step2 || step3}
          icon={<Truck size={24} />}
        />

        <Step
          title="Payment"
          link="/payment"
          active={step2}
          completed={step3}
          icon={<CreditCard size={24} />}
        />

        <Step
          title="Review"
          link="/placeorder"
          active={step3}
          completed={false}
          icon={<ShoppingBag size={24} />}
        />
      </div>
    </div>
  );
};

const Step = ({ title, link, active, completed, icon }) => {
  const content = (
    <div className="flex flex-col items-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          completed
            ? "bg-green-500 text-white"
            : active
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {completed ? <Check size={24} /> : icon}
      </div>
      <span
        className={`mt-2 text-sm font-medium ${
          completed
            ? "text-green-600"
            : active
            ? "text-blue-600"
            : "text-gray-400"
        }`}
      >
        {title}
      </span>
    </div>
  );

  if (active || completed) {
    return <Link to={link}>{content}</Link>;
  }
  return <div className="cursor-not-allowed">{content}</div>;
};

export default CheckoutSteps;
