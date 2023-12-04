// js imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// project imports
const UserCrud = require("./crud/UserCrud");
const UserModel = require("../models/UserModel");
const jwtUtils = require("../../utils/jwtUtils");
const { JWTTokenTypes } = require("../../../enums/token");

// fetch all the users
const getAllUser = async (req, res) => {
  // console.log(req);
  // await new Promise(r => setTimeout(r, 2000));
  try {
    if (req.body.data) {
      var query = { _id: { $in: req.body.designerIds } };
      var users = await UserCrud.fetchAll(query);
    } else if (req.query) {
      users = await UserCrud.fetchAll(req.query);
    } else {
      users = await UserCrud.fetchAll();
    }
    const serializeData = users.map((e) => {
      return {
        id: e.id,
        full_name: e.full_name,
        email: e.email,
        user_type: e.user_type,
        designation: e.designation,
        projects: e.projects,
        profilePicture: e.profilePicture,
      };
    });
    res.status(200).json({
      data: serializeData,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    const params = req.params.idOrEmail;
    const emailMatched = params.match(emailRegex);
    let user;
    if (emailMatched) {
      user = await UserCrud.fetchByEmail(params);
    } else {
      user = await UserCrud.fetchById(params);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const serializeData = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type,
      designation: user.designation,
      projects: user.projects,
      profilePicture: user.profilePicture,
    };
    console.log("serializeData", serializeData);
    res.status(200).json({
      data: serializeData,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  await new Promise((r) => setTimeout(r, 2000));
  try {
    const userid = req.params.idOrEmail;
    const dataToUpdate = req.body.data;
    const updateUser = await UserCrud.updateUser(userid, dataToUpdate);
    const serializeData = {
      full_name: updateUser.full_name,
      email: updateUser.email,
      designation: updateUser.designation,
      projects: updateUser.projects,
      profilePicture: updateUser.profilePicture,
    };
    res.status(200).json({
      updatedUserData: serializeData,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  // console.log("Body: ",req.body);
  const isExists = await UserCrud.fetchByEmail(req.body.email);
  if (isExists) {
    res.status(400).json({
      message: "User Already Exists",
    });
  } else {
    try {
      const userData = UserModel({
        full_name: req.body.full_name,
        email: req.body.email,
        user_type: req.body.user_type,
        designation: req.body.designation,
        password: req.body.password,
        profilePicture: req.body.profilePicturePath,
        createdAt: Date.now(),
      });
      const user = await UserCrud.create(userData);
      const serializeData = {
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type,
        designation: user.designation,
        createdAt: Date.now(),
      };
      res.json({
        status: "success",
        message: "User Created Successfully",
        data: serializeData,
      });
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
};

const deleteUser = async (req, res) => {
  try {
    const userid = req.params.idOrEmail;
    console.log(userid);
    const user = await UserCrud.deleteUser(userid);
    res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// const login = async (req, res) => {
//     try {
//         var user = await UserCrud.fetchByEmail(req.body.email);
//         if (user){
//             if (bcrypt.compareSync(req.body.password, user.password)) {
//                 const accessTokenPayload = {
//                     id: user.id,
//                     user_type: user.user_type,
//                     token_type: JWTTokenTypes.ACCESS_TOKEN,
//                 };
//                 const refreshTokenPayload = {
//                     id: user.id,
//                     token_type: JWTTokenTypes.REFRESH_TOKEN,
//                 }
//                 const access_token = jwtUtils.createToken(accessTokenPayload)
//                 const refresh_token = jwtUtils.createToken(refreshTokenPayload)
//                 res.cookie("access_token", access_token, {
//                     httpOnly: true,
//                     secure: true,
//                     sameSite: 'strict',
//                     maxAge: 3600000
//                 });

//                 res.status(200).json({
//                     status: "success",
//                     message: "User Logged In Successfully",
//                     access_token: access_token,
//                     refresh_token: refresh_token,
//                 })
//             } else {
//                 res.status(401).json({
//                     success: "failed",
//                     message: "Invalid Password"
//                 })
//             }
//         } else {
//             res.status(404).json({
//                 status: "failed",
//                 message: "User does not exists"
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: error
//         })
//     }
// }

const login = async (req, res) => {
  console.log("data", req.body);
  try {
    var user = await UserCrud.fetchByEmail(req.body.email);
    if (user) {
      if (bcrypt.compare(req.body.password, user.password)) {
        const accessTokenPayload = {
          id: user.id,
          email: user.email,
          user_type: user.user_type,
          token_type: JWTTokenTypes.ACCESS_TOKEN,
        };
        const refreshTokenPayload = {
          id: user.id,
          email: user.email,
          token_type: JWTTokenTypes.REFRESH_TOKEN,
        };
        const access_token = jwt.sign(
          accessTokenPayload,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "5m" }
        );
        const refresh_token = jwt.sign(
          refreshTokenPayload,
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("jwt", refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ access_token });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

const verifyToken = async (req, res) => {
  const id = req.body.id;
  const user = await UserCrud.fetchById(id);
  const userData = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    user_type: user.user_type,
    profilePicture: user.profilePicture,
    designation: user.designation,
    projects: user.projects,
  };

  if (id) {
    res.status(200).json({
      status: "success",
      message: "Token Verified",
      verified: true,
      user: userData,
    });
  } else {
    res.status(400).json({
      message: "Invalid Token or An error Occured",
      status: "false",
    });
  }
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refresh_token = cookies.jwt;

  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({ email: decoded.email }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
      const accessTokenPayload = {
        id: foundUser.id,
        email: foundUser.email,
        user_type: foundUser.user_type,
        token_type: JWTTokenTypes.ACCESS_TOKEN,
      };

      const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      res.json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  getAllUser,
  getUser,
  createUser,
  login,
  refresh,
  verifyToken,
  logout,
  updateUser,
  deleteUser,
};
