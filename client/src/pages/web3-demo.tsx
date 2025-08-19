import React from 'react';
import OnchainPaymentModal from '../components/OnchainPaymentModal';

// Demo component showing the OnchainPaymentModal integration
const Web3PaymentDemo = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Web3Modal + WalletConnect Integration Demo</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h3 className="text-lg font-semibold mb-2">Stock Prediction Model</h3>
        <p className="text-gray-600 mb-4">Advanced ML model for stock price prediction</p>
        
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">
            Subscribe
          </button>
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-gray-100 px-3 py-2 rounded border hover:bg-gray-200"
            title="Pay with Crypto"
          >
            💳
          </button>
        </div>
      </div>
      
      <OnchainPaymentModal
        modelId={1}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modelName="Stock Prediction Model"
        price={0.1}
      />
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Features:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Web3Modal unified wallet connection</li>
          <li>✅ MetaMask support</li>
          <li>✅ WalletConnect mobile wallet support</li>
          <li>✅ Ethereum payment processing</li>
          <li>✅ Server-side transaction verification</li>
          <li>✅ Integrated with existing UI components</li>
        </ul>
      </div>
    </div>
  );
};

export default Web3PaymentDemo;