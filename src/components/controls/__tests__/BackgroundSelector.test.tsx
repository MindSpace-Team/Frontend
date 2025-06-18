/* eslint-disable */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import BackgroundSelector from '../BackgroundSelector'
import { useBackgroundStore } from '@/store/backgroundStore'

// Mock the store
jest.mock('@/store/backgroundStore')

const mockUseBackgroundStore = useBackgroundStore as any

describe('BackgroundSelector', () => {
  const mockSetBackground = jest.fn()
  
  beforeEach(() => {
    mockUseBackgroundStore.mockReturnValue({
      currentBackground: '/space/space1.webp',
      setBackground: mockSetBackground,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders background selector with title', () => {
    render(<BackgroundSelector />)
    
    expect(screen.getByText('배경 선택')).toBeInTheDocument()
  })

  it('renders all background options', () => {
    render(<BackgroundSelector />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3) // space1, space2, space3
  })

  it('shows current background as selected', () => {
    mockUseBackgroundStore.mockReturnValue({
      currentBackground: '/space/space2.webp',
      setBackground: mockSetBackground,
    })

    render(<BackgroundSelector />)
    
    const buttons = screen.getAllByRole('button')
    const selectedButton = buttons[1] // space2 should be selected
    
    expect(selectedButton).toHaveClass('border-blue-500')
  })

  it('calls setBackground when a background is clicked', () => {
    render(<BackgroundSelector />)
    
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1]) // Click space2
    
    expect(mockSetBackground).toHaveBeenCalledWith('/space/space2.webp')
  })

  it('displays background preview images', () => {
    render(<BackgroundSelector />)
    
    const images = screen.getAllByAltText('background preview')
    expect(images).toHaveLength(3)
    
    expect(images[0]).toHaveAttribute('src', '/space/space1.webp')
    expect(images[1]).toHaveAttribute('src', '/space/space2.webp')
    expect(images[2]).toHaveAttribute('src', '/space/space3.webp')
  })
}) 