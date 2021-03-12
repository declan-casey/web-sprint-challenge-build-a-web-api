// Write your "projects" router here!
const express = require('express')

const router = express.Router()

const Projects = require("./projects-model")

router.get("/", (req, res) => {
    Projects.get(req.query)
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({
                message: `This information could not be retrieved. Error ${err}`
            })
        })
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    Projects.getById(id)
        .then(project => {
            if(!project) {
                res.status(404).json({
                    message: `The project with the ID: ${id} could not be found`
                })
            } else {
                res.status(200).json(project)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `The project information could not be retrieved. ${err} `
            })
        })
})

router.post("/", (req, res) => {
    const newProject = req.body

    if(!newProject.description || !newProject.notes){
        res.status(400).json({
            message: "Please provide a description and notes"
        })
    } else {
        Projects.insert(newProject)
            .then(project => {
                res.status(201).json(project)
            })
            .catch( err => {
                res.status(500).json({
                    message: `There was an error while saving this project to the database. ${err}`
                })
            })
    }
})

router.put("/:id", (req, res) => {
    changes = req.body
    id = req.params.id

    Projects.update(id, changes)
        .then(change => {
            if(change){
                res.status(200).json(change)
            } else if(!req.description || req.notes){
                res.status(400).json({
                    message: "Please provide a description and notes"
                })
            } else {
                res.status(404).json({
                    message: `The project with ID: ${id} could not be found`
                })
            }
        })
        .catch( err => {
            res.status(500).json({
                message: `The project informtion coulde not be modified. ${err}`
            })
        })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id

    Projects.remove(id)
        .then(deleted => {
            if(!deleted){
                res.status(404).json({
                    message: `The project with the ID: ${id} does not exist`
                })
            } else {
                res.status(200).json(deleted)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `The project could not be deleted. ${err}`
            })
        })
})

Projects.get('/:id/actions', (req, res) => {
    const id = req.params.id
    Projects.get(id)
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(500).json({
                message: `Could not return actions for this project. ${err}`
            })
        })
})

module.exports = router