"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return <Badge className="bg-yellow-600  border-none">Polling</Badge>;
  }

  return (
    <Badge className="bg-emerald-600 text-white rounded-full  border-none">
      Live
    </Badge>
  );
};
