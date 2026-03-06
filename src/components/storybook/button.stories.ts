import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2, Trash2 } from 'lucide-react'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Get started', variant: 'default' },
}

export const Secondary: Story = {
  args: { children: 'See features', variant: 'secondary' },
}

export const Outline: Story = {
  args: { children: 'Learn more', variant: 'outline' },
}

export const Ghost: Story = {
  args: { children: 'Sign in', variant: 'ghost' },
}

export const Destructive: Story = {
  args: { children: 'Delete item', variant: 'destructive' },
}

export const Link: Story = {
  args: { children: 'View docs', variant: 'link' },
}

export const Small: Story = {
  args: { children: 'Save', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Get started free', size: 'lg' },
}

export const WithIcon: Story = {
  render: () =>
    React.createElement(
      Button,
      {},
      'Get started ',
      React.createElement(ArrowRight, { size: 14 }),
    ),
}

export const IconOnly: Story = {
  render: () =>
    React.createElement(
      Button,
      { size: 'icon', variant: 'outline' },
      React.createElement(Trash2, { size: 16 }),
    ),
}

export const Loading: Story = {
  render: () =>
    React.createElement(
      Button,
      { disabled: true },
      React.createElement(Loader2, { size: 14, className: 'animate-spin' }),
      'Saving…',
    ),
}

export const Disabled: Story = {
  render: () => React.createElement(Button, { disabled: true }, 'Unavailable'),
}
