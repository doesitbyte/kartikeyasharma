import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  activeHref,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  activeHref?: string;
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        activeHref={activeHref}
        className={desktopClassName}
      />
      <FloatingDockMobile
        items={items}
        activeHref={activeHref}
        className={mobileClassName}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  activeHref,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  activeHref?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.3,
      }}
      className={cn("relative block md:hidden", className)}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-20 p-2 rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-neutral-900/30 border border-border/30 w-[calc(50vw-2rem)] max-w-sm"
          >
            <div className="grid grid-cols-4 gap-y-3 w-full">
              {items.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: {
                      delay: idx * 0.03,
                    },
                  }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex justify-center items-center"
                >
                  <Link
                    href={item.href}
                    className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md border ${
                      activeHref === item.href
                        ? "bg-primary/40 dark:bg-primary/40 border-primary/50"
                        : "bg-white/30 dark:bg-neutral-900/30 border-border/30"
                    }`}
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 dark:bg-neutral-800/30 backdrop-blur-md"
      >
        <Menu className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </motion.div>
  );
};

const FloatingDockDesktop = ({
  items,
  activeHref,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  activeHref?: string;
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.3,
      }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl px-4 pb-3 md:flex",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          mouseX={mouseX}
          key={item.title}
          {...item}
          isActive={activeHref === item.href}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  isActive,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative flex aspect-square items-center justify-center rounded-full backdrop-blur-md border ${
          isActive
            ? "bg-primary/30 dark:bg-primary/30 border-primary/40"
            : "bg-white/20 dark:bg-neutral-800/20 border-border/20"
        }`}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-border/30 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md px-2 py-0.5 text-xs whitespace-pre text-foreground shadow-lg"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}
