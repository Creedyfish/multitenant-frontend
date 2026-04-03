import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () =>
    React.createElement(
      Dialog,
      {},
      React.createElement(
        DialogTrigger,
        { asChild: true },
        React.createElement(Button, {}, 'Open dialog'),
      ),
      React.createElement(
        DialogContent,
        { className: 'border-border bg-card text-foreground' },
        React.createElement(
          DialogHeader,
          {},
          React.createElement(DialogTitle, {}, 'Dialog title'),
          React.createElement(
            DialogDescription,
            { className: 'text-muted-foreground' },
            'A short description of what this dialog does.',
          ),
        ),
        React.createElement(
          'p',
          { className: 'text-sm text-muted-foreground' },
          'Dialog body content goes here.',
        ),
        React.createElement(
          DialogFooter,
          {},
          React.createElement(
            DialogClose,
            { asChild: true },
            React.createElement(Button, { variant: 'outline' }, 'Cancel'),
          ),
          React.createElement(Button, {}, 'Confirm'),
        ),
      ),
    ),
}

export const ConfirmDelete: Story = {
  render: () =>
    React.createElement(
      Dialog,
      {},
      React.createElement(
        DialogTrigger,
        { asChild: true },
        React.createElement(
          Button,
          { variant: 'destructive' },
          'Delete product',
        ),
      ),
      React.createElement(
        DialogContent,
        { className: 'border-border bg-card text-foreground' },
        React.createElement(
          DialogHeader,
          {},
          React.createElement(DialogTitle, {}, 'Delete product?'),
          React.createElement(
            DialogDescription,
            { className: 'text-muted-foreground' },
            'This will permanently remove the product from your inventory. This action cannot be undone.',
          ),
        ),
        React.createElement(
          DialogFooter,
          {},
          React.createElement(
            DialogClose,
            { asChild: true },
            React.createElement(Button, { variant: 'outline' }, 'Cancel'),
          ),
          React.createElement(
            Button,
            { variant: 'destructive' },
            'Yes, delete',
          ),
        ),
      ),
    ),
}

export const WithForm: Story = {
  render: () =>
    React.createElement(
      Dialog,
      {},
      React.createElement(
        DialogTrigger,
        { asChild: true },
        React.createElement(Button, {}, 'Add warehouse'),
      ),
      React.createElement(
        DialogContent,
        { className: 'border-border bg-card text-foreground' },
        React.createElement(
          DialogHeader,
          {},
          React.createElement(DialogTitle, {}, 'New warehouse'),
          React.createElement(
            DialogDescription,
            { className: 'text-muted-foreground' },
            'Add a new warehouse location to your organization.',
          ),
        ),
        React.createElement(
          'div',
          { className: 'space-y-3 py-2' },
          React.createElement(Input, { placeholder: 'Warehouse name' }),
          React.createElement(Input, { placeholder: 'Location / address' }),
        ),
        React.createElement(
          DialogFooter,
          {},
          React.createElement(
            DialogClose,
            { asChild: true },
            React.createElement(Button, { variant: 'outline' }, 'Cancel'),
          ),
          React.createElement(Button, {}, 'Create warehouse'),
        ),
      ),
    ),
}
