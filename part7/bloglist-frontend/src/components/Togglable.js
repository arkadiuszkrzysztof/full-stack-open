import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <Row>
      <Col style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabelOn}</Button>
      </Col>
      <Card style={showWhenVisible} className='my-2 p-2 bg-dark border-0 text-light'>
        <h2>Create new blog</h2>
        {props.children}
        <Button className='me-auto mt-2' variant='danger' onClick={toggleVisibility}>{props.buttonLabelOff}</Button>
      </Card>
    </Row>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabelOn: PropTypes.string.isRequired,
  buttonLabelOff: PropTypes.string.isRequired,
}

export default Togglable
