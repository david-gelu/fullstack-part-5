import React, { useState } from 'react'
import blogService from '../services/blogs'

const updateLikes = (id) => {
  blogService.update(`${id}`, (request, response) => {
    const resBody = response.req.body
    let data = {
      user: resBody.user,
      likes: resBody.likes + 1,
      author: resBody.author,
      title: resBody.title,
      url: resBody.url
    }
    console.log('Update likes with success')
    return response.status(200).send(data)
  })
}

const deletedBlog = async (id) => {
  await blogService.deleteBlog(id)
}

const Blog = ({ blog }) => {
  const [blogDetails, setBlogDetails] = useState(true)
  const [blogId, setBlogId] = useState('')
  const style = {
    border: '3px solid #ddd',
    paddingInline: '1rem',
    marginBlock: '0.5rem'
  }
  const idMaker = (id) => {
    setBlogId(id)
  }
  return (
    <>
      {blogDetails ? <div> {blog.title} {blog.author} <button onClick={() => {
        idMaker(blog.id)
        setBlogDetails(!blogDetails)
      }}>Show details</button>
      </div>
        : <div style={style}>
          <p>Title: {blog.title}</p>
          <p>Author: {blog.author}</p>
          <p>Url: {blog.url}</p>
          <p>Likes: {blog.Likes}</p> {blog.id === blogId && <button onClick={() => updateLikes(blog.id)}>Likes + 1</button>}
          <button onClick={() => { window.confirm(`delete blog with title ${blog.title}`); deletedBlog(blog.id) }}>Delete blog</button>
          <button onClick={() => {
            idMaker(blog.id)
            setBlogDetails(!blogDetails)
          }}>Hide details</button>
        </div>}
    </>)
}

export default Blog