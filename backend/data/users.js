import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123123', 10),
    isAdmin: true
  },
  {
    name: 'Rudy Nurafif',
    email: 'rudy@example.com',
    password: bcrypt.hashSync('123123', 10),
  },
  {
    name: 'Some People',
    email: 'people@example.com',
    password: bcrypt.hashSync('123123', 10),
  },
]

export default users