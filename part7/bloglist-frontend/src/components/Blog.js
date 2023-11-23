import { Link } from 'react-router-dom'

import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

const Blog = ({ blog }) => {
  return (
    <Card className='my-2 p-2 bg-light border-2'>
      <Row>
        <Col className='d-flex align-items-center'>
          <span className='fs-5'><strong>{blog.title}</strong> {blog.author}</span>
          <Button to={`/blogs/${blog.id}`} as={Link} variant='primary' className='ms-4'>View</Button>
        </Col>
      </Row>
    </Card>
  )
}

export default Blog
