import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name: { // sebuah field
    type: String,
    required: true
  },
  email: { // sebuah field
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true // membuat field seperti created at atau updated at secara automatically
})


// membuat middleware method untuk mencocokan password dari entered password (login)..
// ..dgn password di database yang mana sudah terenkripsi
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// membuat middleware untuk registrasi (enkripsi password ke database)
userSchema.pre('save', async function (next) {
  // jika password tidak diganti (pada edit profile as an example)
  if (!this.isModified('password')) {
    next()
  }

  // jika modified saat edit profile/password, atau ketika registrasi, encrypt the password asynchronously
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User