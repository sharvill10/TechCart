import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Truck, CreditCard, ShoppingBag } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-between items-center w-full my-6">
      <Step 
        number={1}
        title="Shipping"
        link="/shipping"
        active={step1}
        completed={step2 || step3}
        icon={<Truck size={16} />}
      />
      <Connector active={step2 || step3} />
      
      <Step 
        number={2}
        title="Payment"
        link="/payment"
        active={step2}
        completed={step3}
        icon={<CreditCard size={16} />}
      />
      <Connector active={step3} />
      
      <Step 
        number={3}
        title="Review"
        link="/placeorder"
        active={step3}
        completed={false}
        icon={<ShoppingBag size={16} />}
      />
    </div>
  );
};

const Step = ({ number, title, link, active, completed, icon }) => {
  const content = (
    <div className="flex flex-col items-center">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-1.5 transition-colors ${
        completed ? 'bg-green-500 text-white' : 
        active ? 'bg-blue-600 text-white' : 
        'bg-gray-200 text-gray-500'
      }`}>
        {completed ? <Check size={18} /> : icon || number}
      </div>
      <span className={`text-sm font-medium transition-colors ${
        completed ? 'text-green-600' : 
        active ? 'text-blue-600' : 
        'text-gray-400'
      }`}>
        {title}
      </span>
    </div>
  );

  if (active) {
    return <Link to={link}>{content}</Link>;
  }
  
  return <div className={`${!active && 'cursor-not-allowed'}`}>{content}</div>;
};

const Connector = ({ active }) => {
  return (
    <div className="relative h-1 flex-grow mx-2">
      <div className={`absolute inset-0 ${active ? 'bg-blue-600' : 'bg-gray-200'} transition-colors`}></div>
    </div>
  );
};

export default CheckoutSteps;