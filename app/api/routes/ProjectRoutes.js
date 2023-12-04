const express = require('express');
const projectRouter = express.Router();

const { allProjects, createProject, getProject, updateProject } = require("../controllers/ProjectController")

projectRouter.route("/").get(allProjects)
projectRouter.route("/:id").get(getProject).put(updateProject)
projectRouter.route("/create").post(createProject)

module.exports = { projectRouter }