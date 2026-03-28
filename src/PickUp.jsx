import React from 'react'

function PickUp({ audRef, ringRef, ring }) {
  return (
    <div>
      <button onClick={() => {
        audRef.pause();
        ringRef.current = true;
        ring(false);
      }}>Decline</button>
    </div>
  )
}

export default PickUp