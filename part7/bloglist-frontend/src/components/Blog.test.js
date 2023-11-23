import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders collapsed content', () => {
  const blog = {
    title: 'My Secret Life',
    author: 'James Bond',
    url: 'https://some.url',
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('My Secret Life', { exact: false })
  expect(title).toBeDefined()

  const url = screen.queryByText('https://some.url', { exact: false })
  expect(url).toBeNull()
})

test('renders full content', async () => {
  const blog = {
    title: 'My Secret Life',
    author: 'James Bond',
    url: 'https://some.url',
    likes: 1234,
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()

  await user.click(screen.getByText('view'))

  const url = screen.getByText('https://some.url', { exact: false })
  expect(url).toBeDefined()

  const likes = screen.getByText('1234', { exact: false })
  expect(likes).toBeDefined()
})

test('clicking twice the like button calls event handler twice', async () => {
  const blog = {
    title: 'My Secret Life',
    author: 'James Bond',
    url: 'https://some.url',
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()

  await user.click(screen.getByText('view'))

  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('clicking the delete button calls event handler once', async () => {
  const blog = {
    title: 'My Secret Life',
    author: 'James Bond',
    url: 'https://some.url',
    user: { id: '1234' },
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} handleDelete={mockHandler} currentUserId="1234" />)

  const user = userEvent.setup()

  await user.click(screen.getByText('view'))

  const confirmSpy = jest.spyOn(window, 'confirm')
  confirmSpy.mockImplementation(jest.fn(() => true))

  const button = screen.getByText('remove')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
