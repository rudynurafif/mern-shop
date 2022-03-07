import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Main Admin',
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
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123123', 10),
  },
]

export default users