const ProjectModel = require("../models/ProjectModel");
const ProjectCrud = require("../controllers/crud/ProjectCrud");
const {updateDeals, fetchById} = require("../controllers/crud/DealManagerCrud");
const { DealsStatusEnum } = require("../../../enums/deals");

const allProjects = async (req, res) => {
  try {
    const { search, fromDate, toDate, page = 1, limit = 10 } = req.query
    let filter = {}

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { projectName: { $regex: searchRegex } },
        { clientName: { $regex: searchRegex } }
      ]
    }

    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate), // Greater than or equal to fromDate
        $lte: new Date(toDate)     // Less than or equal to toDate
      }
    }

    const totalProjects = await ProjectCrud.countProjects()
    const totalPages = Math.ceil(totalProjects / limit)
    const options = {
      limit: limit,
      skip: (page - 1) * limit
    }

    const sortType = ['createdAt', -1]
    const projects = await ProjectCrud.getAllProjects(filter, options, sortType)
    res.status(200).json({
      message: "success",
      data: projects,
      currentPage: page,
      totalPages: totalPages,
      totalProjects: totalProjects 
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed",
      error: error.message,
    });
  }
};

const getProject = async (req, res) => {
  try {
    const id = req.params.id
    const project = await ProjectCrud.getProjectById(id)
    if (!project) {
      res.status(404).json({
        error: "Project not found"
      })
      return;
    }
    res.status(200).json({
      message: "succes",
      data: project
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

const createProject = async (req, res) => {
  try {
    const deal = await fetchById(req.body.dealId)
    console.log("deal",req.body.id)
    if (deal) {
      const projectData = ProjectModel({
        createdBy: req.body.createdBy,
        projectName: req.body.projectName,
        projectType: req.body.projectType,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        duration: req.body.duration,
        clientName: req.body.clientName,
        production: req.body.production,
        primaryDesigners: [req.body.primaryDesigners],
        secondaryDesigners: [req.body.secondaryDesigners],
        files: req.body.files,
        dealId: req.body.dealId,
        createdAt: Date.now()
      })
      await projectData.save();

      await updateDeals(req.body.dealId, { status: DealsStatusEnum.projectCreated })

      res.status(200).json({
        message: "succes",
        data: req.body
      })
    } else {
      res.status(404).json({
        message: "failed",
      })
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    })
  }
}


const updateProject = async (req, res) => {
  try {
    const dataToUpdate = req.body
    const projectToUpdate = req.params
    await ProjectCrud.updateProject({_id: projectToUpdate.id}, dataToUpdate)
    res.status(200).json({
      message: "succes",
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message
    })
  }
}

module.exports = { allProjects, createProject, getProject, updateProject };