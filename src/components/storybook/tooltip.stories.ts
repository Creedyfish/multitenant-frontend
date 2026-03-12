import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Settings, Bell, Info } from 'lucide-react'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) =>
      React.createElement(TooltipProvider, {
        delayDuration: 0,
        children: React.createElement(Story),
      }),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () =>
    React.createElement(
      Tooltip,
      {},
      React.createElement(
        TooltipTrigger,
        { asChild: true },
        React.createElement(Button, { variant: 'outline' }, 'Hover me'),
      ),
      React.createElement(
        TooltipContent,
        { className: 'bg-slate-800 border-slate-700 text-slate-50' },
        'This is a tooltip',
      ),
    ),
}

export const WithIcon: Story = {
  render: () =>
    React.createElement(
      Tooltip,
      {},
      React.createElement(
        TooltipTrigger,
        { asChild: true },
        React.createElement(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            className:
              'h-8 w-8 text-slate-400 hover:text-slate-50 hover:bg-slate-800',
          },
          React.createElement(Settings, { size: 16 }),
        ),
      ),
      React.createElement(
        TooltipContent,
        {
          side: 'right',
          className: 'bg-slate-800 border-slate-700 text-slate-50',
        },
        'Settings',
      ),
    ),
}

export const SidebarCollapsed: Story = {
  render: () =>
    React.createElement(
      'div',
      {
        className:
          'flex flex-col gap-1 bg-slate-900 p-2 rounded-xl border border-slate-800 w-[60px]',
      },
      ...[
        { label: 'Dashboard', Icon: Settings },
        { label: 'Notifications', Icon: Bell },
        { label: 'Info', Icon: Info },
      ].map(({ label, Icon }) =>
        React.createElement(
          Tooltip,
          { key: label },
          React.createElement(
            TooltipTrigger,
            { asChild: true },
            React.createElement(
              Button,
              {
                variant: 'ghost',
                size: 'icon',
                className:
                  'w-full h-9 text-slate-400 hover:text-slate-50 hover:bg-slate-800',
              },
              React.createElement(Icon, { size: 16 }),
            ),
          ),
          React.createElement(
            TooltipContent,
            {
              side: 'right',
              className: 'bg-slate-800 border-slate-700 text-slate-50',
            },
            label,
          ),
        ),
      ),
    ),
}
