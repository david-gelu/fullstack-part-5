import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './AppCss.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [blogLikes, setBlogLikes] = useState(0)

  const [errorMessage, setErrorMessage] = useState(null)
  const [confirmMsg, setConfirmMsg] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedBlogUser = window.localStorage.getItem('loggedBlogUser')
    if (loggedBlogUser) {
      const user = JSON.parse(loggedBlogUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => {
    return (
      <Togglable buttonLabel='log in'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const handleCreateBlog = (e) => {
    e.preventDefault()
    const addBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
      likes: blogLikes,
    }

    blogService
      .create(addBlog)
      .catch(error => {
        setErrorMessage(`${error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    let returnedBlog = blogService.getAll()
    setBlogs(returnedBlog)
    setConfirmMsg({ message: `a new blog ${blogTitle} by ${blogAuthor}` })
    setTimeout(() => {
      setConfirmMsg(null)
    }, 5000)
    setBlogTitle('')
    setBlogLikes('')
    setBlogAuthor('')
    setBlogUrl('')

  }


  const toggleVisibility = () => {
    setFormVisible(!formVisible)
  }

  const blogFormParent = () => {
    return (
      !formVisible ?
        <Togglable buttonLabel='new blog'>
          <h2>Create a new blog</h2>
          <form onSubmit={(e) => { handleCreateBlog(e) }}>
            <BlogForm text='blog title' type='text' name='blogTitle' onChange={({ target }) => setBlogTitle(target.value)} />
            <BlogForm text='blog author' type='text' name='blogAuthor' onChange={({ target }) => setBlogAuthor(target.value)} />
            <BlogForm text='blog url' type='text' name='blogUrl' onChange={({ target }) => setBlogUrl(target.value)} />
            <BlogForm text='blog likes' type='number' name='blogLikes' onChange={({ target }) => setBlogLikes(target.value)} />
            <input type={'submit'} onSubmit={(e) => { handleCreateBlog(e) }} />
          </form>
        </Togglable>
        :
        <button onClick={toggleVisibility}>Cancel</button>
    )
  }
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {errorMessage
        ? <h3 className={`${errorMessage ? 'erorr' : ''}`}>{errorMessage}</h3>
        : <h3 className={`${confirmMsg ? 'success' : ''}`}>{confirmMsg}</h3>}
      <h1>Blogs</h1>
      {user === null ?
        loginForm() :
        <div>
          <span className='mr-2'><strong>{user.name}</strong> logged-in</span> <button onClick={handleLogout}>Logout</button>
          {blogFormParent()}
          {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      }
      <footer>Creating fullstack app is hard, if u are a junior :D</footer>
    </div>
  )
}

export default App