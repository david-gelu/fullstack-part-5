import React from 'react'

const BlogForm = ({ text, name, type, handleChange }) => {

  return (
    <>
      <span className='mr-1'> {text}:
        <input
          type={type}
          name={name}
          onChange={handleChange}
        />
      </span>
    </>
  )
}

export default BlogForm