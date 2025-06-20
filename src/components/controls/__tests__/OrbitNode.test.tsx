import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import OrbitNode from '../Orbit'

describe('OrbitNode', () => {
  it('renders a circle with given props', () => {
    const { container } = render(
      <svg>
        <OrbitNode centerX={100} centerY={100} radius={50} speed={0} size={10} color="red" />
      </svg>
    )
    const circle = container.querySelector('circle')
    expect(circle).toBeInTheDocument()
    expect(circle).toHaveAttribute('fill', 'red')
  })

  it('renders children as function', () => {
    render(
      <svg>
        <OrbitNode centerX={0} centerY={0} radius={0} speed={0} size={5} color="blue">
          {(x, y) => <text data-testid="child-text">{`${x},${y}`}</text>}
        </OrbitNode>
      </svg>
    )
    expect(screen.getByTestId('child-text')).toBeInTheDocument()
  })

  it('renders children as node', () => {
    render(
      <svg>
        <OrbitNode centerX={0} centerY={0} radius={0} speed={0} size={5} color="blue">
          <text data-testid="child-node">child</text>
        </OrbitNode>
      </svg>
    )
    expect(screen.getByTestId('child-node')).toBeInTheDocument()
  })
}) 