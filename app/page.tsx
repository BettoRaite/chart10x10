"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Chart from "./Chart";

export default function Home() {
  const q = new QueryClient();
  return (
    <div className="min-h-screen flex justify-center items-center flex-col bg-slate-300">
      <QueryClientProvider client={q}>
        <Chart />
      </QueryClientProvider>
    </div>
  );
}
