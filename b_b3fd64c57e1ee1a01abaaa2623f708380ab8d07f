import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const LUXURY_EASE = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 22,
  x = 0,
  scale = 1,
  duration = 0.65,
  once = true,
  amount = 0.15
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: LUXURY_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({
  children,
  className = '',
  stagger = 0.08,
  delayChildren = 0.04,
  once = true,
  amount = 0.1
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', y = 18 }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: LUXURY_EASE }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, routeKey }) {
  const shouldReduceMotion = useReducedMotion();
  const initialRouteRef = React.useRef(routeKey);
  const isInitialMount = initialRouteRef.current === routeKey;

  React.useEffect(() => {
    initialRouteRef.current = null;
  }, []);

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={routeKey}
      initial={isInitialMount ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: LUXURY_EASE }}
    >
      {children}
    </motion.div>
  );
}

