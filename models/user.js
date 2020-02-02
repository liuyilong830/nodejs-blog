const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog' , {useNewUrlParser:true , useUnifiedTopology: true })

const Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  last_modify_time: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    enum: [-1,0,1],
    default: -1
  },
  birthday: {
    type: Date
  },
  status: {
    type: Number,
    enum: [0,1,2], // 用户的权限：0 => 没有权限限制；1 => 不能评论；2 => 不能登录
    default: 0
  }
})

module.exports = mongoose.model('User' , userSchema)