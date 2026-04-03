import * as React from 'react'

import { cn } from '#/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

// import * as React from 'react'
// import { cn } from '#/lib/utils'

// interface InputProps extends React.ComponentProps<'input'> {
//   type?: string
//   onChange?: (value: any) => void
// }

// function Input({ className, type, value, onChange, ...props }: InputProps) {
//   const isNumber = type === 'number'
//   const [internal, setInternal] = React.useState(
//     isNumber && value != null ? value.toString() : (value ?? ''),
//   )

//   React.useEffect(() => {
//     if (isNumber) setInternal(value != null ? value.toString() : '')
//   }, [value, isNumber])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (isNumber) {
//       const digitsOnly = e.target.value.replace(/\D/g, '')
//       setInternal(digitsOnly)
//       const num = digitsOnly === '' ? 0 : Number(digitsOnly)
//       onChange?.(num)
//     } else {
//       setInternal(e.target.value)
//       onChange?.(e.target.value)
//     }
//   }

//   return (
//     <input
//       {...props}
//       type={isNumber ? 'text' : type} // keep text for numbers to allow deletion
//       value={internal}
//       onChange={handleChange}
//       data-slot="input"
//       className={cn(
//         'border-input selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
//         'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
//         'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
//         className,
//       )}
//     />
//   )
// }

// export { Input }
