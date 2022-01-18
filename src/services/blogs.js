import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(request => request.data)
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const blog = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return blog.data
}


const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const blog = await axios.delete(`${baseUrl}/${id}`, config)
  return blog.data
}

export default { getAll, create, update, deleteBlog, setToken }
