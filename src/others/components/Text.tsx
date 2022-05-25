export interface TextProps {
  alignment?: "center" | "left" | "right";
  variant?: "normal" | "light" | "bold";
  className?: string;
}

export const Text: React.FunctionComponent<TextProps> = ({ alignment = "left", variant = "normal", className, children }) => {
  return (
    <p
      className={className}
      style={{ textAlign: alignment, opacity: variant === "light" ? 0.6 : 1, fontWeight: variant === "bold" ? "bold" : "regular" }}
    >
      {children}
    </p>
  );
};
