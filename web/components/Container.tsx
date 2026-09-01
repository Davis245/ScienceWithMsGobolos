import type { HTMLAttributes, ReactNode } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav'
  children: ReactNode
}

export default function Container({ as: Component = 'div', children, className = '', ...props }: ContainerProps) {
  return (
    <Component className={`mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8 ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}
