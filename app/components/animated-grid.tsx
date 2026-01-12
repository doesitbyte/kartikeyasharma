"use client";

import { motion } from "framer-motion";
import { Children, ReactNode } from "react";

interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGrid({ children, className = "" }: AnimatedGridProps) {
  const childrenArray = Children.toArray(children);
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
