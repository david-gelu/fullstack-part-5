import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './AppCss.css'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogTitle, setBlogTitle] = useState("")
  const [blogAuthor, setBlogAuthor] = useState("")
  const [blogUrl, setBlogUrl] = useState("")
  const [blogLikes, setBlogLikes] = useState(0)

  const [errorMessage, setErrorMessage] = useState(null)
  const [confirmMsg, setConfirmMsg] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedBlogUser = window.localStorage.getItem("loggedBlogUser")
    if (loggedBlogUser) {
      const user = JSON.parse(loggedBlogUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input type="text" value={username} name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input type="password" value={password} name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

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
    window.localStorage.removeItem("loggedBlogUser")
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
      .then(returnedBlog => {
        setBlogs(blogs.concat(addBlog))
        setConfirmMsg({ message: `a new blog ${blogTitle} by ${blogAuthor}` })
        setTimeout(() => {
          setConfirmMsg(null)
        }, 5000)
        setBlogTitle("")
        setBlogLikes("")
        setBlogAuthor("")
        setBlogUrl("")
      })
      .catch(error => {
        setErrorMessage(`${error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })

  }

  const createBlog = () => {
    return (
      <div>
        <form onSubmit={(e) => { handleCreateBlog(e) }}>
          <span className='mr-1'>
            blog title:
            <input type="text" value={blogTitle} name="blogTitle"
              onChange={({ target }) => setBlogTitle(target.value)}
            />
          </span>
          <span className='mr-1'>
            blog author:
            <input type="text" value={blogAuthor} name="blogAuthor"
              onChange={({ target }) => setBlogAuthor(target.value)}
            />
          </span>
          <span className='mr-1'>
            blog url:
            <input type="text" value={blogUrl} name="blogUrl"
              onChange={({ target }) => setBlogUrl(target.value)}
            />
          </span>
          <span className='mr-1'>
            blog likes:
            <input type="number" value={blogLikes} name="blogLikes"
              onChange={({ target }) => setBlogLikes(target.value)}
            />
          </span>
          <button type="submit">Create blog</button>
        </form>
      </div>
    )
  }

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
          {createBlog()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
      <footer>Creating fullstack app is hard, if u are a junior :{`)`}</footer>
    </div>
  )
}

export default App