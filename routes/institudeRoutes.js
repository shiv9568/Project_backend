import { Router } from "express";
import {
    getAllInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution
} from "../controllers/getInstitution.js";

const router = Router();

router.route('/')
.get(getAllInstitutions)
.post(createInstitution);

router.get('/:id', getInstitutionById);
router.put('/:id', updateInstitution);
router.delete('/:id', deleteInstitution);

export default router;
