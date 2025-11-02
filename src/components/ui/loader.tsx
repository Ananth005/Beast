import { cn } from "@/lib/utils"
import { Icons } from "../icons"

export function Loader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Icons.logo className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
