import React from "react";
import { Link } from "react-router-dom";
import { Check, Truck, CreditCard, ShoppingBag } from "lucide-react";

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="mb-2 md:mb-3 relative">
      {/* Progress bar */}
      <div className="absolute top-5 md:top-6 left-0 w-full h-0.5 bg-gray-200">
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
          icon={<Truck />}
        />

        <Step
          title="Payment"
          link="/payment"
          active={step2}
          completed={step3}
          icon={<CreditCard />}
        />

        <Step
          title="Review"
          link="/placeorder"
          active={step3}
          completed={false}
          icon={<ShoppingBag />}
        />
      </div>
    </div>
  );
};

const Step = ({ title, link, active, completed, icon }) => {
  const content = (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
          completed
            ? "bg-green-500 text-white"
            : active
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {completed ? (
          <Check className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
          React.cloneElement(icon, {
            className: "w-5 h-5 md:w-6 md:h-6"
          })
        )}
      </div>
      <span
        className={`mt-1 text-xs md:text-sm font-medium ${
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