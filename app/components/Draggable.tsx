"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "classnames";
import { useCallback } from "react";
import { motion } from "motion/react";
type Props = {
  id: number;
  onSetDraggedItemId: (id: number) => void;
  onShuffle: (id: number) => void;
  children: ReactNode;
};
function Draggable({ id, onSetDraggedItemId, onShuffle, children }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement | null>(null);
  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      onSetDraggedItemId(id);
    },
    [position.x, position.y],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      }
    },
    [isDragging, offset.x, offset.y],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        setPosition({ x: 0, y: 0 }); // Reset position
      } else {
        if (isHovered) {
          console.log(`Item ${id} is hovered and mouse is released.`);
          onShuffle(id);
        }
      }
    },
    [isDragging, isHovered, id],
  );

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  return (
    <motion.div
      animate={{
        scale: [0, 1],
      }}
      ref={divRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={{
        left: isDragging ? position.x : 0,
        top: isDragging ? position.y : 0,
        zIndex: isDragging ? 10 : 0,
      }}
      className={clsx(
        `h-10 w-10 bg-white bg-opacity-20 border-white border  rounded-xl flex justify-center items-center font-bold
          text-slate-500 cursor-pointer relative transition-all  duration-200 select-none`,
        "shadow-lg",
        {
          "scale-150 transition-none pointer-events-none": isDragging,
        },
      )}
    >
      {children}
    </motion.div>
  );
}

export default Draggable;
