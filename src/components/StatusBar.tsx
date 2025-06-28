import React from "react";

export default function StatusBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/50 backdrop-blur-sm border-t border-border py-1 px-4">
      <div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center gap-2 select-none">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="text-sm text-muted-foreground">Connected</p>
        </div>
      </div>
    </div>
  );
}
