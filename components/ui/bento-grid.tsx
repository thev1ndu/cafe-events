import { cn } from "../../lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-4 md:mx-0", // margin left/right only on mobile
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // Glassmorphism: transparent bg, blur, white border, no hover/transition, white text
        "row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-lg p-4",
        className
      )}
    >
      {header}
      <div>
        {icon}
        <div className="mt-2 mb-2 font-sans font-bold text-white">{title}</div>
        <div className="font-sans text-xs font-normal text-white">
          {description}
        </div>
      </div>
    </div>
  );
};
