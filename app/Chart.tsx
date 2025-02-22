"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Draggable from "./components/Draggable";
import { AnimatePresence } from "motion/react";
import { mockFetch } from "./mock";

const QUERY_KEY = "items";
type Direction = { id: number; label: string | number };
export default function Chart() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(100);
  const [draggedItemId, setDraggedItemId] = useState(0);
  const [draggedColId, setDraggedColId] = useState(0);
  const [draggedRowId, setDraggedRowId] = useState(0);
  const [cols, setCols] = useState<Direction[]>([]);
  const [rows, setRows] = useState<Direction[]>([]);
  const [items, setItems] = useState<
    {
      id: number;
    }[]
  >([]);

  const { data, status } = useQuery({
    queryFn: async () => {
      // this is mock data from api
      const result = await mockFetch(currentPage, pageSize);
      const { items } = result;
      setItems(items);
      setCols(
        new Array(pageSize / 10).fill(true).map((_, i) => ({
          id: i,
          label: i + 1,
        })),
      );
      setRows(
        new Array(pageSize / 10).fill(true).map((_, i) => ({
          id: i,
          label: i + 1,
        })),
      );
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

  function handleColShuffle(colId: number) {
    const newItems = [...items];
    for (let i = 0; i < 10; ++i) {
      const draggedIndex = draggedColId + 10 * i;
      const targetIndex = colId + 10 * i;
      // Swap items between the dragged column and the target column
      [newItems[draggedIndex], newItems[targetIndex]] = [
        newItems[targetIndex],
        newItems[draggedIndex],
      ];
    }
    setItems(newItems);
    const dragged = cols.find((c) => c.id === draggedColId);
    const hovered = cols.find((c) => c.id === colId);
    setCols(
      cols.map((c) => {
        const { id } = c;
        if (id === draggedColId)
          return {
            id,
            label: hovered?.label ?? 0,
          };
        if (id === colId)
          return {
            id,
            label: dragged?.label ?? 0,
          };
        return c;
      }),
    );
  }

  function handleRowShuffle(rowId: number) {
    const newItems = [...items];
    for (let i = 0; i < 10; ++i) {
      const draggedIndex = draggedRowId * 10 + i;
      const targetIndex = rowId * 10 + i;
      // Swap items between the dragged column and the target column
      [newItems[draggedIndex], newItems[targetIndex]] = [
        newItems[targetIndex],
        newItems[draggedIndex],
      ];
    }
    setItems(newItems);
    const dragged = rows.find((c) => c.id === draggedRowId);
    const hovered = rows.find((c) => c.id === rowId);
    setRows(
      cols.map((c) => {
        const { id } = c;
        if (id === draggedRowId)
          return {
            id,
            label: hovered?.label ?? 0,
          };
        if (id === rowId)
          return {
            id,
            label: dragged?.label ?? 0,
          };
        return c;
      }),
    );
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
          {cols.map(({ id, label }) => {
            return (
              <Draggable
                key={`col ${id}`}
                id={id}
                onSetDraggedItemId={(id) => setDraggedColId(id)}
                onShuffle={handleColShuffle}
                className={
                  "px-4 py-2 rounded-lg text-slate-500 cursor-pointer hover:bg-slate-200 active:bg-slate-200 transition duration-200"
                }
              >
                {label}
              </Draggable>
            );
          })}
        </div>

        <div className="absolute h-full -left-12 top-0 flex flex-col justify-between items-center">
          {rows.map(({ id, label }) => {
            return (
              <Draggable
                key={`row ${id}`}
                id={id}
                onSetDraggedItemId={(id) => setDraggedRowId(id)}
                onShuffle={handleRowShuffle}
                className={
                  "px-4 py-2 rounded-lg text-slate-500 cursor-pointer hover:bg-slate-200 active:bg-slate-200 transition duration-200"
                }
              >
                {label}
              </Draggable>
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
                className="h-10 w-10 bg-white bg-opacity-20 border-white border  rounded-xl flex justify-center
                items-center font-bold text-slate-500 cursor-pointer  transition-all  duration-200 shadow-lg"
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
