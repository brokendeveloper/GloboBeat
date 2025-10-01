import { forwardRef, type ReactNode } from "react"

export interface FieldProps {
  label?: ReactNode
  children: ReactNode
  color?: string
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(props, ref) {
  const { label, children, color = "inherit", ...rest } = props
  return (
    <div ref={ref} {...rest}>
      {label && (
        <label
          style={{
            display: "block",
            color,
            fontSize: "0.875rem",
            fontWeight: "500",
            marginBottom: "0.5rem",
          }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  )
})