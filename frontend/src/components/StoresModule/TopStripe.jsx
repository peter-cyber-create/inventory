import React from 'react';

// TopStripe component with Uganda flag colors
export const TopStripe = ({ height = 10, order = ['black', 'yellow', 'red'] }) => {
  const cols = {
    black: 'bg-black',
    yellow: 'bg-[#FFD100]',
    red: 'bg-[#D90303]'
  };
  
  return (
    <div role="banner" className="w-full fixed top-0 left-0 z-50" style={{height: `${height}px`}}>
      <div className="flex h-full w-full" style={{minHeight: `${height}px`}}>
        {order.map((o) => <div key={o} className={`${cols[o]} flex-1`} />)}
      </div>
    </div>
  );
};

export default TopStripe;
