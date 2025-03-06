const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/UserAuth"); 

exports.registration = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "Email and password are required", status: false });
    }

    const existingUser = await User.findOne({ where: { email } }); // Use Sequelize syntax
    if (existingUser) {
      return res.status(401).json({ message: "Email already exists", status: false });
    }

    const randomUserName = email.split("@")[0]; 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      userName: randomUserName
    });

    const payload = {
      user: {
        id: newUser.id, 
      },
    };

    const userToken = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ status: true, userToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const payload = {
      user: {
        id: user.id, 
      },
    };

    const userToken = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ status: true, userToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.userDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId }, 
      attributes: { exclude: ["password", "createdDate"] } 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    res.json({
      status: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const [updatedRows] = await User.update(updates, { 
      where: { id: userId } 
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    const updatedUser = await User.findOne({ 
      where: { id: userId }, 
      attributes: { exclude: ["password", "createdDate"] } 
    });

    res.json({
      message: "User updated successfully",
      status: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedRows = await User.destroy({ where: { id: userId } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    res.json({
      message: `Successfully deleted user ${req.user.email}`,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};