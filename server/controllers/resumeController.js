import Resume from "../models/Resume";
import imagekit from "../configs/imageKit";
import fs from 'fs';

// Controller for creating a new resume
// POST: /api/resumes/create
export const CreateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        // create new resume
        const newResume = await Resume.create({userId, title});
        // return success message
        return res.status(201).json({message: 'Resume created successfully', resume: newResume})
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// Controller for deleting a new resume
// POST: /api/resumes/delete
export const DeleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId, _id: resumeId})
        // return success message
        return res.status(200).json({message: 'Resume deleted successfully'})
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}


// Get user resume by id
// GET: /api/resumes/get
export const GetResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId, _id: resumeId})

        if (!resume) {
            return res.status(404).json({message: 'Resume Not Found'})
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

// Get resume by id public
// GET: /api/resumes/public
export const GetPublicResumeById = async (req, res) => {
    try {
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId})

        if (!resume) {
            return res.status(404).json({message: 'Resume Not Found'})
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({message: error.message});
        
    }
}

// Controller for updating a resume
// PUT: /api/resumes/update

export const UpdateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;

        let resumeDataCopy = JSON.parse(resumeData);

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);

            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300, h-300, fo-face, z-0.75' +
                    (removeBackground ? ', e-bgremove' : '')
                } 
            });
            resumeDataCopy.personal_info.image = response.url;
        }

        const resume = await Resume.findByIdAndUpdate({userId, _id: resumeId}, resumeDataCopy
            , {new: true}
        );
        
        return res.status(200).json({message: 'Saved Successfully', resume})

    } catch (error) {
        return res.status(400).json({message: error.message});
        
    }
}