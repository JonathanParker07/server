import express from "express"

import { create, deleteUser, getAllUsers, getUserById, update, searchStudents } from "../controller/userController.js"

const route = express.Router();

route.post("/user", create);
route.get("/users", getAllUsers);
route.get("/user/:id", getUserById);
route.put("/update/user/:id", update);
route.delete("/delete/user/:id", deleteUser);
route.get("/search", searchStudents);

export default route;