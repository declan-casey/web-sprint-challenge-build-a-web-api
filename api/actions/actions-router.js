// Write your "actions" router here!
const express = require('express')

const router = express.Router()

const Actions = require("./actions-model")

router.get("/", (req, res) => {
    Actions.get(req.query)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            res.status(500).json({
                message: `This information could not be retrieved. Error ${err}`
            })
        })
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    Actions.getById(id)
        .then(action => {
            if(!action) {
                res.status(404).json({
                    message: `The action with the ID: ${id} could not be found`
                })
            } else {
                res.status(200).json(action)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `The action information could not be retrieved. ${err} `
            })
        })
})

router.post("/", (req, res) => {
    const newAction = req.body

    if(!newAction.description || !newAction.notes){
        res.status(400).json({
            message: "Please provide a description and notes"
        })
    } else {
        Actions.insert(newAction)
            .then(action => {
                res.status(201).json(action)
            })
            .catch( err => {
                res.status(500).json({
                    message: `There was an error while saving this action to the database. ${err}`
                })
            })
    }
})

router.put("/:id", (req, res) => {
    changes = req.body
    id = req.params.id

    Actions.update(id, changes)
        .then(change => {
            if(change){
                res.status(200).json(change)
            } else if(!req.description || req.notes){
                res.status(400).json({
                    message: "Please provide a description and notes"
                })
            } else {
                res.status(404).json({
                    message: `The action with ID: ${id} could not be found`
                })
            }
        })
        .catch( err => {
            res.status(500).json({
                message: `The action informtion coulde not be modified. ${err}`
            })
        })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id

    Actions.remove(id)
        .then(deleted => {
            if(!deleted){
                res.status(404).json({
                    message: `The action with the ID: ${id} does not exist`
                })
            } else {
                res.status(200).json(deleted)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `The action could not be deleted. ${err}`
            })
        })
})

module.exports = router