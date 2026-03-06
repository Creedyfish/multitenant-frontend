import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'

const meta = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) =>
      React.createElement(
        'div',
        { className: 'w-72' },
        React.createElement(Story),
      ),
  ],
  argTypes: {
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: [50], min: 0, max: 100, step: 1 },
}

export const WithValue: Story = {
  render: () => {
    function SliderWithValue() {
      const [value, setValue] = useState([40])
      return React.createElement(
        'div',
        { className: 'w-72 space-y-3' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between' },
          React.createElement(
            'span',
            { className: 'text-sm text-muted-foreground' },
            'Stock threshold',
          ),
          React.createElement(
            'span',
            { className: 'text-sm font-semibold text-foreground' },
            `${value[0]} units`,
          ),
        ),
        React.createElement(Slider, {
          value,
          onValueChange: setValue,
          min: 0,
          max: 200,
          step: 5,
        }),
        React.createElement(
          'div',
          { className: 'flex justify-between text-xs text-muted-foreground' },
          React.createElement('span', {}, '0'),
          React.createElement('span', {}, '200'),
        ),
      )
    }
    return React.createElement(SliderWithValue)
  },
}

export const Range: Story = {
  render: () => {
    function RangeSlider() {
      const [value, setValue] = useState([20, 80])
      return React.createElement(
        'div',
        { className: 'w-72 space-y-3' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between' },
          React.createElement(
            'span',
            { className: 'text-sm text-muted-foreground' },
            'Price range',
          ),
          React.createElement(
            'span',
            { className: 'text-sm font-semibold text-foreground' },
            `$${value[0]} – $${value[1]}`,
          ),
        ),
        React.createElement(Slider, {
          value,
          onValueChange: setValue,
          min: 0,
          max: 500,
          step: 10,
        }),
      )
    }
    return React.createElement(RangeSlider)
  },
}

export const Disabled: Story = {
  args: { defaultValue: [30], disabled: true },
}
