import { PieChart } from "@/components/charts/pie-chart";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function AnimatedCharts() {
  const [isCollapsed, setCollapsed] = useState(true);

  const allCharts = [1, 2, 3, 4, 5, 6, 7, 8];
  const visibleCharts = isCollapsed ? [1, 3, 5] : allCharts;
  const existingCharts = [1, 3, 5]; // Charts that are always visible

  // Group definitions: first chart of each group and their titles
  const groups = [
    { firstChart: 1, title: "Fuel" },
    { firstChart: 4, title: "Financial" },
    { firstChart: 6, title: "Other" },
  ];

  const getGroupTitle = (chartIndex: number) => {
    const group = groups.find(g => g.firstChart === chartIndex);
    return group?.title;
  };

  const getGridColumn = (chartIndex: number, collapsed: boolean) => {
    if (collapsed) {
      // In collapsed state, charts appear consecutive:
      // Chart 1 → position 1, Chart 3 → position 2, Chart 5 → position 3
      const collapsedMap: Record<number, number> = { 1: 1, 3: 2, 5: 3 };
      return collapsedMap[chartIndex] || 0;
    } else {
      // In expanded state: Row 1 has charts 1-5, Row 2 has charts 6-8
      if (chartIndex <= 5) {
        // Row 1: charts 1-5 in columns 1-5
        return chartIndex;
      } else {
        // Row 2: charts 6-8 in columns 1-3
        return chartIndex - 5;
      }
    }
  };

  const getGridRow = (chartIndex: number, collapsed: boolean) => {
    if (collapsed) {
      return 1;
    } else {
      // In expanded state: Row 1 has charts 1-5, Row 2 has charts 6-8
      return chartIndex <= 5 ? 1 : 2;
    }
  };

  return (
    <div className="p-4">
      <Button onClick={() => setCollapsed(!isCollapsed)} className="mb-4">
        {isCollapsed ? "Expand" : "Collapse"}
      </Button>
      <motion.div
        className={`grid gap-1 justify-center items-center grid-cols-5`}
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

              // New charts appear with staggered delay
              if (chartIndex <= 5) {
                // Row 1: charts 2, 4 appear with staggered delay
                return (chartIndex - 1) * 0.05;
              } else {
                // Row 2: charts 6, 7, 8 appear after first row
                return 0.2 + (chartIndex - 6) * 0.05;
              }
            };

            // Check if this chart starts a new group and has a group on the left in the same row
            // Chart 4 starts group 2 in row 1 (has group 1 on the left) - needs gap
            // Chart 6 starts group 3 in row 2 (no group on the left) - no gap
            const isGroupStart = !isCollapsed && chartIndex === 4;
            const groupTitle = !isCollapsed ? getGroupTitle(chartIndex) : null;
            const isFirstInGroup = groupTitle !== null;

            return (
              <motion.div
                key={chartIndex}
                layoutId={`chart-container-${chartIndex}`}
                className="flex flex-col gap-2"
                style={{
                  gridColumn: gridCol,
                  gridRow: gridRow,
                  marginLeft: isGroupStart ? '32px' : undefined
                }}
                initial={false}
                animate={{ opacity: 1 }}
                transition={{
                  layout: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                    delay: isCollapsed && isExistingChart ? 0.25 : 0
                  }
                }}
                layout
              >
                {isFirstInGroup && (
                  <motion.h3
                    className="text-lg font-semibold text-center mb-0"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                      delay: getEntranceDelay()
                    }}
                  >
                    {groupTitle}
                  </motion.h3>
                )}
                <motion.div
                  layoutId={`chart-${chartIndex}`}
                  className="w-[250px] h-[250px] shrink-0"
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
