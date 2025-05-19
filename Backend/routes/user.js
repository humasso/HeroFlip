const express = require('express');
const User    = require('../models/User');
const router  = express.Router();
const connectDB = require('../functions/dbconnection');
require('dotenv').config();

