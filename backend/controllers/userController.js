const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = await User.create({ email, password });

    res.status(201).json({ message: 'Registered successfuly', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email' });
      }

      if(user.password == password){
            res.status(201).json({ message:"Ok", userId: user.id });
        }
    else{
            res.status(401).json({message: "Invalid credentials"})
        }    
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };