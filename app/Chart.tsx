"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Draggable from "./components/Draggable";
import { AnimatePresence } from "motion/react";
import { mockFetch } from "./mock";

const QUERY_KEY = "items";
export default function Chart() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [draggedItemId, setDraggedItemId] = useState(0);
  const [items, setItems] = useState<
    {
      id: number;
    }[]
  >([]);

  const { data, status } = useQuery({
    queryFn: async () => {
      // this is mock data from api
      const result = await mockFetch(currentPage, pageSize);
      setItems(result.items);
      return result;
    },
    // Setting a dynamic query key to distiquish between queries
    queryKey: [QUERY_KEY, currentPage],
  });
  if (status === "pending") {
    return "loading";
  }
  if (status === "error") {
    return "error";
  }
  function handleShuffle(hoveredItemId: number) {
    // 0^3 run time :))))))))))) well we have 100 items, so do not think it's such a prob
    const draggedItem = items.find((i) => i.id === draggedItemId);
    const hoveredItem = items.find((i) => i.id === hoveredItemId);
    if (draggedItem && hoveredItem) {
      setItems(
        items.map((i) => {
          const { id } = i;
          // Simply replace dragged item with hovered and vice versa
          if (id === draggedItemId) {
            return hoveredItem;
          }
          if (id === hoveredItemId) {
            return draggedItem;
          }
          return i;
        }),
      );
    }
    // not possible but possible
  }

  function createPageClickHandler(page: number) {
    return () => {
      setCurrentPage(page);
    };
  }

  const {
    pagination: { totalItems },
  } = data;

  return (
    <div className="mt-10">
      <div className="relative grid grid-cols-10 grid-rows-10 gap-4">
        <div className="absolute w-full left-0 right-0 -top-12 flex justify-between">
          {new Array(totalItems / pageSize).fill(true).map((_, id) => {
            return (
              <span className={"px-4 py-2 rounded-lg text-slate-500"} key={id}>
                {id + 1}
              </span>
            );
          })}
        </div>

        <div className="absolute h-full -left-12 top-0 flex flex-col justify-between items-center">
          {new Array(totalItems / pageSize).fill(true).map((_, id) => {
            return (
              <span className={"px-4 py-2 rounded-lg text-slate-500"} key={id}>
                {id + 1}
              </span>
            );
          })}
        </div>

        <AnimatePresence>
          {items.map(({ id }) => {
            return (
              <Draggable
                key={id}
                id={id}
                onSetDraggedItemId={(id) => setDraggedItemId(id)}
                onShuffle={handleShuffle}
              >
                {id + 1}
              </Draggable>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-4 my-5 flex-wrap">
        {new Array(totalItems / pageSize).fill(true).map((_, id) => {
          return (
            <button
              onClick={createPageClickHandler(id + 1)}
              className={`
                        px-4 py-2 rounded-lg
                        border border-blue-500
                        text-blue-500
                        hover:bg-blue-500 hover:text-white
                        transition-all duration-200
                        focus:outline-none
                        active:bg-blue-600 active:border-blue-600
                        ${currentPage === id + 1 ? "bg-blue-500 text-white" : ""}
              `}
              key={id}
            >
              {id}
            </button>
          );
        })}
      </div>
    </div>
  );
}
