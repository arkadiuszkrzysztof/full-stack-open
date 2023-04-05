import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const addNewBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm addNewBlog={addNewBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const createButton = screen.getByText('create')

    await user.type(inputs[0], 'My Secret Life')
    await user.type(inputs[1], 'James Bond')
    await user.type(inputs[2], 'https://some.url')

    await user.click(createButton)

    act(() => {
        addNewBlog.mock.calls[0][1]()
    })

    expect(addNewBlog.mock.calls).toHaveLength(1)
    expect(addNewBlog.mock.calls[0][0].title).toBe('My Secret Life')
    expect(addNewBlog.mock.calls[0][0].author).toBe('James Bond')
    expect(addNewBlog.mock.calls[0][0].url).toBe('https://some.url')
})