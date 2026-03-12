import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Settings, LogOut, User } from 'lucide-react'

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () =>
    React.createElement(
      DropdownMenu,
      {},
      React.createElement(
        DropdownMenuTrigger,
        { asChild: true },
        React.createElement(
          Button,
          { variant: 'outline', className: 'gap-2' },
          'Open menu',
          React.createElement(ChevronDown, { size: 14 }),
        ),
      ),
      React.createElement(
        DropdownMenuContent,
        { className: 'w-48 bg-slate-900 border-slate-700 text-slate-300' },
        React.createElement(
          DropdownMenuLabel,
          { className: 'text-slate-400 text-xs font-normal' },
          'Actions',
        ),
        React.createElement(DropdownMenuSeparator, {
          className: 'bg-slate-700',
        }),
        React.createElement(
          DropdownMenuItem,
          {
            className: 'hover:bg-slate-800 hover:text-slate-50 cursor-pointer',
          },
          'Edit',
        ),
        React.createElement(
          DropdownMenuItem,
          {
            className: 'hover:bg-slate-800 hover:text-slate-50 cursor-pointer',
          },
          'Duplicate',
        ),
        React.createElement(DropdownMenuSeparator, {
          className: 'bg-slate-700',
        }),
        React.createElement(
          DropdownMenuItem,
          {
            className:
              'hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer text-rose-400',
          },
          'Delete',
        ),
      ),
    ),
}

export const UserMenu: Story = {
  render: () =>
    React.createElement(
      DropdownMenu,
      {},
      React.createElement(
        DropdownMenuTrigger,
        { asChild: true },
        React.createElement(
          Button,
          {
            variant: 'ghost',
            className:
              'flex items-center gap-2.5 h-8 px-2 hover:bg-slate-800 rounded-lg',
          },
          React.createElement(
            'span',
            {
              className:
                'flex items-center justify-center h-6 w-6 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold',
            },
            'JD',
          ),
          React.createElement(
            'div',
            { className: 'flex flex-col items-start leading-none' },
            React.createElement(
              'span',
              { className: 'text-slate-50 text-xs font-medium' },
              'Jane Doe',
            ),
            React.createElement(
              'span',
              { className: 'text-slate-500 text-xs' },
              'ADMIN',
            ),
          ),
        ),
      ),
      React.createElement(
        DropdownMenuContent,
        {
          align: 'end',
          className: 'w-52 bg-slate-900 border-slate-700 text-slate-300',
        },
        React.createElement(
          DropdownMenuLabel,
          { className: 'text-slate-400 text-xs font-normal' },
          'jane@logisticore.io',
        ),
        React.createElement(DropdownMenuSeparator, {
          className: 'bg-slate-700',
        }),
        React.createElement(
          DropdownMenuItem,
          {
            className:
              'hover:bg-slate-800 hover:text-slate-50 cursor-pointer text-sm gap-2',
          },
          React.createElement(User, { size: 14 }),
          'Profile',
        ),
        React.createElement(
          DropdownMenuItem,
          {
            className:
              'hover:bg-slate-800 hover:text-slate-50 cursor-pointer text-sm gap-2',
          },
          React.createElement(Settings, { size: 14 }),
          'Settings',
        ),
        React.createElement(DropdownMenuSeparator, {
          className: 'bg-slate-700',
        }),
        React.createElement(
          DropdownMenuItem,
          {
            className:
              'hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer text-sm text-rose-400 gap-2',
          },
          React.createElement(LogOut, { size: 14 }),
          'Sign out',
        ),
      ),
    ),
}

export const WithDestructive: Story = {
  render: () =>
    React.createElement(
      DropdownMenu,
      {},
      React.createElement(
        DropdownMenuTrigger,
        { asChild: true },
        React.createElement(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            className:
              'h-8 w-8 text-slate-400 hover:text-slate-50 hover:bg-slate-800',
          },
          '⋯',
        ),
      ),
      React.createElement(
        DropdownMenuContent,
        {
          align: 'end',
          className: 'w-44 bg-slate-900 border-slate-700 text-slate-300',
        },
        React.createElement(
          DropdownMenuItem,
          {
            className:
              'hover:bg-slate-800 hover:text-slate-50 cursor-pointer text-sm',
          },
          'View details',
        ),
        React.createElement(
          DropdownMenuItem,
          {
            className:
              'hover:bg-slate-800 hover:text-slate-50 cursor-pointer text-sm',
          },
          'Edit',
        ),
        React.createElement(DropdownMenuSeparator, {
          className: 'bg-slate-700',
        }),
        React.createElement(
          DropdownMenuItem,
          {
            className:
              'hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer text-sm text-rose-400',
          },
          'Delete',
        ),
      ),
    ),
}
