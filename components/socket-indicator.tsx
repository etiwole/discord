'use client';

import React from 'react';
import {useSocket} from "@/components/providers/SockerProvider";
import {Badge} from "@/components/ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-600 text-white border-none"
      >
        Fallback: Pooling every 1s
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="bg-emerald-600 text-white border-none"
    >
      Live: Real-time updates
    </Badge>
  )
};

export default SocketIndicator;