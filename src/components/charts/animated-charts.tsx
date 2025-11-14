import { PieChart } from "@/components/charts/pie-chart";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function AnimatedCharts() {
  const [isCollapsed, setCollapsed] = useState(true);

  const allCharts = [1, 2, 3, 4, 5, 6, 7, 8];
  const visibleCharts = isCollapsed ? [1, 3, 5] : allCharts;
  const existingCharts = [1, 3, 5]; // Charts that are always visible

  const getGridColumn = (chartIndex: number, collapsed: boolean) => {
    if (collapsed) {
      // In collapsed state, charts appear consecutive:
      // Chart 1 → position 1, Chart 3 → position 2, Chart 5 → position 3
      const collapsedMap: Record<number, number> = { 1: 1, 3: 2, 5: 3 };
      return collapsedMap[chartIndex] || 0;
    } else {
      // In expanded state, charts 1-5 in first row, 6-8 in second row
      if (chartIndex <= 5) {
        return chartIndex;
      } else {
        return chartIndex - 5;
      }
    }
  };

  const getGridRow = (chartIndex: number, collapsed: boolean) => {
    if (collapsed) {
      return 1;
    } else {
      return chartIndex <= 5 ? 1 : 2;
    }
  };

  return (
    <div className="p-4">
      <Button onClick={() => setCollapsed(!isCollapsed)} className="mb-4">
        {isCollapsed ? "Expand" : "Collapse"}
      </Button>
      <motion.div
        className="grid grid-cols-5 gap-4 justify-center items-center"
        layout
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence>
          {allCharts.map((chartIndex) => {
            const isVisible = visibleCharts.includes(chartIndex);
            const isExistingChart = existingCharts.includes(chartIndex);
            const gridCol = getGridColumn(chartIndex, isCollapsed);
            const gridRow = getGridRow(chartIndex, isCollapsed);

            if (!isVisible) return null;

            const getEntranceDelay = () => {
              if (isExistingChart) return 0;

              // New charts in first row (2, 4) appear with staggered delay
              if (chartIndex <= 5) {
                return (chartIndex - 1) * 0.05;
              }
              // Charts in second row (6, 7, 8) appear after first row
              return 0.2 + (chartIndex - 6) * 0.05;
            };

            return (
              <motion.div
                key={chartIndex}
                layoutId={`chart-${chartIndex}`}
                className="w-[250px] h-[250px] shrink-0"
                style={{
                  gridColumn: gridCol,
                  gridRow: gridRow
                }}
                initial={isExistingChart ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  transition: {
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                transition={{
                  layout: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                    delay: isCollapsed && isExistingChart ? 0.25 : 0
                  },
                  opacity: isExistingChart ? { duration: 0 } : {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                    delay: getEntranceDelay()
                  },
                  scale: isExistingChart ? { duration: 0 } : {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                    delay: getEntranceDelay()
                  }
                }}
                layout
              >
                <PieChart />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
