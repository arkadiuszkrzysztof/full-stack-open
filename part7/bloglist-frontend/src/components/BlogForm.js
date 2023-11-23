import { useState } from 'react'

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const BlogForm = ({ addNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const cleanUp = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const submitBlog = (event) => {
    event.preventDefault()

    addNewBlog(
      {
        title: title,
        author: author,
        url: url,
      },
      cleanUp
    )
  }

  return (
    <Form onSubmit={submitBlog}>
      <Row>
        <Col xs={3}>
          <Form.Label>Title</Form.Label>
        </Col>
        <Col>
          <Form.Control
            id="form-title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Form.Label>Author</Form.Label>
        </Col>
        <Col>
          <Form.Control
            id="form-author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Form.Label>Url</Form.Label>
        </Col>
        <Col>
          <Form.Control
            id="form-url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Col>
      </Row>
      <Button id="create-button" type="submit">
        Create
      </Button>
    </Form>
  )
}

export default BlogForm
